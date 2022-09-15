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
const BusinessDiscountService_1 = require("../service/BusinessDiscountService");
// services
const businessDiscountService = new BusinessDiscountService_1.BusinessDiscountService();
const LOG = new Logger_1.Logger("BusinessDiscountController.class");
class BusinessDiscountController {
    addBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessDiscountService.addBusinessDiscount(req.body, parseInt(req.params.discountId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.addBusinessDiscount.Error' }));
            }
        });
    }
    deleteBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessDiscountService.deleteBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.deleteBusinessDiscount.Error' }));
            }
        });
    }
    updateBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessDiscountService.updateBusinessDiscount(req.body, parseInt(req.params.discountId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.updateBusinessDiscount.Error' }));
            }
        });
    }
    suspendBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessDiscountService.suspendBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.suspendBusinessDiscount.Error' }));
            }
        });
    }
    activateBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield businessDiscountService.activateBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.activateBusinessDiscount.Error' }));
            }
        });
    }
    getBusinessDiscount(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessDiscountService.getBusinessDiscount(parseInt(req.params.discountId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.getBusinessDiscount.Error' }));
            }
        });
    }
    getBusinessDiscounts(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessDiscountService.getBusinessDiscounts(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.getBusinessDiscounts.Error' }));
            }
        });
    }
    checkUserDiscountValidity(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield businessDiscountService.checkUserDiscountValidity(parseInt(req.params.userDiscountId, 10), parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'BusinessDiscount.checkUserDiscountValidity.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "addBusinessDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/deleteBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "deleteBusinessDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "updateBusinessDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/suspendBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "suspendBusinessDiscount", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/activateBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "activateBusinessDiscount", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessDiscount/:discountId")
], BusinessDiscountController.prototype, "getBusinessDiscount", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getBusinessDiscounts/:businessId")
], BusinessDiscountController.prototype, "getBusinessDiscounts", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/checkUserDiscountValidity/:userDiscountId/:businessId")
], BusinessDiscountController.prototype, "checkUserDiscountValidity", null);
exports.BusinessDiscountController = BusinessDiscountController;
//# sourceMappingURL=BusinessDiscountController.js.map