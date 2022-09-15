import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
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
const businessRepository = new BusinessRepository();

export class UserFidelityCardService implements UserFidelityCardApi {

    public async addUserFidelityCard(dto: any, userId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUserFidelityCard = await this.createUserFidelityCard(dto, userId, connection);
        await connection.commit();
        await connection.release();
        
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
        const userBusinesses = await businessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.id);

        await connection.newTransaction();
        const business = await this.updateUserFidelityCardStatus('SUSPENDED', userFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async activateUserFidelityCard(userFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await businessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.id);

        await connection.newTransaction();
        const business = await this.updateUserFidelityCardStatus('ACTIVE', userFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async getUserFidelityCards(userId: number) {
        const connection = await db.connection();

        const userFidelityCards = await userFidelityCardRepository.findByUserId(userId, connection);
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

    private async createUserFidelityCard(fidelityCardDTO: any, userId: number, connection) {
        const businessFidelityCard = await businessFidelityCardRepository.findById(+fidelityCardDTO.fidelity_card_id, connection);
        if (!businessFidelityCard || businessFidelityCard.business_id != +fidelityCardDTO.businessId) return businessFidelityCard;
        try {
            const newFidelityCard = new UserFidelityCard();
            newFidelityCard.business_id = +fidelityCardDTO.businessId;
            newFidelityCard.discount_id = +fidelityCardDTO.discount_id;
            newFidelityCard.fidelity_card_id = +fidelityCardDTO.fidelity_card_id;
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
