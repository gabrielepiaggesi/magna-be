import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { BusinessDiscountApi } from "../integration/BusinessDiscountApi";
import { BusinessDiscount } from "../model/BusinessDiscount";
import { BusinessDiscountRepository } from "../repository/BusinessDiscountRepository";
import { UserDiscountRepository } from "../repository/UserDiscountRepository";
import { UserFidelityCard } from '../model/UserFidelityCard';
import { UserFidelityCardRepository } from '../repository/UserFidelityCardRepository';
import { BusinessFidelityCardService } from "./BusinessFidelityCardService";
import { UserDiscountService } from "./UserDiscountService";
import { UserReferralRepository } from '../repository/UserReferralRepository';
import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { isDateToday } from "../../utils/Helpers";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const businessDiscountRepository = new BusinessDiscountRepository();
const userDiscountRepository = new UserDiscountRepository();
const userBusinessRepository = new UserBusinessRepository();
const userFidelityCardRepository = new UserFidelityCardRepository();
const businessFidelityCardService = new BusinessFidelityCardService();
const userDiscountService = new UserDiscountService();
const userReferralRepository = new UserReferralRepository();

export class BusinessDiscountService implements BusinessDiscountApi {

    public async addBusinessDiscount(dto: any, businessId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newBusinessDiscount = await this.createBusinessDiscount(dto, businessId, connection);
        await connection.commit();
        await connection.release();
        
        return newBusinessDiscount;
    }

    public async updateBusinessDiscount(dto: any, businessDiscountId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newBusinessDiscount = await this.setBusinessDiscount(dto, businessDiscountId, connection);
        await connection.commit();
        await connection.release();
        
        return newBusinessDiscount;
    }

    public async suspendBusinessDiscount(businessDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateBusinessDiscountStatus('SUSPENDED', businessDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async activateBusinessDiscount(businessDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateBusinessDiscountStatus('ACTIVE', businessDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async checkUserDiscountValidity(userDiscountId: number, businessId: number) {
        const connection = await db.connection();
        const userDiscount = await userDiscountRepository.findById(userDiscountId, connection);
        const userCards = await userFidelityCardRepository.findActiveByUserIdAndBusinessId(userDiscount.user_id, userDiscount.business_id, connection);
        if (!userCards.length) {
            LOG.error('Premio senza carta!', userDiscount.id);
            await connection.release();
            return;
        }
        const userFidelityCard = userCards[0];
        
        await Precondition.checkIfTrue(
            userDiscount && 
            !isDateToday(userDiscount.last_scan) && 
            // !isDateToday(userFidelityCard.last_scan) && 
            userDiscount.business_id === +businessId && 
            userDiscount.status == 'ACTIVE', 'USER DISCOUNT INVALID', 
        connection, 403);

        // if (isDateToday(userDiscount.last_scan) || isDateToday(userFidelityCard.last_scan)) {
        //     await connection.release();
        //     return;
        // }

        if (isDateToday(userDiscount.last_scan)) {
            await connection.release();
            return;
        }
        
        const businessDiscount = await businessDiscountRepository.findById(userDiscount.discount_id, connection);
        await Precondition.checkIfTrue(businessDiscount && businessDiscount.status == 'ACTIVE', 'BUSINESS DISCOUNT INVALID', connection, 403);
        await connection.newTransaction();
        const business = await this.updateUserDiscountStatus('USED', userDiscount.id, [businessId], connection);

        if (userDiscount.referral_id) {
            const referral = await userReferralRepository.findById(userDiscount.referral_id, connection);
            await userDiscountService.addUserOriginDiscount(userDiscount.business_id, referral.user_id, 'REFERRAL', connection);
        }

        await businessFidelityCardService.checkUserFidelityCardValidityInternal(userFidelityCard.id, userDiscount.business_id, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async getBusinessDiscounts(businessId: number) {
        const connection = await db.connection();

        const businessDiscounts = await businessDiscountRepository.findByBusinessId(businessId, connection);
        await connection.release();

        return businessDiscounts;
    }

    public async getBusinessDiscount(businessDiscountId: number) {
        const connection = await db.connection();

        const businessDiscount = await businessDiscountRepository.findById(businessDiscountId, connection);
        await connection.release();

        return businessDiscount;
    }

    public async deleteBusinessDiscount(businessDiscountId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.removeBusinessDiscount(businessDiscountId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createBusinessDiscount(discountDTO: any, businessId: number, connection) {
        try {
            const newDiscount = new BusinessDiscount();
            newDiscount.type = discountDTO.type;
            newDiscount.business_id = +businessId;
            newDiscount.origin = discountDTO.origin;
            newDiscount.amount = +discountDTO.amount;
            if (discountDTO.monthly_limit) newDiscount.monthly_limit = +discountDTO.monthly_limit;
            if (discountDTO.slogan) newDiscount.slogan = discountDTO.slogan;
            newDiscount.minimum_expense = +discountDTO.minimum_expense;
            newDiscount.status = 'ACTIVE';

            const coInserted = await businessDiscountRepository.save(newDiscount, connection);
            newDiscount.id = coInserted.insertId;
            LOG.info("NEW BUSINESS DISCOUNT", newDiscount.id);
            return newDiscount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS DISCOUNT", 500, null, e);
        }
    }

    private async setBusinessDiscount(discountDTO: any, businessDiscountId: number, connection) {
        try {
            const discount = await businessDiscountRepository.findById(businessDiscountId, connection);
            discount.type = discountDTO.type || discount.type;
            discount.business_id = discountDTO.business_id;
            discount.origin = discount.origin;
            discount.amount = +discountDTO.amount >= 0 ? +discountDTO.amount : discount.amount;
            if (discountDTO.monthly_limit) discount.monthly_limit = +discountDTO.monthly_limit >= 0 ? +discountDTO.monthly_limit : discount.monthly_limit;
            discount.minimum_expense = +discountDTO.minimum_expense >= 0 ? +discountDTO.minimum_expense : discount.minimum_expense;
            discount.status = 'ACTIVE';
            if (discountDTO.slogan) discount.slogan = discountDTO.slogan || discount.slogan;

            await businessDiscountRepository.update(discount, connection);
            LOG.info("UPDATE BUSINESS DISCOUNT", discount.id);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS DISCOUNT", 500, null, e);
        }
    }

    private async updateBusinessDiscountStatus(status: string, businessDiscountId: number, businessesIds: number[], connection) {
        const discount = await businessDiscountRepository.findById(businessDiscountId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        try {
            discount.status = status;
            await businessDiscountRepository.update(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Business Discount Status", 500, null, e);
        }
    }

    private async removeBusinessDiscount(businessDiscountId: number, businessesIds: number[], connection) {
        const discount = await businessDiscountRepository.findById(businessDiscountId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        try {
            await businessDiscountRepository.delete(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Business Discount", 500, null, e);
        }
    }

    private async updateUserDiscountStatus(status: string, userDiscountId: number, businessesIds: number[], connection) {
        const discount = await userDiscountRepository.findById(userDiscountId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        const now = new Date(Date.now()).toLocaleString('sv', {timeZone: 'Europe/Rome'});
        try {
            discount.last_scan = now;
            discount.status = status;
            await userDiscountRepository.update(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Business Discount Status", 500, null, e);
        }
    }

}
