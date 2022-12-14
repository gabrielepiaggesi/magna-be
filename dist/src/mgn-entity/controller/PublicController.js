"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const Decorator_1 = require("../../utils/Decorator");
const BusinessService_1 = require("../service/BusinessService");
const InsightService_1 = require("../service/InsightService");
// services
const businessService = new BusinessService_1.BusinessService();
const insightService = new InsightService_1.InsightService();
const LOG = new Logger_1.Logger("PublicController.class");
class PublicController {
    getBusinessInfo(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessService.getBusinessInfo(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getBusinessInfo.Error' }));
            }
        });
    }
    getTotalUsers(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalUsers();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalUsers.Error' }));
            }
        });
    }
    getTodayUsers(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTodayUsers();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTodayUsers.Error' }));
            }
        });
    }
    getTotalFidelitiesCards(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalFidelitiesCards();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalFidelitiesCards.Error' }));
            }
        });
    }
    getTotalBusinesses(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalBusinesses();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalBusinesses.Error' }));
            }
        });
    }
    getTotalReservations(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalReservations();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalReservations.Error' }));
            }
        });
    }
    getTotalReservationsToday(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalReservationsToday();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalReservationsToday.Error' }));
            }
        });
    }
    getTotalReviews(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalReviews();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalReviews.Error' }));
            }
        });
    }
    getTotalReviewsToday(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield insightService.getTotalReviewsToday();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getTotalReviewsToday.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessInfo/:businessId")
], PublicController.prototype, "getBusinessInfo", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalUsers")
], PublicController.prototype, "getTotalUsers", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTodayUsers")
], PublicController.prototype, "getTodayUsers", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalFidelitiesCards")
], PublicController.prototype, "getTotalFidelitiesCards", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalBusinesses")
], PublicController.prototype, "getTotalBusinesses", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalReservations")
], PublicController.prototype, "getTotalReservations", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalReservationsToday")
], PublicController.prototype, "getTotalReservationsToday", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalReviews")
], PublicController.prototype, "getTotalReviews", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTotalReviewsToday")
], PublicController.prototype, "getTotalReviewsToday", null);
exports.PublicController = PublicController;
//# sourceMappingURL=PublicController.js.map