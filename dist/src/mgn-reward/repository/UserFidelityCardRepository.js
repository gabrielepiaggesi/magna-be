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
class UserFidelityCardRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users_fidelities_cards";
    }
    // ${mysql2.escape(stripeId)}
    findActiveByUserId(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findActiveByUserIdAndBusinessId(userId, businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2_1.default.escape(userId)} and business_id = ${mysql2_1.default.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
        });
    }
    findActiveByUserIdJoinBusiness(userId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query || `
            select uf.*, b.name as business_name, bf.expenses_amount as business_expenses_amount, uf.expenses_amount as user_expenses_amount 
            from ${this.table} uf 
            join businesses b on b.id = uf.business_id and b.deleted_at is null 
            join businesses_fidelities_cards bf on bf.id = uf.fidelity_card_id and bf.deleted_at is null and bf.status = 'ACTIVE' 
            where uf.user_id = ${mysql2_1.default.escape(userId)} 
            and uf.status = 'ACTIVE' 
            and uf.deleted_at is null 
            order by uf.id desc`).then((results) => results);
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
}
exports.UserFidelityCardRepository = UserFidelityCardRepository;
//# sourceMappingURL=UserFidelityCardRepository.js.map