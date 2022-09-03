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
class ExamRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "exams";
    }
    // ${mysql2.escape(stripeId)}
    findByUserIdAndCompanyId(userId, companyId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where author_user_id = ${mysql2_1.default.escape(userId)} and company_id = ${mysql2_1.default.escape(companyId)} and deleted_at is null`)
                .then((results) => results);
        });
    }
    findByCompanyId(companyId, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where company_id = ${mysql2_1.default.escape(companyId)} and deleted_at is null`)
                .then((results) => results);
        });
    }
    findByIdInAndActive(ids, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where id in (?) and status = 'ACTIVE' and deleted_at is null`, [ids])
                .then((results) => results);
        });
    }
    findByCompanyIdAndStatus(companyId, status, conn, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            // tslint:disable-next-line:max-line-length
            return c.query(query ||
                `select * from ${this.table} where company_id = ${mysql2_1.default.escape(companyId)} and status = ${mysql2_1.default.escape(status)} and deleted_at is null`)
                .then((results) => results);
        });
    }
}
exports.ExamRepository = ExamRepository;
//# sourceMappingURL=ExamRepository.js.map