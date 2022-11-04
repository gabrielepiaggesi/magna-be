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
class BusinessRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "businesses";
    }
    // ${mysql2.escape(stripeId)}
    whereBusinessesIdsIn(businessIds, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!businessIds.length)
                return [];
            const c = conn;
            return c.query(query ||
                `select * 
            from ${this.table} 
            where id in (?) and deleted_at is null order by id asc`, [businessIds]).then((results) => results);
        });
    }
    findByUserIdAndBusinessId(businessId, userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and id = ${mysql2_1.default.escape(businessId)} and deleted_at is null limit 1`).then((results) => results[0]);
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
    findByCap(cap, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where cap = ${mysql2_1.default.escape(cap)} and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findTotalBusinesses(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select * from ${this.table} and deleted_at is null`;
            return yield c.query(query || q).then((results) => results);
        });
    }
}
exports.BusinessRepository = BusinessRepository;
//# sourceMappingURL=BusinessRepository.js.map