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
const Repository_1 = require("./Repository");
const db = require("../../connection");
const mysql_1 = __importDefault(require("mysql"));
class GeneralRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users";
    }
    // ${mysql.escape(stripeId)}
    findByUserName(username, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where username = ${mysql_1.default.escape(username)} limit 1`).then((results) => results[0]);
        });
    }
    findByEmailAndPassword(email, password, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where email = ${mysql_1.default.escape(email)} and password = ${mysql_1.default.escape(password)} limit 1`).then((results) => results[0]);
        });
    }
    findByEmail(email, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            // tslint:disable-next-line:max-line-length
            return c.query(query || `select * from ${this.table} where email = ${mysql_1.default.escape(email)} limit 1`).then((results) => results[0]);
        });
    }
    findTotalUsers(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select count(*) as count from preorders`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
    findUsersToCall(date1, date2, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select u.id, u.email 
        from users u 
        where u.created_at between '${date1}' and '${date2}' 
        and u.deleted_at is null`;
            return yield c.query(query || q).then((results) => results);
        });
    }
}
exports.GeneralRepository = GeneralRepository;
//# sourceMappingURL=GeneralRepository.js.map