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
const ExamService_1 = require("../service/ExamService");
// services
const examService = new ExamService_1.ExamService();
const LOG = new Logger_1.Logger("ExamController.class");
class ExamController {
    createExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield examService.createExam(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.createExam' }));
            }
        });
    }
    updateExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.updateExam(req.body, parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.updateExam' }));
            }
        });
    }
    updateExamSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.updateExamSkill(req.body, parseInt(req.params.skillId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.updateExamSkill' }));
            }
        });
    }
    addExamSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.addExamSkill(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.addExamSkill' }));
            }
        });
    }
    addQuizsToExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.addQuizsToExam(parseInt(req.params.examId, 10), req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.addQuizsToExam' }));
            }
        });
    }
    removeExamSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.removeExamSkill(parseInt(req.params.skillId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.removeExamSkill' }));
            }
        });
    }
    getExams(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield examService.getExams(parseInt(req.params.companyId, 10), req.params.status.toString().toUpperCase());
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExams' }));
            }
        });
    }
    getUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getUserData(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getUserData' }));
            }
        });
    }
    getExamUserReport(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamUserReport(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamUserReport' }));
            }
        });
    }
    getExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExam(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExam' }));
            }
        });
    }
    getExamFromLink(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamFromLink(req.params.linkUUID.toString());
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamFromLink' }));
            }
        });
    }
    getExamSkills(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamSkills(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamSkills' }));
            }
        });
    }
    getUsersDataOptions(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getUsersDataOptions();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.GetUsersDataOptions' }));
            }
        });
    }
    setExamUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.setExamUserData(req.body, parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.setExamUserData' }));
            }
        });
    }
    getExamUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamUserData(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamUserData' }));
            }
        });
    }
    addExamUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.addExamUserData(parseInt(req.params.examId, 10), parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.addExamUserData' }));
            }
        });
    }
    removeExamUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.removeExamUserData(parseInt(req.params.examId, 10), parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.removeExamUserData' }));
            }
        });
    }
    removeExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.removeExam(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.removeExam' }));
            }
        });
    }
    addQuizToExam(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.addQuizToExam(parseInt(req.params.examId, 10), parseInt(req.params.quizId, 10), parseInt(req.params.companyId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.addQuizToExam' }));
            }
        });
    }
    removeExamQuiz(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.removeExamQuiz(parseInt(req.params.examId, 10), parseInt(req.params.quizId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.removeExamQuiz' }));
            }
        });
    }
    getExamUserApplicationsList(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamUserApplicationsList(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamUserApplicationsList' }));
            }
        });
    }
    getExamQuizs(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield examService.getExamQuizs(parseInt(req.params.examId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Exam.getExamQuizs' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createExam")
], ExamController.prototype, "createExam", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateExam/:examId")
], ExamController.prototype, "updateExam", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/editExamSkill/:skillId")
], ExamController.prototype, "updateExamSkill", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addExamSkill")
], ExamController.prototype, "addExamSkill", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addQuizsToExam/:examId")
], ExamController.prototype, "addQuizsToExam", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeExamSkill/:skillId")
], ExamController.prototype, "removeExamSkill", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExams/:companyId/:status")
], ExamController.prototype, "getExams", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserData/:userId/:examId")
], ExamController.prototype, "getUserData", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamUserReport/:userId/:examId")
], ExamController.prototype, "getExamUserReport", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExam/:examId")
], ExamController.prototype, "getExam", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamFromLink/:linkUUID")
], ExamController.prototype, "getExamFromLink", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamSkills/:examId")
], ExamController.prototype, "getExamSkills", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUsersDataOptions")
], ExamController.prototype, "getUsersDataOptions", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/setExamUserData/:examId")
], ExamController.prototype, "setExamUserData", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamUserData/:examId")
], ExamController.prototype, "getExamUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addExamUserData/:examId/:optionId")
], ExamController.prototype, "addExamUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeExamUserData/:examId/:optionId")
], ExamController.prototype, "removeExamUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeExam/:examId")
], ExamController.prototype, "removeExam", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addQuizToExam/:examId/:quizId/:companyId")
], ExamController.prototype, "addQuizToExam", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeExamQuiz/:examId/:quizId")
], ExamController.prototype, "removeExamQuiz", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamUserApplicationsList/:examId")
], ExamController.prototype, "getExamUserApplicationsList", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getExamQuizs/:examId")
], ExamController.prototype, "getExamQuizs", null);
exports.ExamController = ExamController;
//# sourceMappingURL=ExamController.js.map