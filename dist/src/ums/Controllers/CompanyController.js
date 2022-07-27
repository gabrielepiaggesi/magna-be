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
const Logger_1 = require("../../framework/services/Logger");
const Decorator_1 = require("../../utils/Decorator");
const CompanyService_1 = require("../service/CompanyService");
// services
const companyService = new CompanyService_1.CompanyService();
const LOG = new Logger_1.Logger("CompanyController.class");
class CompanyController {
    newCompany(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield companyService.newCompany(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Company.NewCompany' }));
            }
        });
    }
    invite(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield companyService.inviteUserInCompany(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Company.Invite' }));
            }
        });
    }
    getCompany(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield companyService.getCompanyInfo(parseInt(req.params.companyId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Company.GetCompany' }));
            }
        });
    }
    getUserCompanies(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                console.log('USER ID ', loggedUserId);
                const response = yield companyService.getUserCompanies(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Company.GetUserCompanies' }));
            }
        });
    }
    updateCompanyDetails(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield companyService.updateCompanyDetails(req.body, parseInt(req.params.companyId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Company.UpdateCompanyDetails' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/newCompany")
], CompanyController.prototype, "newCompany", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/invite")
], CompanyController.prototype, "invite", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/invite/:companyId")
], CompanyController.prototype, "getCompany", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserCompanies")
], CompanyController.prototype, "getUserCompanies", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateCompanyDetails/:companyId")
], CompanyController.prototype, "updateCompanyDetails", null);
exports.CompanyController = CompanyController;
//# sourceMappingURL=CompanyController.js.map