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
const multer_1 = require("multer");
const ExamApplicationService_1 = require("../service/ExamApplicationService");
const LOG = new Logger_1.Logger("ExamApplicationController.class");
const userApplicationService = new ExamApplicationService_1.ExamApplicationService();
const multerConfig = {
    storage: multer_1.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
};
class ExamApplicationController {
    createUserApplication(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = JSON.parse(req.body.data);
                const files = req.files;
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.createUserApplication(body, files, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.CreateUserApplication' }));
            }
        });
    }
    uploadUserTestImage(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = JSON.parse(req.body.data);
                const file = req.file;
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.uploadUserTestImage(Object.assign(Object.assign({}, body), { file }), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.UploadUserTestImage' }));
            }
        });
    }
    uploadUserCodeImage(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = JSON.parse(req.body.data);
                const file = req.file;
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.uploadUserCodeImage(Object.assign(Object.assign({}, body), { file }), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.uploadUserCodeImage' }));
            }
        });
    }
    assignPointToUserTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userApplicationService.assignPointToUserTest(parseInt(req.params.point, 10), parseInt(req.params.userTestId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.assignPointToUserTest' }));
            }
        });
    }
    getUserApplication(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userApplicationService.getUserApplication(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.GetUserApplication' }));
            }
        });
    }
    getUserTestsImages(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield userApplicationService.getUserTestsImages(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.getUserTestsImages' }));
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
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.CreateUserQuiz' }));
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
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.CreateUserTest' }));
            }
        });
    }
    createUserTests(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.createUserTests(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.CreateUserTests' }));
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
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.UpdateUserTest' }));
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
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.ConfirmAndSendUserQuiz' }));
            }
        });
    }
    getUserQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield userApplicationService.getUserQuiz(parseInt(req.params.quizId, 10), parseInt(req.params.examId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'ExamApplication.GetUserQuiz' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserApplication"),
    Decorator_1.Multer({ multerConfig, type: 'multiple' })
], ExamApplicationController.prototype, "createUserApplication", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/uploadUserTestImage"),
    Decorator_1.Multer({ multerConfig, type: 'single', path: 'file' })
], ExamApplicationController.prototype, "uploadUserTestImage", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/uploadUserCodeImage"),
    Decorator_1.Multer({ multerConfig, type: 'single', path: 'file' })
], ExamApplicationController.prototype, "uploadUserCodeImage", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/assignPointToUserTest/:point/:userTestId")
], ExamApplicationController.prototype, "assignPointToUserTest", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserApplication/:userId/:examId")
], ExamApplicationController.prototype, "getUserApplication", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserTestsImages/:userId/:examId")
], ExamApplicationController.prototype, "getUserTestsImages", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserQuiz")
], ExamApplicationController.prototype, "createUserQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserTest")
], ExamApplicationController.prototype, "createUserTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createUserTests")
], ExamApplicationController.prototype, "createUserTests", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateUserTest/:userTestId")
], ExamApplicationController.prototype, "updateUserTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/confirmAndSendUserQuiz/:userQuizId")
], ExamApplicationController.prototype, "confirmAndSendUserQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/getUserQuiz/:quizId/:examId")
], ExamApplicationController.prototype, "getUserQuiz", null);
exports.ExamApplicationController = ExamApplicationController;
//# sourceMappingURL=ExamApplicationController.js.map