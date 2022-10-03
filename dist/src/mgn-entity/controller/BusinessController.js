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
const BusinessService_1 = require("../service/BusinessService");
// services
const businessService = new BusinessService_1.BusinessService();
const LOG = new Logger_1.Logger("BusinessController.class");
class BusinessController {
    addBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessService.addBusiness(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.addBusiness.Error' }));
            }
        });
    }
    addUserBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessService.addUserBusiness(parseInt(req.params.businessId, 10), parseInt(req.params.userId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.addUserBusiness.Error' }));
            }
        });
    }
    removeUserBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessService.removeUserBusiness(parseInt(req.params.businessId, 10), parseInt(req.params.userId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.removeUserBusiness.Error' }));
            }
        });
    }
    sendNotificationToClients(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessService.sendNotificationToClients(parseInt(req.params.businessId, 10), loggedUserId, req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.sendNotificationToClients.Error' }));
            }
        });
    }
    getUserBusinesses(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessService.getUserBusinesses(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getUserBusinesses.Error' }));
            }
        });
    }
    deleteBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessService.deleteBusiness(parseInt(req.params.businessId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.deleteBusiness.Error' }));
            }
        });
    }
    updateBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessService.updateBusiness(parseInt(req.params.businessId, 10), req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.updateBusiness.Error' }));
            }
        });
    }
    getBusiness(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessService.getBusiness(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getBusiness.Error' }));
            }
        });
    }
    getUserBusinessesList(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessService.getUserBusinessesList(parseInt(req.params.userId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Business.getUserBusinessesList.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addBusiness")
], BusinessController.prototype, "addBusiness", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addUserBusiness/:businessId/:userId")
], BusinessController.prototype, "addUserBusiness", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeUserBusiness/:businessId/:userId")
], BusinessController.prototype, "removeUserBusiness", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/sendNotificationToClients/:businessId")
], BusinessController.prototype, "sendNotificationToClients", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserBusinesses/:businessId")
], BusinessController.prototype, "getUserBusinesses", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteBusiness/:businessId")
], BusinessController.prototype, "deleteBusiness", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateBusiness/:businessId")
], BusinessController.prototype, "updateBusiness", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusiness/:businessId")
], BusinessController.prototype, "getBusiness", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserBusinessesList/:userId")
], BusinessController.prototype, "getUserBusinessesList", null);
exports.BusinessController = BusinessController;
//# sourceMappingURL=BusinessController.js.map