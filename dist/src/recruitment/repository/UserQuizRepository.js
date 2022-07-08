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
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
const mysql2_1 = __importDefault(require("mysql2"));
class UserQuizRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users_quizs";
    }
    // ${mysql2.escape(stripeId)}
    whereUserIdInAndJobOfferId(userIds, jobOfferId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userIds.length)
                return [];
            const c = conn || (yield db.connection());
            return c.query(query ||
                `select * 
            from ${this.table} 
            where job_offer_id = ${mysql2_1.default.escape(jobOfferId)} and deleted_at is null and user_id in (?) order by user_id asc`, userIds).then((results) => results);
        });
    }
    findByQuizIdAndJobOfferIdAndUserId(quizId, jobOfferId, userId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} 
            where user_id = ${mysql2_1.default.escape(userId)} 
            and job_offer_id = ${mysql2_1.default.escape(jobOfferId)} 
            and quiz_id = ${mysql2_1.default.escape(quizId)} 
            and deleted_at is null 
            order by id desc 
            limit 1`)
                .then((results) => results[0] || null);
        });
    }
}
exports.UserQuizRepository = UserQuizRepository;
//# sourceMappingURL=UserQuizRepository.js.map