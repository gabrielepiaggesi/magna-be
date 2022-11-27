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
class InsightRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "apps_versions";
    }
    findTotalUsers(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) from users where deleted_at is null`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTodayUsers(today, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            today = today + '%';
            const c = conn;
            const q = `select count(*) from users where created_at like ${mysql2_1.default.escape(today)} and deleted_at is null and id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalFidelitiesCards(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) from users_fidelities_cards where deleted_at is null and user_id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalBusinesses(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) from businesses where deleted_at is null`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalReservations(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) from reservations where deleted_at is null and user_id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalReservationsToday(today, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            today = today + '%';
            const c = conn;
            const q = `select count(*) from reservations where created_at like ${mysql2_1.default.escape(today)} and deleted_at is null and user_id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalReviews(conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            const q = `select count(*) from users_reviews where deleted_at is null and user_id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
    findTotalReviewsToday(today, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            today = today + '%';
            const c = conn;
            const q = `select count(*) from users_reviews where created_at like ${mysql2_1.default.escape(today)} and deleted_at is null and user_id != 1`;
            return yield c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
        });
    }
}
exports.InsightRepository = InsightRepository;
//# sourceMappingURL=InsightRepository.js.map