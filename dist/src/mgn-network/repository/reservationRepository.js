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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../mgn-framework/repositories/Repository");
const db = require("../../connection");
const mysql2_1 = __importDefault(require("mysql2"));
class ReservationRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "reservations";
    }
    // ${mysql2.escape(stripeId)}
    findByUserIdAndBusinessId(userId, businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and business_id = ${mysql2_1.default.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findByUserIdAndBusinessIdIn(userId, businessIds, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and business_id in (?) and deleted_at is null order by id desc`, [businessIds]).then((results) => results);
        });
    }
    findByUserId(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findByUserIdJoinBusiness(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select r.*, b.name as business_name from ${this.table} r join businesses b on b.id = r.business_id and b.deleted_at is null 
        where r.user_id = ${mysql2_1.default.escape(userId)} and r.type = 'auto' and r.deleted_at is null order by r.id desc`).then((results) => results);
        });
    }
    findByBusinessId(businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2_1.default.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findByBusinessIdAndUserDateGreaterThan(businessId, userDate, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2_1.default.escape(businessId)} and user_date >= ${mysql2_1.default.escape(userDate)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findPendingByUserIdAndBusinessIdAndUserDateGreaterThan(userid, businessId, userDate, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
            select * 
            from ${this.table} 
            where business_id = ${mysql2_1.default.escape(businessId)} 
            and user_id = ${mysql2_1.default.escape(userid)} 
            and user_date >= ${mysql2_1.default.escape(userDate)} 
            and status = 'pending' 
            and deleted_at is null 
            order by id desc
        `).then((results) => results);
        });
    }
}
exports.ReservationRepository = ReservationRepository;
//# sourceMappingURL=reservationRepository.js.map