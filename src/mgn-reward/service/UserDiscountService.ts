import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { PushNotificationSender } from "../../mgn-framework/services/PushNotificationSender";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserDiscountApi } from "../integration/UserDiscountApi";
import { UserDiscount } from "../model/UserDiscount";
import { BusinessDiscountRepository } from "../repository/BusinessDiscountRepository";
import { UserDiscountRepository } from "../repository/UserDiscountRepository";
import { UserFidelityCardService } from "./UserFidelityCardService";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const userDiscountRepository = new UserDiscountRepository();
const userBusinessRepository = new UserBusinessRepository();
const businessDiscountRepository = new BusinessDiscountRepository();
const userFidelityCardService = new UserFidelityCardService();
export class UserDiscountService implements UserDiscountApi {

    public async addUserDiscount(dto: any, userId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUserDiscount = await this.createUserDiscount(dto, userId, null, connection);
        await connection.commit();
        await connection.release();
        
        return newUserDiscount;
    }

    public async addUserOriginDiscount(businessId: number, userId: number, origin: 'FIDELITY_CARD'|'IG_POST'|'REFERRAL', connection) {
        const businessDiscount = await businessDiscountRepository.findActiveByBusinessIdAndOrigin(businessId, origin, connection);
        if (!businessDiscount) {
            return;
        }

        const dto = {
            business_id: businessId,
            discount_id: businessDiscount.id
        };
        const newUserDiscount = await this.createUserDiscount(dto, userId, null, connection);
        PushNotificationSender.sendToUser(newUserDiscount.user_id, 'PREMIO', 'Hai un nuovo premio!');
        return newUserDiscount;
    }

    public async addUserReferralDiscount(businessId: number, userId: number, referralId: number, connection) {
        const businessDiscount = await businessDiscountRepository.findActiveByBusinessIdAndOrigin(businessId, 'REFERRAL', connection);
        if (!businessDiscount) {
            return;
        }

        const usersDiscount = await userDiscountRepository.findByUserIdAndBusinessId(userId, businessId, connection);
        if (!usersDiscount.length) {
            await userFidelityCardService.addUserFidelityCardInternal(businessId, userId, connection);
            const dto = {
                business_id: businessId,
                discount_id: businessDiscount.id
            };
            const newUserDiscount = await this.createUserDiscount(dto, userId, referralId, connection);
            return newUserDiscount;
        } else {
            return null;
        }
    }

    public async updateUserDiscount(dto: any, userDiscountId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUserDiscount = await this.setUserDiscount(dto, userDiscountId, connection);
        await connection.commit();
        await connection.release();
        
        return newUserDiscount;
    }

    public async suspendUserDiscount(userDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateUserDiscountStatus('SUSPENDED', userDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async activateUserDiscount(businessDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateUserDiscountStatus('ACTIVE', businessDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async getUserDiscounts(userId: number) {
        const connection = await db.connection();

        const usersDiscounts = await userDiscountRepository.findActiveByUserIdJoinBusiness(userId, connection);
        await connection.release();

        return usersDiscounts;
    }

    public async getUserDiscount(userDiscountId: number) {
        const connection = await db.connection();

        const userDiscount = await userDiscountRepository.findById(userDiscountId, connection);
        await connection.release();

        return userDiscount;
    }

    public async deleteUserDiscount(userDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.removeUserDiscount(userDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createUserDiscount(discountDTO: any, userId: number, referralId: number = null, connection) {
        try {
            const newDiscount = new UserDiscount();
            newDiscount.user_id = userId;
            if (referralId) newDiscount.referral_id = referralId;
            newDiscount.business_id = +discountDTO.business_id;
            newDiscount.discount_id = +discountDTO.discount_id;
            newDiscount.status = 'ACTIVE';

            const coInserted = await userDiscountRepository.save(newDiscount, connection);
            newDiscount.id = coInserted.insertId;
            LOG.info("NEW USER DISCOUNT", newDiscount.id);
            return newDiscount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create USER DISCOUNT", 500, null, e);
        }
    }

    private async setUserDiscount(discountDTO: any, userDiscountId: number, connection) {
        try {
            const discount = await userDiscountRepository.findById(userDiscountId, connection);
            discount.business_id = +discountDTO.business_id;
            discount.discount_id = +discountDTO.discount_id;

            await userDiscountRepository.update(discount, connection);
            LOG.info("UPDATE USER DISCOUNT", discount.id);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot UPDATE USER DISCOUNT", 500, null, e);
        }
    }

    private async removeUserDiscount(businessDiscountId: number, businessesIds: number[], connection) {
        const discount = await userDiscountRepository.findById(businessDiscountId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        try {
            await userDiscountRepository.delete(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete User Discount", 500, null, e);
        }
    }

    private async updateUserDiscountStatus(status: string, userDiscountId: number, businessesIds: number[], connection) {
        const discount = await userDiscountRepository.findById(userDiscountId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        try {
            discount.status = status;
            await userDiscountRepository.update(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update User Discount Status", 500, null, e);
        }
    }

}
