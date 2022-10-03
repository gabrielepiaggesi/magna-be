import { BusinessRepository } from "../../mgn-entity/repository/BusinessRepository";
import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { Logger } from "../../mgn-framework/services/Logger";
import { PushNotificationSender } from "../../mgn-framework/services/PushNotificationSender";
import { isDateBeforeToday, isDateToday } from "../../utils/Helpers";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { ReservationApi } from "../integration/ReservationApi";
import { Reservation } from "../model/Reservation";
import { ReservationRepository } from "../repository/reservationRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const reservationRepository = new ReservationRepository();
const userBusinessRepository = new UserBusinessRepository();
const businessRepository = new BusinessRepository();

export class ReservationService implements ReservationApi {
    
    public async getReservation(reservationId: number) {
        const connection = await db.connection();

        const reservation = await reservationRepository.findById(reservationId, connection);
        await connection.release();
        
        return reservation;
    }

    public async getUserReservations(userId: number) {
        const connection = await db.connection();

        const reservations = await reservationRepository.findByUserIdJoinBusiness(userId, connection);
        await connection.release();
        
        return reservations;
    }

    public async getBusinessReservations(businessId: number) {
        const connection = await db.connection();

        const today = new Date(Date.now()).toISOString().substring(0, 10) + ' 05:00:00';
        const reservations = await reservationRepository.findByBusinessIdAndUserDateGreaterThan(businessId, today, connection);
        await connection.release();

        const obj = {};
        reservations.forEach((r: any) => {
            const userDateRome = new Date(r.user_date).toLocaleString('sv', {timeZone: 'Europe/Rome'});
            const localDate = userDateRome.substring(0, 10);
            if (obj[localDate]) obj[localDate].push(r);
            if (!obj[localDate]) obj[localDate] = [r];
        });
        
        return obj;
    }

    public async addReservation(dto: { name: string, phoneNumber: string, userDate: string, peopleAmount: number, note?: string, type?: 'auto'|'manual', tableNumber?: number }, businessId: number, userId: number) {
        await Precondition.checkIfFalse((!dto.userDate), "Timing missing");
        await Precondition.checkIfFalse((!dto.peopleAmount), "People Amount missing");
        const connection = await db.connection();

        const business = await businessRepository.findById(businessId, connection);
        if (!business.accept_reservations) {
            LOG.info('business.accept_reservations', business.accept_reservations + '');
            await connection.release();
            return { disabled_reservations: true };
        }
        if (business.disable_reservation_today && 
            isDateToday(dto.userDate) && 
            isDateToday(business.disable_reservation_today)) {
            await connection.release();
            return { disable_reservation_today: true };
        }

        const today = new Date(Date.now()).toISOString().substring(0, 10) + ' 05:00:00';
        const reservations = await reservationRepository.findPendingByUserIdAndBusinessIdAndUserDateGreaterThan(userId, businessId, today, connection);
        if (reservations.length) {
            await connection.release();
            return { ...reservations[0], old: true };
        }

        await connection.newTransaction();
        // dto.userDate = new Date(Date.now()).toISOString().substring(0,10) + ' ' + dto.userDate;
        const newUser = await this.createReservation(dto, businessId, userId, connection);
        await connection.commit();
        await connection.release();
        
        return newUser;
    }

    public async updateBusinessReservation(dto: { status: string, subStatus?: string, tableNumber?: number, businessDate?: string }, reservationId: number, userId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(userId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);

        let res = await reservationRepository.findById(reservationId, connection);
        if (!res || !businessesIds.includes(res.business_id)) return res;

        if (dto.subStatus && dto.subStatus === 'new_date' && dto.businessDate) {
            dto.businessDate = new Date(res.user_date).toLocaleString('sv', {timeZone: 'Europe/Rome'}).substring(0,10) + ' ' + dto.businessDate;
        }

        await connection.newTransaction();
        const newRes = await this.updateReservation(dto, res, connection);
        await connection.commit();
        await connection.release();

        let msg = 'Prenotazione Processata';
        if (newRes.status === 'accepted') msg = 'Prenotazione Accettata';
        if (newRes.status === 'declined') msg = 'Prenotazione Rifiutata';
        PushNotificationSender.sendToUser(res.user_id, msg);

        return newRes;
    }

    private async createReservation(resDTO: { name: string, phoneNumber: string, userDate: string, peopleAmount: number, note?: string, type?: 'auto'|'manual', tableNumber?: number }, businessId: number, userId: number, connection) {
        try {
            const newRes = new Reservation();
            newRes.name = resDTO.name;
            newRes.user_date = resDTO.userDate;
            newRes.phone_number = resDTO.phoneNumber;
            newRes.people_amount = resDTO.peopleAmount;
            newRes.status = resDTO.type && resDTO.type === 'manual' ? 'accepted' : 'pending';
            if (resDTO.note) newRes.note = resDTO.note;
            if (resDTO.type) newRes.type = resDTO.type;
            if (resDTO.tableNumber) newRes.table_number = +resDTO.tableNumber;
            newRes.business_id = businessId;
            newRes.user_id = userId;

            const coInserted = await reservationRepository.save(newRes, connection);
            newRes.id = coInserted.insertId;
            LOG.info("NEW RESERVATION", newRes.id);
            return newRes;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create RESERVATION", 500, null, e);
        }
    }

    private async updateReservation(dto: { status: string, subStatus?: string, tableNumber?: number, businessDate?: string }, res: Reservation, connection) {
        try {
            res.status = dto.status || res.status;
            if (dto.subStatus) res.sub_status = dto.subStatus;
            if (dto.tableNumber) res.table_number = +dto.tableNumber;
            if (dto.businessDate) res.business_date = dto.businessDate;
            await reservationRepository.update(res, connection);
            return res;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Reservation " + res.id, 500, null, e);
        }
    }

    private async removeReservation(reservationId: number, loggedUserId: number, connection) {
        const review = await reservationRepository.findById(reservationId, connection);
        if (!review || review.id != loggedUserId) return review;
        try {
            await reservationRepository.delete(review, connection);
            return review;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Reservation", 500, null, e);
        }
    }

}
