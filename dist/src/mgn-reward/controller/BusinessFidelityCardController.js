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
const BusinessFidelityCardService_1 = require("../service/BusinessFidelityCardService");
// services
const businessFidelityCardService = new BusinessFidelityCardService_1.BusinessFidelityCardService();
const LOG = new Logger_1.Logger("BusinessFidelityCardController.class");
class BusinessFidelityCardController {
    addBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.addBusinessFidelityCard(req.body, parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.addBusinessFidelityCard.Error' }));
            }
        });
    }
    deleteBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessFidelityCardService.deleteBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.deleteBusinessFidelityCard.Error' }));
            }
        });
    }
    updateBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.updateBusinessFidelityCard(req.body, parseInt(req.params.businessFidelityCardId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.updateBusinessFidelityCard.Error' }));
            }
        });
    }
    suspendBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessFidelityCardService.suspendBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.suspendBusinessFidelityCard.Error' }));
            }
        });
    }
    activateBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessFidelityCardService.activateBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.activateBusinessFidelityCard.Error' }));
            }
        });
    }
    getBusinessFidelityCard(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.getBusinessFidelityCard(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.getBusinessFidelityCard.Error' }));
            }
        });
    }
    getBusinessFidelityCards(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.getBusinessFidelityCards(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.getBusinessFidelityCards.Error' }));
            }
        });
    }
    checkUserFidelityCardValidity(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.checkUserFidelityCardValidity(parseInt(req.params.userFidelityCardId, 10), parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.checkUserFidelityCardValidity.Error' }));
            }
        });
    }
    resetUserFidelityCardValidity(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessFidelityCardService.resetUserFidelityCardValidity(parseInt(req.params.userFidelityCardId, 10), parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessFidelityCard.resetUserFidelityCardValidity.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addBusinessFidelityCard/:businessId")
], BusinessFidelityCardController.prototype, "addBusinessFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteBusinessFidelityCard/:businessFidelityCardId")
], BusinessFidelityCardController.prototype, "deleteBusinessFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateBusinessFidelityCard/:businessFidelityCardId")
], BusinessFidelityCardController.prototype, "updateBusinessFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/suspendBusinessFidelityCard/:businessFidelityCardId")
], BusinessFidelityCardController.prototype, "suspendBusinessFidelityCard", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/activateBusinessFidelityCard/:businessFidelityCardId")
], BusinessFidelityCardController.prototype, "activateBusinessFidelityCard", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessFidelityCard/:businessId")
], BusinessFidelityCardController.prototype, "getBusinessFidelityCard", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessFidelityCards/:businessId")
], BusinessFidelityCardController.prototype, "getBusinessFidelityCards", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/checkUserFidelityCardValidity/:userFidelityCardId/:businessId")
], BusinessFidelityCardController.prototype, "checkUserFidelityCardValidity", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/resetUserFidelityCardValidity/:userFidelityCardId/:businessId")
], BusinessFidelityCardController.prototype, "resetUserFidelityCardValidity", null);
exports.BusinessFidelityCardController = BusinessFidelityCardController;
//# sourceMappingURL=BusinessFidelityCardController.js.map