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
const UserReviewService_1 = require("../service/UserReviewService");
// services
const userReviewService = new UserReviewService_1.UserReviewService();
const LOG = new Logger_1.Logger("UserReviewController.class");
class UserReviewController {
    getBusinessReviews(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userReviewService.getBusinessReviews(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReview.getBusinessReviews.Error' }));
            }
        });
    }
    getUserReviews(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userReviewService.getUserReviews(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReview.getUserReviews.Error' }));
            }
        });
    }
    addBusinessReview(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userReviewService.addBusinessReview(req.body, parseInt(req.params.businessId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReview.addBusinessReview.Error' }));
            }
        });
    }
    deleteUserReview(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userReviewService.deleteUserReview(parseInt(req.params.userReviewId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserReview.deleteUserReview.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessReviews/:businessId")
], UserReviewController.prototype, "getBusinessReviews", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserReviews")
], UserReviewController.prototype, "getUserReviews", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addBusinessReview/:businessId")
], UserReviewController.prototype, "addBusinessReview", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteUserReview/:userReviewId")
], UserReviewController.prototype, "deleteUserReview", null);
exports.UserReviewController = UserReviewController;
//# sourceMappingURL=UserReviewController.js.map