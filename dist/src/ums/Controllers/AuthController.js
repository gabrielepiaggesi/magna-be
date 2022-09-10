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
const AuthService_1 = require("../service/AuthService");
// services
const authService = new AuthService_1.AuthService();
const LOG = new Logger_1.Logger("AuthController.class");
class AuthController {
    login(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield authService.login(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Auth.Login.Error' }));
            }
        });
    }
    signup(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield authService.signup(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Auth.Signup.Error' }));
            }
        });
    }
    signupLanding(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield authService.signupLanding(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Auth.SignupLanding.Error' }));
            }
        });
    }
    getLoggedUser(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield authService.getLoggedUser(loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Auth.getLoggedUser.Error' }));
            }
        });
    }
    totalUsers(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield authService.totalUsers();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Auth.totalUsers.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/login")
], AuthController.prototype, "login", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/signup")
], AuthController.prototype, "signup", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/signupLanding")
], AuthController.prototype, "signupLanding", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getLoggedUser")
], AuthController.prototype, "getLoggedUser", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/totalUsers")
], AuthController.prototype, "totalUsers", null);
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map