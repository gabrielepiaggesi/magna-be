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
const QuizService_1 = require("../service/QuizService");
const Decorator_1 = require("../../utils/Decorator");
const multer_1 = require("multer");
const LOG = new Logger_1.Logger("QuizController.class");
const quizService = new QuizService_1.QuizService();
const multerConfig = {
    storage: multer_1.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
};
class QuizController {
    createQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.createQuiz(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.CreateQuiz' }));
            }
        });
    }
    updateQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.updateQuiz(req.body, parseInt(req.params.jQuizId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.UpdateQuiz' }));
            }
        });
    }
    createTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = JSON.parse(req.body.data);
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.createTest(Object.assign(Object.assign({}, body), { file: req.file || null }), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.CreateTest' }));
            }
        });
    }
    updateTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = JSON.parse(req.body.data);
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.updateTest({ test: Object.assign({}, body), file: req.file || body.file || null }, parseInt(req.params.testId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.UpdateTest' }));
            }
        });
    }
    editTestOption(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.editTestOption(req.body, parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.EditTestOption' }));
            }
        });
    }
    removeTestOption(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.removeTestOption(parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.RemoveTestOption' }));
            }
        });
    }
    editTestText(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.editTestText(req.body, parseInt(req.params.textId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.EditTestText' }));
            }
        });
    }
    removeTestText(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.removeTestText(parseInt(req.params.textId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.RemoveTestText' }));
            }
        });
    }
    createNewTestImage(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.createNewTestImage(Object.assign(Object.assign({}, req.body), { newFile: req.file }), parseInt(req.params.testId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.CreateNewTestImage' }));
            }
        });
    }
    removeTestImage(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.removeTestImage(parseInt(req.params.imageId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.RemoveTestImage' }));
            }
        });
    }
    getTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.getTest(parseInt(req.params.testId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.GetTest' }));
            }
        });
    }
    getQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.getQuiz(parseInt(req.params.quizId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.GetQuiz' }));
            }
        });
    }
    getJobOfferQuizs(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield quizService.getJobOfferQuizs(parseInt(req.params.jobOfferId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.GetQuiz' }));
            }
        });
    }
    createNewTestOption(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.createNewTestOption(req.body, parseInt(req.params.testId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.createNewTestOption' }));
            }
        });
    }
    removeTest(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.removeTest(parseInt(req.params.testId, 10), parseInt(req.params.quizId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.removeTest' }));
            }
        });
    }
    removeQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.removeQuiz(parseInt(req.params.quizId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.removeQuiz' }));
            }
        });
    }
    createNewTestText(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield quizService.createNewTestText(req.body, parseInt(req.params.testId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Quiz.createNewTestText' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createQuiz")
], QuizController.prototype, "createQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateQuiz/:jQuizId")
], QuizController.prototype, "updateQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createTest"),
    Decorator_1.Multer({ multerConfig, path: 'file' })
], QuizController.prototype, "createTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateTest/:testId"),
    Decorator_1.Multer({ multerConfig, path: 'file' })
], QuizController.prototype, "updateTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/editTestOption/:optionId")
], QuizController.prototype, "editTestOption", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeTestOption/:optionId")
], QuizController.prototype, "removeTestOption", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/editTestText/:textId")
], QuizController.prototype, "editTestText", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeTestText/:textId")
], QuizController.prototype, "removeTestText", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createNewTestImage/:testId")
], QuizController.prototype, "createNewTestImage", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeTestImage/:imageId")
], QuizController.prototype, "removeTestImage", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getTest/:testId")
], QuizController.prototype, "getTest", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getQuiz/:quizId")
], QuizController.prototype, "getQuiz", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOfferQuizs/:jobOfferId")
], QuizController.prototype, "getJobOfferQuizs", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createNewTestOption/:testId")
], QuizController.prototype, "createNewTestOption", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeTest/:testId/:quizId")
], QuizController.prototype, "removeTest", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeQuiz/:quizId")
], QuizController.prototype, "removeQuiz", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createNewTestText/:testId")
], QuizController.prototype, "createNewTestText", null);
exports.QuizController = QuizController;
//# sourceMappingURL=QuizController.js.map