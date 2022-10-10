"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BusinessRepository_1 = require("../../mgn-entity/repository/BusinessRepository");
const UserBusinessRepository_1 = require("../../mgn-entity/repository/UserBusinessRepository");
const Logger_1 = require("../../mgn-framework/services/Logger");
const PushNotificationSender_1 = require("../../mgn-framework/services/PushNotificationSender");
const Helpers_1 = require("../../utils/Helpers");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const Reservation_1 = require("../model/Reservation");
const reservationRepository_1 = require("../repository/reservationRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const reservationRepository = new reservationRepository_1.ReservationRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const businessRepository = new BusinessRepository_1.BusinessRepository();
class ReservationService {
    getReservation(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const reservation = yield reservationRepository.findById(reservationId, connection);
            yield connection.release();
            return reservation;
        });
    }
    getUserReservations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const reservations = yield reservationRepository.findByUserIdJoinBusiness(userId, connection);
            yield connection.release();
            return reservations;
        });
    }
    getBusinessReservations(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const today = new Date(Date.now()).toISOString().substring(0, 10) + ' 05:00:00';
            const reservations = yield reservationRepository.findByBusinessIdAndUserDateGreaterThan(businessId, today, connection);
            yield connection.release();
            const obj = {};
            reservations.forEach((r) => {
                const userDateRome = new Date(r.user_date).toLocaleString('sv', { timeZone: 'Europe/Rome' });
                const localDate = userDateRome.substring(0, 10);
                if (obj[localDate])
                    obj[localDate].push(r);
                if (!obj[localDate])
                    obj[localDate] = [r];
            });
            return obj;
        });
    }
    addReservation(dto, businessId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.userDate), "Timing missing");
            yield Preconditions_1.Precondition.checkIfFalse((!dto.peopleAmount), "People Amount missing");
            const connection = yield db.connection();
            const business = yield businessRepository.findById(businessId, connection);
            if (!business.accept_reservations) {
                LOG.info('business.accept_reservations', business.accept_reservations + '');
                yield connection.release();
                return { disabled_reservations: true };
            }
            if (business.disable_reservation_today &&
                Helpers_1.isDateToday(dto.userDate) &&
                Helpers_1.isDateToday(business.disable_reservation_today)) {
                yield connection.release();
                return { disable_reservation_today: true };
            }
            const today = new Date(Date.now()).toISOString().substring(0, 10) + ' 05:00:00';
            const reservations = yield reservationRepository.findPendingByUserIdAndBusinessIdAndUserDateGreaterThan(userId, businessId, today, connection);
            if (reservations.length) {
                yield connection.release();
                return Object.assign(Object.assign({}, reservations[0]), { old: true });
            }
            const userBusinesses = yield userBusinessRepository.findByBusinessId(business.id, connection);
            yield connection.newTransaction();
            // dto.userDate = new Date(Date.now()).toISOString().substring(0,10) + ' ' + dto.userDate;
            const newUser = yield this.createReservation(dto, businessId, userId, connection);
            yield connection.commit();
            yield connection.release();
            const employees = userBusinesses.map(uB => uB.user_id);
            PushNotificationSender_1.PushNotificationSender.sendToUsers([business.user_id, ...employees], business.name.substring(0, 20), "Nuova Prenotazione");
            return newUser;
        });
    }
    updateBusinessReservation(dto, reservationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(userId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            let res = yield reservationRepository.findById(reservationId, connection);
            const business = yield businessRepository.findById(res.business_id, connection);
            if (!res || !businessesIds.includes(res.business_id))
                return res;
            if (dto.subStatus && dto.subStatus === 'new_date' && dto.businessDate) {
                dto.businessDate = new Date(res.user_date).toLocaleString('sv', { timeZone: 'Europe/Rome' }).substring(0, 10) + ' ' + dto.businessDate;
            }
            yield connection.newTransaction();
            const newRes = yield this.updateReservation(dto, res, connection);
            yield connection.commit();
            yield connection.release();
            if (res.status != newRes.status && (newRes.status === 'accepted' || (newRes.status === 'declined' && newRes.sub_status != 'user_canceled'))) {
                let msg = 'Prenotazione Processata';
                if (newRes.status === 'accepted')
                    msg = 'Prenotazione Accettata';
                if (newRes.status === 'declined')
                    msg = 'Prenotazione Rifiutata';
                PushNotificationSender_1.PushNotificationSender.sendToUser(res.user_id, business.name.substring(0, 20), msg);
            }
            else if (newRes.status === 'declined' && newRes.sub_status == 'user_canceled') {
                PushNotificationSender_1.PushNotificationSender.sendToUsers([business.user_id, ...userBusinesses.map(uB => uB.user_id)], business.name.substring(0, 20), "1 Prenotazione Annullata");
            }
            return newRes;
        });
    }
    createReservation(resDTO, businessId, userId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRes = new Reservation_1.Reservation();
                newRes.name = resDTO.name;
                newRes.user_date = resDTO.userDate;
                newRes.phone_number = resDTO.phoneNumber;
                newRes.people_amount = resDTO.peopleAmount;
                newRes.status = resDTO.type && resDTO.type === 'manual' ? 'accepted' : 'pending';
                if (resDTO.note)
                    newRes.note = resDTO.note;
                if (resDTO.type)
                    newRes.type = resDTO.type;
                if (resDTO.tableNumber)
                    newRes.table_number = +resDTO.tableNumber;
                newRes.business_id = businessId;
                newRes.user_id = userId;
                const coInserted = yield reservationRepository.save(newRes, connection);
                newRes.id = coInserted.insertId;
                LOG.info("NEW RESERVATION", newRes.id);
                return newRes;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create RESERVATION", 500, null, e);
            }
        });
    }
    updateReservation(dto, res, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status = dto.status || res.status;
                if (dto.subStatus)
                    res.sub_status = dto.subStatus;
                if (dto.tableNumber)
                    res.table_number = +dto.tableNumber;
                if (dto.businessDate)
                    res.business_date = dto.businessDate;
                if (dto.businessMessage)
                    res.business_message = dto.businessMessage;
                yield reservationRepository.update(res, connection);
                return res;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Reservation " + res.id, 500, null, e);
            }
        });
    }
    removeReservation(reservationId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield reservationRepository.findById(reservationId, connection);
            if (!review || review.id != loggedUserId)
                return review;
            try {
                yield reservationRepository.delete(review, connection);
                return review;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Reservation", 500, null, e);
            }
        });
    }
}
exports.ReservationService = ReservationService;
//# sourceMappingURL=ReservationService.js.map