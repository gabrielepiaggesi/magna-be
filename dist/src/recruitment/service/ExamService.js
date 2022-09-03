"use strict";
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
const Logger_1 = require("../../framework/services/Logger");
const IndroError_1 = require("../../utils/IndroError");
const UserDataOptionRepository_1 = require("../repository/UserDataOptionRepository");
const UserApplicationRepository_1 = require("../repository/UserApplicationRepository");
const UserQuizRepository_1 = require("../repository/UserQuizRepository");
const UserDataRepository_1 = require("../repository/UserDataRepository");
const UserSkillRepository_1 = require("../repository/UserSkillRepository");
const CompanyRepository_1 = require("../../ums/repository/CompanyRepository");
const ExamRepository_1 = require("../repository/ExamRepository");
const Exam_1 = require("../model/Exam");
const ExamSkillRepository_1 = require("../repository/ExamSkillRepository");
const ExamLink_1 = require("../model/ExamLink");
const ExamLinkRepository_1 = require("../repository/ExamLinkRepository");
const ExamSkill_1 = require("../model/ExamSkill");
const ExamUserDataRepository_1 = require("../repository/ExamUserDataRepository");
const ExamUserData_1 = require("../model/ExamUserData");
const ExamQuizRepository_1 = require("../repository/ExamQuizRepository");
const ExamQuiz_1 = require("../model/ExamQuiz");
const QuizRepository_1 = require("../repository/QuizRepository");
const CompanyQuizRepository_1 = require("../repository/CompanyQuizRepository");
const UserTestRepository_1 = require("../repository/UserTestRepository");
const TestRepository_1 = require("../repository/TestRepository");
const TestOptionRepository_1 = require("../repository/TestOptionRepository");
const shortid = require('shortid');
const LOG = new Logger_1.Logger("JobOfferService.class");
const db = require("../../connection");
const userDataOptionRepository = new UserDataOptionRepository_1.UserDataOptionRepository();
const userApplicationRepository = new UserApplicationRepository_1.UserApplicationRepository();
const userQuizRepository = new UserQuizRepository_1.UserQuizRepository();
const userDataRepository = new UserDataRepository_1.UserDataRepository();
const userSkillRepository = new UserSkillRepository_1.UserSkillRepository();
const companyRepository = new CompanyRepository_1.CompanyRepository();
const companyQuizRepository = new CompanyQuizRepository_1.CompanyQuizRepository();
const examRepository = new ExamRepository_1.ExamRepository();
const examSkillRepository = new ExamSkillRepository_1.ExamSkillRepository();
const examLinkRepository = new ExamLinkRepository_1.ExamLinkRepository();
const examUserDataRepository = new ExamUserDataRepository_1.ExamUserDataRepository();
const examQuizRepository = new ExamQuizRepository_1.ExamQuizRepository();
const quizRepository = new QuizRepository_1.QuizRepository();
const userTestRepository = new UserTestRepository_1.UserTestRepository();
const testRepository = new TestRepository_1.TestRepository();
const testOptionRepository = new TestOptionRepository_1.TestOptionRepository();
class ExamService {
    createExam(exDTO, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newExam = yield this.updateOrCreateExam(exDTO.exam, null, loggedUserId, connection);
            // const skillsSaved = await this.saveExamSkills(exDTO.skills, newExam.id, connection);
            const link = yield this.saveNewExamLink(newExam.id, newExam.company_id, connection);
            //name,lastname,email
            const data = yield this.saveExamUserData([1, 2, 4], newExam.id, connection);
            yield connection.commit();
            yield connection.release();
            return { newExam: newExam, link };
        });
    }
    updateExam(exDTO, examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            console.log(examId);
            const newExam = yield this.updateOrCreateExam(exDTO, examId, null, connection);
            yield connection.commit();
            yield connection.release();
            return newExam;
        });
    }
    updateExamSkill(skillDTO, skillId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.updateOrCreateExamSkill(skillDTO, skillId, connection);
            yield connection.release();
            return skill;
        });
    }
    addExamSkill(skillDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.updateOrCreateExamSkill(skillDTO, null, connection);
            yield connection.release();
            return skill;
        });
    }
    addQuizToExam(examId, quizId, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const companyQuizs = yield companyQuizRepository.findByCompanyIdAndQuizId(companyId, quizId, connection);
            if (!companyQuizs) {
                yield connection.release();
                return null;
            }
            const examQuizs = yield examQuizRepository.findByExamId(examId, connection);
            const sameQuizs = examQuizs.filter(eQ => eQ.quiz_id === quizId);
            if (sameQuizs.length) {
                yield connection.release();
                return null;
            }
            yield connection.newTransaction();
            const exQuiz = yield this.updateOrCreateExamQuiz(examId, quizId, 1, null, connection);
            yield connection.commit();
            yield connection.release();
            return exQuiz;
        });
    }
    addQuizsToExam(examId, quizIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const exam = yield examRepository.findById(examId, connection);
            if (exam.status === 'CLOSED') {
                yield connection.release();
                return null;
            }
            const examQuizs = yield examQuizRepository.findByExamId(examId, connection);
            const examQuizsIds = examQuizs.map(eQ => eQ.quiz_id);
            quizIds = quizIds.filter(qId => !examQuizsIds.includes(qId));
            if (!quizIds.length) {
                yield connection.release();
                return null;
            }
            yield connection.newTransaction();
            if (exam.status === 'DRAFT') {
                exam.status = 'ACTIVE';
                const newExam = yield this.updateOrCreateExam(exam, examId, exam.author_user_id, connection);
            }
            const exQuiz = yield this.saveExamQuizs(quizIds, examId, connection);
            yield connection.commit();
            yield connection.release();
            return exQuiz;
        });
    }
    getExamQuizs(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const examQuizs = yield examQuizRepository.findByExamId(examId, connection);
            const quizIds = examQuizs.map(cQ => cQ.quiz_id);
            const quizs = yield quizRepository.findWhereIdIn(quizIds, connection);
            yield connection.release();
            return quizs;
        });
    }
    getExamUserReport(userId, examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const examUserQuizs = yield userQuizRepository.findByExamIdAndUserId(examId, userId, connection);
            const userQuizIds = examUserQuizs.map(eQ => eQ.id);
            const quizIds = examUserQuizs.map(eQ => eQ.quiz_id);
            const quizs = yield quizRepository.findWhereIdIn(quizIds, connection);
            const tests = yield testRepository.findByQuizIdIn(quizIds, connection);
            const testIds = tests.map(t => t.id);
            const options = yield testOptionRepository.findByTestIdsIn(testIds, connection);
            const userTests = yield userTestRepository.findByUserIdAndUserQuizIdIn(userId, userQuizIds, connection);
            let results = [];
            examUserQuizs.forEach(eQ => {
                let result = {};
                result['quiz'] = quizs.find(q => q.id === eQ.quiz_id) || null;
                result['userQuiz'] = eQ;
                result['tests'] = tests.filter(t => t.quiz_id === eQ.quiz_id).map(t => {
                    return {
                        test: t,
                        options: options.filter(opt => opt.test_id === t.id),
                        userTest: userTests.find(uT => uT.test_id === t.id) || null
                    };
                });
                results.push(result);
            });
            yield connection.release();
            return results;
        });
    }
    removeExamSkill(skillId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.deleteExamSkill(skillId, connection);
            yield connection.release();
            return skill;
        });
    }
    getExams(companyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const exams = yield examRepository.findByCompanyIdAndStatus(companyId, status, connection);
            yield connection.release();
            return exams;
        });
    }
    getExam(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const exam = yield examRepository.findById(examId, connection);
            const uApps = yield userApplicationRepository.findByExamId(examId, connection);
            const skills = yield examSkillRepository.findByExamId(examId, connection);
            const link = yield examLinkRepository.findByExamId(exam.id, connection);
            yield connection.release();
            return { exam, skills, link, uApps };
        });
    }
    getExamFromLink(linkUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const link = yield examLinkRepository.findByUUID(linkUUID, connection);
            let exam = yield examRepository.findById(link.exam_id, connection);
            const company = yield companyRepository.findById(exam.company_id, connection);
            exam['company_name'] = company.name;
            yield connection.release();
            return exam;
        });
    }
    getExamSkills(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skills = yield examSkillRepository.findByExamId(examId, connection);
            yield connection.release();
            return skills;
        });
    }
    getUsersDataOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield userDataOptionRepository.findAllActive(null, connection);
            yield connection.release();
            return data;
        });
    }
    setExamUserData(dataOptionIds, examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.saveExamUserData(dataOptionIds, examId, connection);
            yield connection.release();
            return data;
        });
    }
    getExamUserData(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield examUserDataRepository.findByExamId(examId, connection);
            yield connection.release();
            return data;
        });
    }
    addExamUserData(examId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.insertExamUserData(examId, optionId, connection);
            yield connection.release();
            return data;
        });
    }
    removeExamUserData(examId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.deleteExamUserData(examId, optionId, connection);
            yield connection.release();
            return data;
        });
    }
    removeExam(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uApps = yield userApplicationRepository.findByExamId(examId, connection);
            if (uApps && uApps.length) {
                yield connection.release();
                return null;
            }
            const data = yield this.deleteExam(examId, connection);
            yield connection.release();
            return data;
        });
    }
    removeExamQuiz(examId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.deleteExamQuiz(examId, quizId, connection);
            yield connection.release();
            return data;
        });
    }
    getUserData(userId, examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const options = yield userDataOptionRepository.findAllActive(null, connection);
            let userData = yield userDataRepository.findByUserIdAndExamId(userId, examId, connection);
            console.log(userData);
            const candidateData = userData.map(uO => {
                const opt = options.find(opt => opt.id === uO.user_data_option_id);
                return Object.assign(Object.assign({}, uO), { option_key: opt.option_key, type: opt.type });
            });
            yield connection.release();
            return candidateData;
        });
    }
    getExamUserApplicationsList(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uApps = yield userApplicationRepository.findByExamId(examId, connection);
            console.log('apps', uApps.length);
            if (!uApps || !uApps.length) {
                yield connection.release();
                return { columns: [], usersResults: [] };
            }
            const opts = yield userDataOptionRepository.findAllActive(null, connection);
            let examUserData = yield examUserDataRepository.findByExamId(examId, connection);
            const examQuizs = yield examQuizRepository.findByExamId(examId, connection);
            console.log('examQuizs', examQuizs.length);
            const userIds = uApps.map(app => app.user_id);
            console.log('userIds', userIds.length);
            const quizIds = examQuizs.map(jQ => jQ.quiz_id);
            console.log('quizIds', quizIds.length);
            const userData = yield userDataRepository.findByUserIdInAndExamId(userIds, examId, connection);
            const userQuizs = yield userQuizRepository.whereUserIdInAndQuizIdInAndExamId(userIds, quizIds, examId, connection);
            console.log('userQuizs', userQuizs.length);
            yield connection.release();
            examUserData = examUserData.filter(jO => !!opts.find(opt => opt.id === jO.option_id));
            const examUserDataColumns = examUserData.map(jO => {
                const opt = opts.find(opt => opt.id === jO.option_id);
                let position = 0;
                // if (opt.option_key === 'name') position = 2;
                // if (opt.option_key === 'lastname') position = 1;
                let jOC = { key: opt.option_key, label: null, type: 'options', position };
                return jOC;
            }).sort((a, b) => b.position - a.position);
            const examQuizsColumns = examQuizs.sort((a, b) => b.required - a.required).map(jQ => ({ key: 'quiz_' + jQ.quiz_id, label: jQ.topic, type: 'quizs' }));
            const otherColumns = [{ key: 'score', label: 'Score', type: 'general' }];
            const columns = [...otherColumns, ...examQuizsColumns, ...examUserDataColumns];
            const usersResults = uApps.map(app => {
                let userResult = { userId: app.user_id };
                examUserData.forEach(jO => {
                    const option = opts.find(opt => opt.id === jO.option_id);
                    const userDataOpt = userData.find(uO => uO.user_id === app.user_id && uO.user_data_option_id === jO.option_id);
                    if (userDataOpt) {
                        if (option.type === 'BOOLEAN')
                            userResult[option.option_key] = userDataOpt.number_value ? 'YES' : 'NO';
                        if (option.type !== 'BOOLEAN')
                            userResult[option.option_key] = userDataOpt.string_value || +userDataOpt.number_value || null;
                    }
                });
                userResult['score'] = 0;
                examQuizs.forEach(jQ => {
                    const userQuiz = userQuizs.find(uQ => uQ.user_id === app.user_id && uQ.quiz_id === jQ.quiz_id);
                    if (userQuiz) {
                        userResult['quiz_' + jQ.id] = userQuiz.score + ' - ' + (userQuiz.rate * 100).toFixed(0) + '%';
                        userResult['score'] = userResult['score'] + userQuiz.score;
                    }
                });
                return userResult;
            });
            return { columns, usersResults };
        });
    }
    updateOrCreateExamQuiz(examId, quizId, required, exQuizId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exQuiz = exQuizId ? yield examQuizRepository.findById(exQuizId, connection) : new ExamQuiz_1.ExamQuiz();
                exQuiz.quiz_id = exQuizId ? exQuiz.quiz_id : quizId;
                exQuiz.exam_id = exQuizId ? exQuiz.exam_id : examId;
                exQuiz.position_order = 0;
                exQuiz.required = +required || 1;
                const coInserted = exQuizId ? yield examQuizRepository.update(exQuiz, connection) : yield examQuizRepository.save(exQuiz, connection);
                exQuiz.id = exQuizId ? exQuiz.id : coInserted.insertId;
                return exQuiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Exam Quiz", 500, null, e);
            }
        });
    }
    updateOrCreateExam(exDTO, examID = null, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEx = examID ? yield examRepository.findById(examID, connection) : new Exam_1.Exam();
                newEx.author_user_id = examID ? newEx.author_user_id : loggedUserId;
                newEx.status = exDTO.status || newEx.status || "DRAFT";
                newEx.description = exDTO.description || newEx.description;
                newEx.company_id = exDTO.company_id || newEx.company_id;
                newEx.role = exDTO.role || newEx.role;
                const coInserted = examID ? yield examRepository.update(newEx, connection) : yield examRepository.save(newEx, connection);
                newEx.id = examID ? newEx.id : coInserted.insertId;
                !examID && LOG.info("NEW EXAM", newEx.id);
                return newEx;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Exam", 500, null, e);
            }
        });
    }
    saveExamQuizs(quizIds, examId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ["exam_id", "quiz_id", "required", "position_order"];
                const values = quizIds.map(quizId => {
                    let newExamQuiz = {
                        exam_id: examId,
                        quiz_id: quizId,
                        required: 1,
                        position_order: 0
                    };
                    return Object.values(newExamQuiz); // [1,'React',1]
                });
                const skillsInserted = yield examQuizRepository.saveMultiple(keys, values, connection);
                return skillsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Multiple Exam Quizs", 500, null, e);
            }
        });
    }
    saveExamSkills(examSkills, examId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ["exam_id", "text", "required"];
                const values = examSkills.map(skill => {
                    let newSkill = {
                        job_offer_id: examId,
                        text: skill.text,
                        required: skill.required
                    };
                    return Object.values(newSkill); // [1,'React',1]
                });
                const skillsInserted = yield examSkillRepository.saveMultiple(keys, values, connection);
                return skillsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Exam Skills", 500, null, e);
            }
        });
    }
    updateOrCreateExamSkill(skillDTO, skillId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const skill = skillId ? yield examSkillRepository.findById(skillId, connection) : new ExamSkill_1.ExamSkill();
                skill.exam_id = skillDTO.exam_id || skill.exam_id;
                skill.text = skillDTO.text || skill.text;
                skill.required = skillDTO.required >= 0 ? 1 : (skill.required || 0);
                skillId ? yield examSkillRepository.update(skill, connection) : yield examSkillRepository.save(skill, connection);
                yield connection.commit();
                return skill;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Exam Skill", 500, null, e);
            }
        });
    }
    deleteExamSkill(skillId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const skill = yield examSkillRepository.findById(skillId, connection);
            if (!skill)
                return skill;
            yield connection.newTransaction();
            try {
                yield examSkillRepository.delete(skill, connection);
                yield connection.commit();
                return skill;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Exam Skill", 500, null, e);
            }
        });
    }
    saveExamUserData(dataOptionIds, examID, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const keys = ['exam_id', 'option_id'];
                const values = dataOptionIds.map(optionId => [examID, optionId]);
                const otionsInserted = yield examUserDataRepository.saveMultiple(keys, values, connection);
                yield connection.commit();
                return otionsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Exam UserData", 500, null, e);
            }
        });
    }
    insertExamUserData(exam_id, optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const data = new ExamUserData_1.ExamUserData();
                data.exam_id = exam_id;
                data.option_id = optionId;
                yield examUserDataRepository.save(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Add Exam UserData", 500, null, e);
            }
        });
    }
    saveNewExamLink(examId, companyId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eLink = new ExamLink_1.ExamLink();
                eLink.exam_id = examId;
                eLink.company_id = companyId;
                eLink.uuid = shortid.generate();
                const linkInserted = yield examLinkRepository.save(eLink, connection);
                eLink.id = linkInserted.insertId;
                return eLink;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Add Exam Link", 500, null, e);
            }
        });
    }
    deleteExamUserData(examId, optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield examUserDataRepository.findByExamIdAndOptionId(examId, optionId, connection);
            if (!data)
                return data;
            yield connection.newTransaction();
            try {
                yield examUserDataRepository.delete(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Exam UserData", 500, null, e);
            }
        });
    }
    deleteExam(examId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield examRepository.findById(examId, connection);
            if (!data)
                return data;
            yield connection.newTransaction();
            try {
                yield examRepository.delete(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Exam UserData", 500, null, e);
            }
        });
    }
    deleteExamQuiz(examId, quizId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield examQuizRepository.findByExamIdAndQuizId(examId, quizId, connection);
            if (!data)
                return data;
            yield connection.newTransaction();
            try {
                yield examQuizRepository.delete(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Exam Quiz", 500, null, e);
            }
        });
    }
}
exports.ExamService = ExamService;
//# sourceMappingURL=ExamService.js.map