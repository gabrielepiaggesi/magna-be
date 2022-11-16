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
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../mgn-framework/services/Logger");
const InsightRepository_1 = require("../repository/InsightRepository");
const LOG = new Logger_1.Logger("InsightService.class");
const db = require("../../connection");
const insightRepository = new InsightRepository_1.InsightRepository();
class InsightService {
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const count = yield insightRepository.findTotalUsers(connection);
            LOG.info('getTotalUsers', count);
            yield connection.release();
            return count;
        });
    }
    getTotalFidelitiesCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const count = yield insightRepository.findTotalFidelitiesCards(connection);
            LOG.info('getTotalFidelitiesCards', count);
            yield connection.release();
            return count;
        });
    }
    getTotalBusinesses() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const count = yield insightRepository.findTotalBusinesses(connection);
            LOG.info('getTotalBusinesses', count);
            yield connection.release();
            return count;
        });
    }
    getTotalReservations() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const count = yield insightRepository.findTotalReservations(connection);
            LOG.info('getTotalReservations', count);
            yield connection.release();
            return count;
        });
    }
    getTotalReservationsToday() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const today = new Date(Date.now()).toISOString().substring(0, 10);
            const count = yield insightRepository.findTotalReservationsToday(today, connection);
            LOG.info('getTotalReservationsToday', count);
            yield connection.release();
            return count;
        });
    }
    getTotalReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const count = yield insightRepository.findTotalReviews(connection);
            LOG.info('getTotalReviews', count);
            yield connection.release();
            return count;
        });
    }
    getTotalReviewsToday() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const today = new Date(Date.now()).toISOString().substring(0, 10);
            const count = yield insightRepository.findTotalReviewsToday(today, connection);
            LOG.info('getTotalReviewsToday', count);
            yield connection.release();
            return count;
        });
    }
}
exports.InsightService = InsightService;
//# sourceMappingURL=InsightService.js.map