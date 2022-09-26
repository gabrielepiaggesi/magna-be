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
const __1 = require("../..");
const Logger_1 = require("../../mgn-framework/services/Logger");
const Decorator_1 = require("../../utils/Decorator");
const UserReferralService_1 = require("../service/UserReferralService");
// services
const userReferralService = new UserReferralService_1.UserReferralService();
const LOG = new Logger_1.Logger("UserReferralController.class");
class UserReferralController {
    generateUserReferral(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userReferralService.generateUserReferral(parseInt(req.params.userId, 10), parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReferral.generateUserReferral.Error' }));
            }
        });
    }
    getUserReferralInsight(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userReferralService.getUserReferralInsight(parseInt(req.params.referralId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReferral.getUserReferralInsight.Error' }));
            }
        });
    }
    generateUserDiscountFromReferral(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userReferralService.generateUserDiscountFromReferral(req.params.uuid, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReferral.generateUserDiscountFromReferral.Error' }));
            }
        });
    }
    getUserReferral(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userReferralService.getUserReferral(parseInt(req.params.userId, 10), parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReferral.getUserReferral.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/generateUserReferral/:userId/:businessId")
], UserReferralController.prototype, "generateUserReferral", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserReferralInsight/:referralId")
], UserReferralController.prototype, "getUserReferralInsight", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/generateUserDiscountFromReferral/:uuid")
], UserReferralController.prototype, "generateUserDiscountFromReferral", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserReferral/:userId/:businessId")
], UserReferralController.prototype, "getUserReferral", null);
exports.UserReferralController = UserReferralController;
//# sourceMappingURL=UserReferralController.js.map