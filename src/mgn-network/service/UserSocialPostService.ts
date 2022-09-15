import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserSocialPostApi } from "../integration/UserSocialPostApi";
import { UserSocialPost } from "../model/UserSocialPost";
import { UserSocialPostRepository } from "../repository/UserSocialPostRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const userSocialPostRepository = new UserSocialPostRepository();
const businessRepository = new BusinessRepository();

export class UserSocialPostService implements UserSocialPostApi {

    public async getBusinessSocialPosts(businessId: number) {
        const connection = await db.connection();

        const businessSocialPosts = await userSocialPostRepository.findByBusinessId(businessId, connection);
        await connection.release();
        
        return businessSocialPosts;
    }

    public async getUserSocialPosts(userId: number) {
        const connection = await db.connection();

        const userSocialPosts = await userSocialPostRepository.findByUserId(userId, connection);
        await connection.release();

        return userSocialPosts;
    }

    public async getUserSocialPost(userSocialPostId: number) {
        const connection = await db.connection();

        const userSocialPost = await userSocialPostRepository.findById(userSocialPostId, connection);
        await connection.release();

        return userSocialPost;
    }

    public async approveSocialPost(userSocialPostId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await businessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.id);

        await connection.newTransaction();
        const business = await this.updateUserSocialPostStatus('APPROVED', userSocialPostId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async discardSocialPost(userSocialPostId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await businessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.id);

        await connection.newTransaction();
        const business = await this.updateUserSocialPostStatus('DISCARDED', userSocialPostId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async sendSocialPost(dto: any, businessId: number, loggedUserId: number) {
        await Precondition.checkIfFalse((!dto.url), "Post Url Missing");
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUser = await this.createUserSocialPost(dto, businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();
        
        return newUser;
    }

    public async deleteUserSocialPost(userSocialPostId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeUserSocialPost(userSocialPostId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createUserSocialPost(socialPostDTO: any, businessId: number, loggedUserId: number, connection) {
        try {
            const newSocialPost = new UserSocialPost();
            newSocialPost.url = socialPostDTO.url;
            newSocialPost.business_id = businessId;
            newSocialPost.user_id = loggedUserId;
            newSocialPost.social = 'instagram';
            newSocialPost.status = 'PENDING';
            newSocialPost.discount_id = 0;

            const coInserted = await userSocialPostRepository.save(newSocialPost, connection);
            newSocialPost.id = coInserted.insertId;
            LOG.info("NEW SOCIAL POST", newSocialPost.id);
            return newSocialPost;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create SOCIAL POST", 500, null, e);
        }
    }

    private async updateUserSocialPostStatus(status: string, userSocialPostId: number, businessesIds: number[], connection) {
        const socialPost = await userSocialPostRepository.findById(userSocialPostId, connection);
        if (!socialPost || !businessesIds.includes(socialPost.business_id)) return socialPost;
        try {
            socialPost.status = status;
            await userSocialPostRepository.update(socialPost, connection);
            return socialPost;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update SocialPost Status", 500, null, e);
        }
    }

    private async removeUserSocialPost(userSocialPostId: number, loggedUserId: number, connection) {
        const socialPost = await userSocialPostRepository.findById(userSocialPostId, connection);
        if (!socialPost || socialPost.id != loggedUserId) return socialPost;
        try {
            await userSocialPostRepository.delete(socialPost, connection);
            return socialPost;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete SocialPost", 500, null, e);
        }
    }

}
