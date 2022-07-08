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
const UserApplicationService_1 = require("../service/UserApplicationService");
const Decorator_1 = require("../../utils/Decorator");
const LOG = new Logger_1.Logger("UserApplicationController.class");
const userApplicationService = new UserApplicationService_1.UserApplicationService();
class UserApplicationController {
    createUserApplication(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.createUserApplication(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.CreateUserApplication' }));
            }
        });
    }
    getUserApplication(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userApplicationService.getUserApplication(parseInt(req.params.userId, 10), parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.GetUserApplication' }));
            }
        });
    }
    createUserQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.createUserQuiz(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.CreateUserQuiz' }));
            }
        });
    }
    createUserTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.createUserTest(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.CreateUserTest' }));
            }
        });
    }
    updateUserTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.updateUserTest(req.body, parseInt(req.params.userTestId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.UpdateUserTest' }));
            }
        });
    }
    confirmAndSendUserQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.confirmAndSendUserQuiz(parseInt(req.params.userQuizId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.ConfirmAndSendUserQuiz' }));
            }
        });
    }
    getUserQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.getUserQuiz(parseInt(req.params.quizId, 10), parseInt(req.params.jobOfferId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'UserApplication.GetUserQuiz' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserApplication")
], UserApplicationController.prototype, "createUserApplication", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserApplication/:userId/:jobOfferId")
], UserApplicationController.prototype, "getUserApplication", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserQuiz")
], UserApplicationController.prototype, "createUserQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserTest")
], UserApplicationController.prototype, "createUserTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateUserTest/:userTestId")
], UserApplicationController.prototype, "updateUserTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/confirmAndSendUserQuiz/:userQuizId")
], UserApplicationController.prototype, "confirmAndSendUserQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/getUserQuiz/:quizId/:jobOfferId")
], UserApplicationController.prototype, "getUserQuiz", null);
exports.UserApplicationController = UserApplicationController;
//# sourceMappingURL=UserApplicationController.js.map