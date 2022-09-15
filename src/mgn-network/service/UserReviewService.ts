import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserReviewApi } from "../integration/UserReviewApi";
import { UserReview } from "../model/UserReview";
import { UserReviewRepository } from "../repository/UserReviewRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const userReviewRepository = new UserReviewRepository();

export class UserReviewService implements UserReviewApi {

    public async getBusinessReviews(businessId: number) {
        const connection = await db.connection();

        const businessReviews = await userReviewRepository.findByBusinessId(businessId, connection);
        await connection.release();
        
        return businessReviews;
    }

    public async getUserReviews(userId: number) {
        const connection = await db.connection();

        const usersReviews = await userReviewRepository.findByUserId(userId, connection);
        await connection.release();

        return usersReviews;
    }

    public async addBusinessReview(dto: any, businessId: number, loggedUserId: number) {
        await Precondition.checkIfFalse((!dto.text), "Text Missing");
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUser = await this.createUserReview(dto, businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();
        
        return newUser;
    }

    public async deleteUserReview(userReviewId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeUserReview(userReviewId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createUserReview(reviewDTO: any, businessId: number, loggedUserId: number, connection) {
        try {
            const newReview = new UserReview();
            newReview.text = reviewDTO.text;
            newReview.business_id = businessId;
            newReview.user_id = loggedUserId;

            const coInserted = await userReviewRepository.save(newReview, connection);
            newReview.id = coInserted.insertId;
            LOG.info("NEW BUSINESS", newReview.id);
            return newReview;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS", 500, null, e);
        }
    }

    private async removeUserReview(userReviewId: number, loggedUserId: number, connection) {
        const review = await userReviewRepository.findById(userReviewId, connection);
        if (!review || review.id != loggedUserId) return review;
        try {
            await userReviewRepository.delete(review, connection);
            return review;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Review", 500, null, e);
        }
    }

}
