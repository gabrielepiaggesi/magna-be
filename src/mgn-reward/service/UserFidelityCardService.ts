import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserFidelityCardApi } from "../integration/UserFidelityCardApi";
import { UserFidelityCard } from "../model/UserFidelityCard";
import { BusinessFidelityCardRepository } from "../repository/BusinessFidelityCardRepository";
import { UserFidelityCardRepository } from "../repository/UserFidelityCardRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const userFidelityCardRepository = new UserFidelityCardRepository();
const businessFidelityCardRepository = new BusinessFidelityCardRepository();
const userBusinessRepository = new UserBusinessRepository();

export class UserFidelityCardService implements UserFidelityCardApi {

    public async addUserFidelityCard(businessId: number, userId: number) {
        const connection = await db.connection();
        
        const userFidelityCard = await userFidelityCardRepository.findActiveByUserIdAndBusinessId(userId, businessId, connection);
        if (userFidelityCard) {
            await connection.release();
            return userFidelityCard;
        }

        await connection.newTransaction();
        const newUserFidelityCard = await this.createUserFidelityCard(businessId, userId, connection);
        await connection.commit();
        await connection.release();
        
        return newUserFidelityCard;
    }

    public async addUserFidelityCardInternal(businessId: number, userId: number, connection) {
        const userFidelityCard = await userFidelityCardRepository.findActiveByUserIdAndBusinessId(userId, businessId, connection);
        if (userFidelityCard) {
            return userFidelityCard;
        }

        const newUserFidelityCard = await this.createUserFidelityCard(businessId, userId, connection);
        return newUserFidelityCard;
    } 

    public async updateUserFidelityCard(dto: any, userFidelityCardId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUserFidelityCard = await this.setUserFidelityCard(dto, userFidelityCardId, connection);
        await connection.commit();
        await connection.release();
        
        return newUserFidelityCard;
    }

    public async suspendUserFidelityCard(userFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateUserFidelityCardStatus('SUSPENDED', userFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async activateUserFidelityCard(userFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return fidelityCard;

        const userFidelityCard = await userFidelityCardRepository.findActiveByUserIdAndBusinessId(fidelityCard.user_id, fidelityCard.business_id, connection);
        if (userFidelityCard) {
            await connection.newTransaction();
            await this.removeUserFidelityCard(userFidelityCardId, loggedUserId, connection);
            await connection.commit();
            await connection.release();
            return userFidelityCard;
        }

        await connection.newTransaction();
        const business = await this.updateUserFidelityCardStatus('ACTIVE', userFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async getUserFidelityCards(userId: number) {
        const connection = await db.connection();

        const userFidelityCards = await userFidelityCardRepository.findActiveByUserIdJoinBusiness(userId, connection);
        await connection.release();

        return userFidelityCards;
    }

    public async getUserFidelityCard(userFidelityCardId: number) {
        const connection = await db.connection();

        const userFidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        await connection.release();

        return userFidelityCard;
    }

    public async deleteUserFidelityCard(userFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeUserFidelityCard(userFidelityCardId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createUserFidelityCard(businessId: number, userId: number, connection) {
        const businessFidelityCard = await businessFidelityCardRepository.findActiveByBusinessId(+businessId, connection);
        if (!businessFidelityCard) return businessFidelityCard;
        try {
            const newFidelityCard = new UserFidelityCard();
            newFidelityCard.business_id = businessFidelityCard.business_id;
            newFidelityCard.discount_id = businessFidelityCard.discount_id;
            newFidelityCard.fidelity_card_id = businessFidelityCard.id;
            newFidelityCard.expenses_amount = businessFidelityCard.expenses_amount;
            newFidelityCard.user_id = userId;
            newFidelityCard.status = 'ACTIVE';
            newFidelityCard.usage_amount = 0;
            newFidelityCard.discount_countdown = businessFidelityCard.expenses_amount;

            const coInserted = await userFidelityCardRepository.save(newFidelityCard, connection);
            newFidelityCard.id = coInserted.insertId;
            LOG.info("NEW USER FIDELITY CARD", newFidelityCard.id);
            return newFidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create USER FIDELITY CARD", 500, null, e);
        }
    }

    private async setUserFidelityCard(fidelityCardDTO: any, userFidelityCardId: number, connection) {
        try {
            const newFidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
            newFidelityCard.discount_countdown = fidelityCardDTO.discount_countdown || 0;

            await userFidelityCardRepository.update(newFidelityCard, connection);
            LOG.info("UPDATE USER FIDELITY CARD", newFidelityCard.id);
            return newFidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot UPDATE USER FIDELITY CARD", 500, null, e);
        }
    }

    private async updateUserFidelityCardStatus(status: string, userFidelityCardId: number, businessesIds: number[], connection) {
        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return fidelityCard;
        try {
            fidelityCard.status = status;
            await userFidelityCardRepository.update(fidelityCard, connection);
            return fidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update User Fidelity Card Status", 500, null, e);
        }
    }

    private async removeUserFidelityCard(userFidelityCardId: number, userId: number, connection) {
        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || fidelityCard.user_id != userId) return fidelityCard;
        try {
            await userFidelityCardRepository.delete(fidelityCard, connection);
            return fidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete User Fidelity Card", 500, null, e);
        }
    }

}
