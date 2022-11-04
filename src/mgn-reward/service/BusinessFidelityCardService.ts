import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { PushNotificationSender } from "../../mgn-framework/services/PushNotificationSender";
import { isDateToday } from "../../utils/Helpers";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { BusinessFidelityCardApi } from "../integration/BusinessFidelityCardApi";
import { BusinessFidelityCard } from "../model/BusinessFidelityCard";
import { BusinessFidelityCardRepository } from "../repository/BusinessFidelityCardRepository";
import { UserFidelityCardRepository } from "../repository/UserFidelityCardRepository";
import { UserDiscountService } from "./UserDiscountService";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const businessFidelityCardRepository = new BusinessFidelityCardRepository();
const userBusinessRepository = new UserBusinessRepository();
const userFidelityCardRepository = new UserFidelityCardRepository();

const userDiscountService = new UserDiscountService();

export class BusinessFidelityCardService implements BusinessFidelityCardApi {

    public async addBusinessFidelityCard(dto: any, businessId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newBusinessFidelityCard = await this.createBusinessFidelityCard(dto, businessId, connection);
        await connection.commit();
        await connection.release();
        
        return newBusinessFidelityCard;
    }

    public async updateBusinessFidelityCard(dto: any, businessFidelityCardId: number) {
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newBusinessFidelityCard = await this.setBusinessFidelityCard(dto, businessFidelityCardId, connection);
        await connection.commit();
        await connection.release();
        
        return newBusinessFidelityCard;
    }

