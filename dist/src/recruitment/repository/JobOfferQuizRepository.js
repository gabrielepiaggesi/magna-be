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
class JobOfferQuizRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "job_offers_quizs";
    }
    // ${mysql2.escape(stripeId)}
    findByJobOfferId(jobOfferId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select *, q.id as q_id, jq.id as jq_id from ${this.table} jq 
            join quizs q on q.id  = jq.quiz_id and q.deleted_at is null 
            where jq.job_offer_id = ${mysql2_1.default.escape(jobOfferId)} 
            and jq.deleted_at is null`)
                .then((results) => results);
        });
    }
}
exports.JobOfferQuizRepository = JobOfferQuizRepository;
//# sourceMappingURL=JobOfferQuizRepository.js.map