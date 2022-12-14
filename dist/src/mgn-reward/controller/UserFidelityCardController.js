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
const UserFidelityCardService_1 = require("../service/UserFidelityCardService");
// services
const userFidelityCardService = new UserFidelityCardService_1.UserFidelityCardService();
const LOG = new Logger_1.Logger("UserFidelityCardController.class");
class UserFidelityCardController {
    addUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userFidelityCardService.addUserFidelityCard(parseInt(req.params.businessId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.addUserFidelityCard.Error' }));
            }
        });
    }
    deleteUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userFidelityCardService.deleteUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.deleteUserFidelityCard.Error' }));
            }
        });
    }
    updateUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userFidelityCardService.updateUserFidelityCard(req.body, parseInt(req.params.userFidelityCardId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.updateUserFidelityCard.Error' }));
            }
        });
    }
    suspendUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userFidelityCardService.suspendUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.suspendUserFidelityCard.Error' }));
            }
        });
    }
    activateUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userFidelityCardService.activateUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.activateUserFidelityCard.Error' }));
            }
        });
    }
    getUserFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userFidelityCardService.getUserFidelityCard(parseInt(req.params.userFidelityCardId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.getUserFidelityCard.Error' }));
            }
        });
    }
    getUserFidelityCards(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userFidelityCardService.getUserFidelityCards(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserFidelityCard.getUserFidelityCards.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addUserFidelityCard/:businessId")
], UserFidelityCardController.prototype, "addUserFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteUserFidelityCard/:userFidelityCardId")
], UserFidelityCardController.prototype, "deleteUserFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateUserFidelityCard/:userFidelityCardId")
], UserFidelityCardController.prototype, "updateUserFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/suspendUserFidelityCard/:userFidelityCardId")
], UserFidelityCardController.prototype, "suspendUserFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/activateUserFidelityCard/:userFidelityCardId")
], UserFidelityCardController.prototype, "activateUserFidelityCard", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserFidelityCard/:userFidelityCardId")
], UserFidelityCardController.prototype, "getUserFidelityCard", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserFidelityCards")
], UserFidelityCardController.prototype, "getUserFidelityCards", null);
exports.UserFidelityCardController = UserFidelityCardController;
//# sourceMappingURL=UserFidelityCardController.js.map