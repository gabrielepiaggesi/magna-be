import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { BusinessApi } from "../integration/BusinessApi";
import { Business } from "../model/Business";
import { BusinessRepository } from "../repository/BusinessRepository";
import { UserBusiness } from '../model/UserBusiness';
import { UserBusinessRepository } from "../repository/UserBusinessRepository";
import { PushNotificationSender } from "../../mgn-framework/services/PushNotificationSender";
import { NotificationRepository } from "../repository/NotificationRepository";
import { Notification } from "../model/Notification";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const businessRepository = new BusinessRepository();
const notificationRepository = new NotificationRepository();
const userBusinessRepository = new UserBusinessRepository();

export class BusinessService implements BusinessApi {
    
    public async addBusiness(dto: any, loggedUserId: number) {
        await Precondition.checkIfFalse((!dto.name), "Incomplete Data");
        const connection = await db.connection();
        //MISSING REFERRAL CODE!
        await connection.newTransaction();
        const newBusiness = await this.updateOrCreateBusiness(dto, null, loggedUserId, connection);
        const newUserBusiness = await this.createUserBusiness(newBusiness.id, newBusiness.user_id, connection);
        await connection.commit();
        await connection.release();
        
        return newBusiness;
    }

    public async getUserBusinesses(businessId: number) {
        const connection = await db.connection();
        
        const usersBusinessEmails = await userBusinessRepository.findByBusinessIdJoinUserEmail(businessId, connection);
        await connection.release();
        
        return usersBusinessEmails;
    }

    public async getBusinessNotifications(businessId: number) {
        const connection = await db.connection();
        
        const nots = await notificationRepository.findByBusinessId(businessId, connection);
        await connection.release();
        
        return nots;
    }

    public async addUserBusiness(businessId: number, userId: number) {
        const connection = await db.connection();
        const uBusiness = await userBusinessRepository.findByUserIdAndUserBusinessId(businessId, userId, connection);
        if (uBusiness) {
            LOG.info("GIA CE STA");
            await connection.release();
            return uBusiness;
        } 
        LOG.info("NUOVO");
        await connection.newTransaction();
        const newUserBusiness = await this.createUserBusiness(businessId, userId, connection);
        await connection.commit();
        await connection.release();
        
        return newUserBusiness;
    }

    public async removeUserBusiness(businessId: number, userId: number, loggedUserId: number) {
        const connection = await db.connection();
        
        const uBusiness = await userBusinessRepository.findByUserIdAndUserBusinessId(businessId, userId, connection);
        if (!uBusiness || uBusiness.user_id != userId || uBusiness.user_id === loggedUserId) {
            await connection.release();
            throw new IndroError("Cannot Delete User Business", 500, null, 'not_allowed');
        }
        await connection.newTransaction();
        try {
            await userBusinessRepository.delete(uBusiness, connection);
            await connection.commit();
            await connection.release();
            return uBusiness;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete User Business", 500, null, e);
        }
    }

