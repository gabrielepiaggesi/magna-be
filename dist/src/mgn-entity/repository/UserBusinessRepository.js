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
class UserBusinessRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users_businesses";
    }
    // ${mysql2.escape(stripeId)}
    whereUserBusinessesIdsIn(UserBusinessIds, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!UserBusinessIds.length)
                return [];
            const c = conn;
            return c.query(query ||
                `select * 
            from ${this.table} 
            where id in (?) and deleted_at is null order by id asc`, [UserBusinessIds]).then((results) => results);
        });
    }
    findByUserIdAndUserBusinessId(UserBusinessId, userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and id = ${mysql2_1.default.escape(UserBusinessId)} and deleted_at is null limit 1`).then((results) => results[0]);
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
    findByBusinessId(businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2_1.default.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findByBusinessIdJoinUserEmail(businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select uB.*, u.email as user_email from ${this.table} uB join users u on u.id = uB.user_id and u.deleted_at is null where uB.business_id = ${mysql2_1.default.escape(businessId)} and uB.deleted_at is null order by uB.id desc`).then((results) => results);
        });
    }
    findTotalUserBusinesses(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select * from ${this.table} and deleted_at is null`;
            return yield c.query(query || q).then((results) => results);
        });
    }
}
exports.UserBusinessRepository = UserBusinessRepository;
//# sourceMappingURL=UserBusinessRepository.js.map