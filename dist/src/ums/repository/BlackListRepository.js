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
const mysql_1 = __importDefault(require("mysql"));
class BlackListRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "black_lists";
    }
    countByUserId(userId, statusNotIn = null, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
            return c.query(query ||
                `select count(*) 
            from ${this.table} rep 
            where rep.user_id = ${userId} ${whereIn} 
            and rep.deleted_at is null 
            and rep.created_at >= ${mysql_1.default.escape(this.getWeekAgo())}`).then((results) => results[0]);
        });
    }
    countByReporterId(userId, statusNotIn = null, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
            return c.query(query ||
                `select count(*) 
            from ${this.table} rep 
            where rep.reporter_id = ${userId} ${whereIn} 
            and rep.deleted_at is null 
            group by user_id 
            and rep.created_at >= ${mysql_1.default.escape(this.getWeekAgo())}`).then((results) => results[0]);
        });
    }
    countByReporterIdAndUserId(reporterId, userId, statusNotIn = null, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
            return c.query(query ||
                `select count(*) 
            from ${this.table} rep 
            where rep.reporter_id = ${reporterId} ${whereIn} 
            and rep.user_id = ${userId} 
            and rep.deleted_at is null 
            and rep.created_at >= ${mysql_1.default.escape(this.getWeekAgo())}`).then((results) => results[0]);
        });
    }
    getWeekAgo() {
        let d = new Date(Date.now());
        const dd = d.getDate() - 7;
        d.setDate(dd);
        const weekAgo = d.toISOString().substring(0, 19).replace("T", " ");
        return weekAgo;
    }
}
exports.BlackListRepository = BlackListRepository;
//# sourceMappingURL=BlackListRepository.js.map