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
    getTodayUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const today = new Date(Date.now()).toISOString().substring(0, 10);
            const count = yield insightRepository.findTodayUsers(today, connection);
            LOG.info('getTodayUsers', count);
            yield connection.release();
            return count;
        });
    }
    getTotalFidelitiesCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const cardsBusinessIds = yield insightRepository.findTotalFidelitiesCards(connection); // [6,6,6,7,8]
            LOG.info('getTotalFidelitiesCards', cardsBusinessIds);
            yield connection.release();
            let cardsByBusiness = [];
            cardsBusinessIds.forEach(cardObj => {
                const businessFound = cardsByBusiness.find(elem => elem.business_id == cardObj.business_id);
                if (businessFound) {
                    businessFound.total = (businessFound.total || 0) + 1;
                    businessFound.cards = (businessFound.cards || []).concat(cardObj);
                }
                else {
                    cardsByBusiness.push({
                        business_id: cardObj.business_id,
                        cards: [cardObj],
                        total: 1
                    });
                }
            });
            let result = {
                cardsByBusiness,
                totalCards: cardsBusinessIds.length
            };
            return result;
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