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
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
const db = require("../../database");
const mysql_1 = __importDefault(require("mysql"));
class BusinessRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "business";
    }
    findByUserName(username, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${this.table} where username = "${username}" limit 1`).then((results) => results[0]);
    }
    findByEmailAndPassword(email, password, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${this.table} where email = "${email}" and password = "${password}" limit 1`).then((results) => results[0]);
    }
    findByEmail(email, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${mysql_1.default.escape(this.table)} where email = "${mysql_1.default.escape(email)}" limit 1`).then((results) => results[0]);
    }
    findTodayUsers(query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const datetime = new Date();
            const from = datetime.toISOString().slice(0, 10) + ' 00:00:00';
            const to = datetime.toISOString().slice(0, 10) + ' 23:59:59';
            const q = `select count(*) as count from business where created_at between '${from}' and '${to}'`;
            return yield db.query(query || q).then((results) => results[0]);
        });
    }
    findTotalUsers(query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `select count(*) as count from users`;
            return yield db.query(query || q).then((results) => results[0]);
        });
    }
}
exports.BusinessRepository = BusinessRepository;
//# sourceMappingURL=BusinessRepository.js.map