    public async suspendBusinessFidelityCard(businessFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateBusinessFidelityCardStatus('SUSPENDED', businessFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async activateBusinessFidelityCard(businessFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.updateBusinessFidelityCardStatus('ACTIVE', businessFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async checkUserFidelityCardValidityInternal(userFidelityCardId: number, businessId: number, connection) {
        const userFidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        await Precondition.checkIfTrue(
            userFidelityCard && 
            // !isDateToday(userFidelityCard.last_scan) && 
            userFidelityCard.business_id === +businessId && 
            userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', 
        connection, 403);
        
        const businessFidelityCard = await businessFidelityCardRepository.findActiveByBusinessId(businessId, connection);
        await Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);

        // if (businessFidelityCard.type !== 'points' && isDateToday(userFidelityCard.last_scan)) {
        //     return;
        // }

        const newUserFidelityCard = businessFidelityCard.type === 'points' ? 
            await this.updateUserFidelityCardCountdownPOINTS(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, 1, connection) : 
            await this.updateUserFidelityCardCountdown(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, connection);

        if (newUserFidelityCard.discount) {
            await userDiscountService.addUserOriginDiscount(userFidelityCard.business_id, userFidelityCard.user_id, 'FIDELITY_CARD', connection);
        }

        return newUserFidelityCard.fidelityCard;
    }

    public async checkUserFidelityCardValidity(userFidelityCardId: number, businessId: number, pointsToAdd: number = 1) {
        const connection = await db.connection();
        const userFidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        await Precondition.checkIfTrue(
            userFidelityCard && 
            // !isDateToday(userFidelityCard.last_scan) && 
            userFidelityCard.business_id === +businessId && 
            userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', 
        connection, 403);
        
        const businessFidelityCard = await businessFidelityCardRepository.findActiveByBusinessId(businessId, connection);
        await Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);

        if (businessFidelityCard.type !== 'points' && isDateToday(userFidelityCard.last_scan)) {
            await connection.release();
            return;
        }

        await connection.newTransaction();
        const newUserFidelityCard = businessFidelityCard.type === 'points' ? 
            await this.updateUserFidelityCardCountdownPOINTS(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, pointsToAdd, connection) : 
            await this.updateUserFidelityCardCountdown(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, connection);
        if (newUserFidelityCard.discount) {
            await userDiscountService.addUserOriginDiscount(userFidelityCard.business_id, userFidelityCard.user_id, 'FIDELITY_CARD', connection);
        }
        await connection.commit();
        await connection.release();

        PushNotificationSender.sendToUser(userFidelityCard.user_id, 'Carta Fedeltà', 'Timbrata con successo!', 'user-card');
        return newUserFidelityCard.fidelityCard;
    }

    public async resetUserFidelityCardValidity(userFidelityCardId: number, businessId: number) {
        const connection = await db.connection();
        const userFidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        await Precondition.checkIfTrue(
            userFidelityCard && 
            userFidelityCard.business_id === +businessId && 
            userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', 
        connection, 403);
        
        const businessFidelityCard = await businessFidelityCardRepository.findById(userFidelityCard.discount_id, connection);
        await Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);

        await connection.newTransaction();
        const newUserFidelityCard = await this.resetAtZeroUserFidelityCardCountdown(userFidelityCard.id, [businessId], connection);
        await connection.commit();
        await connection.release();

        return newUserFidelityCard;
    }

    public async getBusinessFidelityCards(businessId: number) {
        const connection = await db.connection();

        const businessFidelityCards = await businessFidelityCardRepository.findByBusinessId(businessId, connection);
        await connection.release();

        return businessFidelityCards;
    }

    public async getClientsFidelityCards(businessId: number) {
        const connection = await db.connection();

        const clientsFidelityCards = await userFidelityCardRepository.findActiveByBusinessId(businessId, connection);
        await connection.release();

        return clientsFidelityCards;
    }

    public async getBusinessFidelityCard(businessId: number) {
        const connection = await db.connection();

        const businessFidelityCard = await businessFidelityCardRepository.findByBusinessId(businessId, connection);
        await connection.release();

        return businessFidelityCard;
    }

    public async deleteBusinessFidelityCard(businessFidelityCardId: number, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        await connection.newTransaction();
        const business = await this.removeBusinessFidelityCard(businessFidelityCardId, businessesIds, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    private async createBusinessFidelityCard(fidelityCardDTO: any, businessId: number, connection) {
        try {
            const newFidelityCard = new BusinessFidelityCard();
            newFidelityCard.business_id = +businessId;
            if (fidelityCardDTO.discount_id) newFidelityCard.discount_id = +fidelityCardDTO.discount_id;
            newFidelityCard.expenses_amount = +fidelityCardDTO.expenses_amount;
            newFidelityCard.status = 'ACTIVE';
            newFidelityCard.type = fidelityCardDTO.type || 'times';

            const coInserted = await businessFidelityCardRepository.save(newFidelityCard, connection);
            newFidelityCard.id = coInserted.insertId;
            LOG.info("NEW BUSINESS FIDELITY CARD", newFidelityCard.id);
            return newFidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS FIDELITY CARD", 500, null, e);
        }
    }

    private async setBusinessFidelityCard(fidelityCardDTO: any, businessFidelityCardId: number, connection) {
        try {
            const newFidelityCard = await businessFidelityCardRepository.findById(businessFidelityCardId, connection);
            if (fidelityCardDTO.discount_id || newFidelityCard.discount_id) newFidelityCard.discount_id = +fidelityCardDTO.discount_id || newFidelityCard.discount_id;
            newFidelityCard.expenses_amount = +fidelityCardDTO.expenses_amount;
            if (fidelityCardDTO.type) newFidelityCard.type = fidelityCardDTO.type;

            await businessFidelityCardRepository.update(newFidelityCard, connection);
            LOG.info("UPDATE BUSINESS FIDELITY CARD", newFidelityCard.id);
            return newFidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS FIDELITY CARD", 500, null, e);
        }
    }

    private async updateBusinessFidelityCardStatus(status: string, businessFidelityCardId: number, businessesIds: number[], connection) {
        const fidelityCard = await businessFidelityCardRepository.findById(businessFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return fidelityCard;
        try {
            fidelityCard.status = status;
            await businessFidelityCardRepository.update(fidelityCard, connection);
            return fidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Business Fidelity Card Status", 500, null, e);
        }
    }

    private async removeBusinessFidelityCard(businessFidelityCardId: number, businessesIds: number[], connection) {
        const discount = await businessFidelityCardRepository.findById(businessFidelityCardId, connection);
        if (!discount || !businessesIds.includes(discount.business_id)) return discount;
        try {
            await businessFidelityCardRepository.delete(discount, connection);
            return discount;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Business Fidelity Card", 500, null, e);
        }
    }

    private async updateUserFidelityCardCountdown(userFidelityCardId: number, businessesIds: number[], businessExpensesAmount: number, connection) {
        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return { fidelityCard, discount: false };
        const now = new Date(Date.now()).toLocaleString('sv', {timeZone: 'Europe/Rome'});
        fidelityCard.last_scan = now;
        fidelityCard.type = 'times';
        try {
            if (fidelityCard.discount_countdown <= 0 || !fidelityCard.discount_countdown) {
                LOG.error("HELP !!! COUNTDOWN LESS THAN ZERO! WTF", fidelityCard.id);
                fidelityCard.discount_countdown = businessExpensesAmount;
                await userFidelityCardRepository.update(fidelityCard, connection);
                return { fidelityCard, discount: false };
            } else if (fidelityCard.discount_countdown <= 2) {

                if (fidelityCard.discount_countdown == 2) {
                    // BONUS!
                    fidelityCard.discount_countdown = fidelityCard.discount_countdown - 1;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: true };
                } else if (fidelityCard.discount_countdown == 1) {
                    // USING BONUS!
                    fidelityCard.discount_countdown = businessExpensesAmount;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }

            } else if (fidelityCard.expenses_amount != businessExpensesAmount) {
                
                const timesWentThereIncludedNow = fidelityCard.expenses_amount - (fidelityCard.discount_countdown - 1);
                if (timesWentThereIncludedNow >= businessExpensesAmount) {
                    // BONUS!
                    fidelityCard.discount_countdown = businessExpensesAmount;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: true };
                } else {
                    fidelityCard.discount_countdown = businessExpensesAmount - timesWentThereIncludedNow;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }

            } else {
                fidelityCard.discount_countdown = (+fidelityCard.discount_countdown) - 1;
                fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                await userFidelityCardRepository.update(fidelityCard, connection);
                return { fidelityCard, discount: false };
            }
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update User Fidelity Card COUNTDOWN", 500, null, e);
        }
    }

    private async updateUserFidelityCardCountdownPOINTS(userFidelityCardId: number, businessesIds: number[], businessExpensesAmount: number, pointsToAdd: number, connection) {
        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return { fidelityCard, discount: false };
        const now = new Date(Date.now()).toLocaleString('sv', {timeZone: 'Europe/Rome'});
        fidelityCard.last_scan = now;
        fidelityCard.type = 'points';
        try {
            if (fidelityCard.discount_countdown < 0 || !fidelityCard.discount_countdown) {
                LOG.error("HELP !!! COUNTDOWN LESS THAN ZERO! WTF", fidelityCard.id);
                fidelityCard.discount_countdown = businessExpensesAmount;
                await userFidelityCardRepository.update(fidelityCard, connection);
                return { fidelityCard, discount: false };
            } else if (fidelityCard.expenses_amount != businessExpensesAmount) {
                
                let newCountDown = (fidelityCard.discount_countdown - pointsToAdd);
                let pointsUntilNow = 0;
                if (newCountDown >= 0) {
                    pointsUntilNow = fidelityCard.expenses_amount - newCountDown;
                } else { // newCountDown = 5 - 7 = -2
                    pointsUntilNow = fidelityCard.expenses_amount + (-1 * newCountDown); // 10 + 2 = 12
                }

                if (pointsUntilNow >= businessExpensesAmount) {
                    // BONUS!
                    fidelityCard.discount_countdown = 1;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: true };
                } else {
                    newCountDown = businessExpensesAmount - pointsUntilNow;
                    if (newCountDown > businessExpensesAmount || newCountDown < 0) newCountDown = businessExpensesAmount;
                    if (newCountDown == 1) newCountDown = 2;
                    fidelityCard.discount_countdown = newCountDown;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    fidelityCard.expenses_amount = businessExpensesAmount;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }

            } else {
                let newCountDown = (fidelityCard.discount_countdown - pointsToAdd);
                if (newCountDown > 1) {
                    if (newCountDown > fidelityCard.expenses_amount) newCountDown = fidelityCard.expenses_amount;
                    fidelityCard.discount_countdown = newCountDown;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                } else if (newCountDown == 0 && fidelityCard.discount_countdown == 1) {
                    fidelityCard.discount_countdown = fidelityCard.expenses_amount;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                } else {
                    fidelityCard.discount_countdown = 1;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    await userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: true };
                }
            }
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update User Fidelity Card COUNTDOWN", 500, null, e);
        }
    }

    private async resetAtZeroUserFidelityCardCountdown(userFidelityCardId: number, businessesIds: number[], connection) {
        const fidelityCard = await userFidelityCardRepository.findById(userFidelityCardId, connection);
        if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id)) return fidelityCard;
        try {
            fidelityCard.discount_countdown = 0;
            await userFidelityCardRepository.update(fidelityCard, connection);
            return fidelityCard;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Reset AT ZERO User Fidelity Card COUNTDOWN", 500, null, e);
        }
    }

}