    public async deleteBusiness(businessId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeBusiness(businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async deleteNotification(notificationId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeNotification(notificationId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async updateBusiness(businessId: number, dto: any, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const newBusiness = await this.updateOrCreateBusiness(dto, businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return newBusiness;
    }

    public async getBusiness(businessId: number) {
        const connection = await db.connection();

        const business = await businessRepository.findById(businessId, connection);
        await connection.release();

        return business;
    }

    public async sendNotificationToClients(businessId: number, userId: number, dto: { title: string, msg?: string }) {
        const connection = await db.connection();
        const uBusiness = await userBusinessRepository.findByUserIdAndUserBusinessId(businessId, userId, connection);
        if (!uBusiness) {
            await connection.release();
            return null;
        }

        const business = await businessRepository.findById(businessId, connection);

        await connection.newTransaction();
        await this.createNotification(business.id, dto.title, dto.msg, connection);
        await connection.commit();
        await connection.release();
        
        PushNotificationSender.sendToClients(businessId, business.name, dto.title, 'promotion');
        return business;
    }

    public async getUserBusinessesList(userId: number) {
        const connection = await db.connection();

        const userBusinesses = await userBusinessRepository.findByUserId(userId, connection);
        const businessIds = userBusinesses.map(uB => uB.business_id);
        const businesses = await businessRepository.whereBusinessesIdsIn(businessIds, connection);
        await connection.release();

        return businesses;
    }

    private async updateOrCreateBusiness(newBusinessDTO: any, businessId: number, loggedUserId: number, connection) {
        let newBusiness = new Business();
        if (businessId) {
            newBusiness = await businessRepository.findById(businessId, connection);
            // if (newBusiness && newBusiness.user_id != loggedUserId) return null; // CHECK USER BUSINESS!
        }

        try {
            const today = new Date(Date.now());
            if (newBusinessDTO.phoneNumber && newBusinessDTO.phoneNumber != newBusiness.phone_number) newBusiness.phone_number = newBusinessDTO.phoneNumber;
            newBusiness.name = newBusinessDTO.name || newBusiness.name;
            newBusiness.address = newBusinessDTO.address || newBusiness.address;
            newBusiness.status = businessId ? newBusiness.status : 'ACTIVE';
            newBusiness.user_id = businessId ? newBusiness.user_id : loggedUserId;
            newBusiness.accept_reservations = newBusinessDTO.acceptReservations >= 0 ? newBusinessDTO.acceptReservations : newBusiness.accept_reservations;
            newBusiness.disable_reservation_today = 
                newBusinessDTO.disableReservationToday >= 0 ? 
                    newBusinessDTO.disableReservationToday === 1 ? today.toISOString().substring(0, 10) + ' 20:00:00' : new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10) + ' 20:00:00'
                : newBusiness.disable_reservation_today;

            const coInserted = businessId ? await businessRepository.update(newBusiness, connection) : await businessRepository.save(newBusiness, connection);
            newBusiness.id = businessId ? newBusiness.id : coInserted.insertId;
            !businessId && LOG.info("NEW BUSINESS", newBusiness.id);
            return newBusiness;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS", 500, null, e);
        }
    }

    private async createUserBusiness(businessId: number, userId: number, connection) {
        try {
            let newBusiness = new UserBusiness();
            newBusiness.user_id = userId;
            newBusiness.business_id = businessId;

            const coInserted = await userBusinessRepository.save(newBusiness, connection);
            newBusiness.id = businessId ? newBusiness.id : coInserted.insertId;
            !businessId && LOG.info("NEW USER BUSINESS", newBusiness.id);
            return newBusiness;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create USER BUSINESS", 500, null, e);
        }
    }

    private async createNotification(businessId: number, title: string, body: string, connection) {
        try {
            let newNot = new Notification();
            newNot.title = title;
            if (body) newNot.body = body;
            newNot.business_id = businessId;

            const coInserted = await notificationRepository.save(newNot, connection);
            newNot.id = coInserted.insertId;
            LOG.info("NEW NOTIFICATION", newNot.id);
            return newNot;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create NOTIFICATION", 500, null, e);
        }
    }

    private async removeBusiness(businessId: number, loggedUserId: number, connection) {
        const business = await businessRepository.findById(businessId, connection);
        // if (!business || business.user_id != loggedUserId) return business; // CHECK USER BUSINESS!
        try {
            await businessRepository.delete(business, connection);
            return business;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Business", 500, null, e);
        }
    }

    private async removeNotification(notificationId: number, loggedUserId: number, connection) {
        const business = await notificationRepository.findById(notificationId, connection);
        // if (!business || business.user_id != loggedUserId) return business; // CHECK USER BUSINESS!
        try {
            await notificationRepository.delete(business, connection);
            return business;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Notification", 500, null, e);
        }
    }

}
