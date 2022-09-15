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
const UserDiscountService_1 = require("../service/UserDiscountService");
// services
const userDiscountService = new UserDiscountService_1.UserDiscountService();
const LOG = new Logger_1.Logger("UserDiscountController.class");
class UserDiscountController {
    addUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userDiscountService.addUserDiscount(req.body, parseInt(req.params.userId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.addUserDiscount.Error' }));
            }
        });
    }
    deleteUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userDiscountService.deleteUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.deleteUserDiscount.Error' }));
            }
        });
    }
    updateUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userDiscountService.updateUserDiscount(req.body, parseInt(req.params.userDiscountId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.updateUserDiscount.Error' }));
            }
        });
    }
    suspendUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userDiscountService.suspendUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.suspendUserDiscount.Error' }));
            }
        });
    }
    activateUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userDiscountService.suspendUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.suspendUserDiscount.Error' }));
            }
        });
    }
    getUserDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userDiscountService.getUserDiscount(parseInt(req.params.userDiscountId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.getUserDiscount.Error' }));
            }
        });
    }
    getUserDiscounts(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userDiscountService.getUserDiscounts(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserDiscount.getUserDiscounts.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addUserDiscount/:userId")
], UserDiscountController.prototype, "addUserDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteUserDiscount/:userDiscountId")
], UserDiscountController.prototype, "deleteUserDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateUserDiscount/:userDiscountId")
], UserDiscountController.prototype, "updateUserDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/suspendUserDiscount/:userDiscountId")
], UserDiscountController.prototype, "suspendUserDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/activateUserDiscount/:userDiscountId")
], UserDiscountController.prototype, "activateUserDiscount", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserDiscount/:userDiscountId")
], UserDiscountController.prototype, "getUserDiscount", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserDiscounts")
], UserDiscountController.prototype, "getUserDiscounts", null);
exports.UserDiscountController = UserDiscountController;
//# sourceMappingURL=UserDiscountController.js.map