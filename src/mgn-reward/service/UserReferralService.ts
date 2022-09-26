import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserReferralApi } from "../integration/UserReferralApi";
import { UserReferral } from "../model/UserReferral";
import { BusinessDiscountRepository } from "../repository/BusinessDiscountRepository";
import { UserReferralRepository } from "../repository/UserReferralRepository";
import { UserDiscountService } from './UserDiscountService';

const LOG = new Logger("CompanyService.class");
const shortid = require('shortid');
const db = require("../../connection");
const userReferralRepository = new UserReferralRepository();
const businessRepository = new BusinessRepository();
const businessDiscountRepository = new BusinessDiscountRepository();
const userDiscountService = new UserDiscountService();

export class UserReferralService implements UserReferralApi {
    
    public async generateUserReferral(userId: number, businessId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUserReferral = await this.createUserReferral(userId, businessId, connection);
        await connection.commit();
        await connection.release();
        
        return newUserReferral;
    }

    public async getUserReferralInsight(referralId: number) {
        return [];
    }

    public async generateUserDiscountFromReferral(uuid: string, userId: number) {
        const connection = await db.connection();

        const referralCode = await userReferralRepository.findByUUID(uuid, connection);
        const userReferral = await userReferralRepository.findByUserIdAndBusinessId(userId, referralCode.business_id, connection);
        if (!userReferral) {
            await connection.newTransaction();
            await userDiscountService.addUserReferralDiscount(referralCode.business_id, userId, referralCode.id, connection);
            const newUserReferral = await this.createUserReferral(userId, referralCode.business_id, connection);
            await connection.commit();
        }

        await connection.release();
        return userReferral;
    }

    public async getUserReferral(userId: number, businessId: number) {
        const connection = await db.connection();

        const userReferral = await userReferralRepository.findByUserIdAndBusinessId(userId, businessId, connection);
        await connection.release();

        return userReferral;
    }

    private async createUserReferral(userId: number, businessId: number, connection) {
        try {
            const newReferral = new UserReferral();
            newReferral.user_id = userId;
            newReferral.uuid = shortid.generate().toUpperCase();
            newReferral.business_id = +businessId;
            newReferral.status = 'ACTIVE';

            const coInserted = await userReferralRepository.save(newReferral, connection);
            newReferral.id = coInserted.insertId;
            LOG.info("NEW USER REFERRAL", newReferral.id);
            return newReferral;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create USER REFERRAL", 500, null, e);
        }
    }

}
