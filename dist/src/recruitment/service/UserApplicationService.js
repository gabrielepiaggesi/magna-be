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
const UserApplication_1 = require("../model/UserApplication");
const UserQuiz_1 = require("../model/UserQuiz");
const UserTest_1 = require("../model/UserTest");
const JobOfferSkillRepository_1 = require("../repository/JobOfferSkillRepository");
const QuizRepository_1 = require("../repository/QuizRepository");
const TestOptionRepository_1 = require("../repository/TestOptionRepository");
const TestRepository_1 = require("../repository/TestRepository");
const UserApplicationRepository_1 = require("../repository/UserApplicationRepository");
const UserDataOptionRepository_1 = require("../repository/UserDataOptionRepository");
const UserDataRepository_1 = require("../repository/UserDataRepository");
const UserQuizRepository_1 = require("../repository/UserQuizRepository");
const UserSkillRepository_1 = require("../repository/UserSkillRepository");
const UserTestRepository_1 = require("../repository/UserTestRepository");
const JobOfferRepository_1 = require("../repository/JobOfferRepository");
const MediaService_1 = require("../../media/services/MediaService");
const UserTestImage_1 = require("../model/UserTestImage");
const UserTestImageRepository_1 = require("../repository/UserTestImageRepository");
const Preconditions_1 = require("../../utils/Preconditions");
const LOG = new Logger_1.Logger("UserApplicationService.class");
const db = require("../../connection");
const userApplicationRepository = new UserApplicationRepository_1.UserApplicationRepository();
const userDataRepository = new UserDataRepository_1.UserDataRepository();
const userSkillRepository = new UserSkillRepository_1.UserSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository_1.UserDataOptionRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository_1.JobOfferSkillRepository();
const userQuizRepository = new UserQuizRepository_1.UserQuizRepository();
const userTestRepository = new UserTestRepository_1.UserTestRepository();
const testRepository = new TestRepository_1.TestRepository();
const testOptionRepository = new TestOptionRepository_1.TestOptionRepository();
const quizRepository = new QuizRepository_1.QuizRepository();
const jobOfferRepository = new JobOfferRepository_1.JobOfferRepository();
const mediaService = new MediaService_1.MediaService();
const userTestImageRepository = new UserTestImageRepository_1.UserTestImageRepository();
class UserApplicationService {
    createUserApplication(dto, files, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const job = yield jobOfferRepository.findById(dto.uApp.job_offer_id, connection);
            yield Preconditions_1.Precondition.checkIfTrue((!!job), "Job does not exists", connection);
            dto.uApp.company_id = dto.uApp.company_id || job.company_id;
            yield connection.newTransaction();
            const uApp = yield this.saveUserApplication(dto.uApp, loggedUserId, connection);
            dto.uData = dto.uData && dto.uData.length ? dto.uData : [];
            console.log(files);
            if (files.length) {
                const options = yield userDataOptionRepository.findAllActive(null, connection);
                for (const file of files) {
                    const opt = options.find(opt => opt.option_key === file['fieldname']);
                    if (opt) {
                        const optionData = yield this.uploadFileOption(uApp, file, opt, connection);
                        dto.uData.push(optionData);
                        console.log(optionData);
                    }
                }
            }
            const uData = yield this.saveUserData(dto.uData, loggedUserId, connection);
            const uSkills = yield this.saveUserSkills(dto.uSkills, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return { uApp, uData, uSkills };
        });
    }
    uploadUserTestImage(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let media = yield mediaService.uploadFile({ file: dto.file, user_id: loggedUserId }, connection);
                const uImg = new UserTestImage_1.UserTestImage();
                uImg.job_offer_id = dto.job_offer_id;
                uImg.user_id = loggedUserId;
                uImg.image_url = media.url;
                uImg.media_id = media.id;
                const imgInsert = yield userTestImageRepository.save(uImg, connection);
                uImg.id = imgInsert.insertId;
                yield connection.commit();
                yield connection.release();
                return uImg;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save Test Image", 500, null, e);
            }
        });
    }
    getUserTestsImages(userId, jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const images = yield userTestImageRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
            yield connection.release();
            return images;
        });
    }
    getUserApplication(userId, jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uApp = yield userApplicationRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
            const dataOptions = yield userDataOptionRepository.findAllActive(null, connection);
            const userData = yield userDataRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
            const jobOfferSkills = yield jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
            const userSkills = yield userSkillRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
            yield connection.release();
            return { uApp, dataOptions, userData, jobOfferSkills, userSkills };
        });
    }
    createUserQuiz(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uQuiz = yield this.saveUserQuiz(dto, loggedUserId, connection);
            yield connection.release();
            return uQuiz;
        });
    }
    createUserTest(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uQuiz = yield this.updateOrCreateUserTest(dto, null, loggedUserId, connection);
            yield connection.release();
            return uQuiz;
        });
    }
    createUserTests(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            let userQuiz = yield userQuizRepository.findByQuizIdAndJobOfferIdAndUserId(dto.quizId, dto.jobOfferId, loggedUserId, connection);
            const options = yield testOptionRepository.findByIdsIn(dto.tests.filter(opt => !!opt.option_id).map(opt => opt.option_id), connection);
            yield connection.newTransaction();
            const userTestDTOS = dto.tests.map(test => {
                const uTest = {
                    answer: test.answer,
                    media_id: test.media_id,
                    option_id: test.option_id,
                    score: test.option_id ? options.find(opt => opt.id === test.option_id).points : 0,
                    test_id: test.test_id,
                    user_id: loggedUserId,
                    user_quiz_id: userQuiz.id
                };
                return uTest;
            });
            const uTests = yield this.saveUserTests(userTestDTOS, connection);
            yield connection.commit();
            yield connection.release();
            userQuiz = yield this.confirmAndSendUserQuiz(userQuiz.id, loggedUserId);
            return { userQuiz, uTests };
        });
    }
    updateUserTest(dto, userTestId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uQuiz = yield this.updateOrCreateUserTest(dto, userTestId, loggedUserId, connection);
            yield connection.release();
            return uQuiz;
        });
    }
    confirmAndSendUserQuiz(userQuizId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            let uQuiz = yield userQuizRepository.findById(userQuizId, connection);
            const quiz = yield quizRepository.findById(uQuiz.quiz_id, connection);
            const uTests = yield userTestRepository.findByUserIdAndUserQuizId(loggedUserId, uQuiz.id, connection);
            const testsGiven = uTests.length;
            const testsRight = uTests.filter((t) => t.score > 0).length;
            const uQuizScore = uTests.reduce((accumulator, uTest) => accumulator + uTest.score, 0);
            const uQuizRate = uQuizScore / quiz.tests_points;
            uQuiz = yield this.saveUserQuizResult(uQuiz.id, uQuizScore, uQuizRate, testsGiven, testsRight, connection);
            yield connection.release();
            return uQuiz;
        });
    }
    getUserQuiz(quizId, jobOfferId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            let uQuiz = yield userQuizRepository.findByQuizIdAndJobOfferIdAndUserId(quizId, jobOfferId, loggedUserId, connection);
            yield connection.release();
            return uQuiz;
        });
    }
    uploadFileOption(uApp, file, opt, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let media = yield mediaService.uploadFile({ file, user_id: uApp.user_id }, connection);
                return {
                    job_offer_id: uApp.job_offer_id,
                    user_data_option_id: opt.id,
                    string_value: media.url,
                    media_id: media.id
                };
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save uploadFileOption", 500, null, e);
            }
        });
    }
    saveUserApplication(dto, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uApp = new UserApplication_1.UserApplication();
                uApp.company_id = dto.company_id;
                uApp.user_id = loggedUserId;
                uApp.job_offer_id = dto.job_offer_id;
                uApp.status = "NEW";
                uApp.note = dto.note;
                yield userApplicationRepository.save(uApp, connection);
                return uApp;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save Test Image", 500, null, e);
            }
        });
    }
    saveUserData(uData, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['user_id', 'job_offer_id', 'user_data_option_id', 'number_value', 'string_value', 'media_id'];
                const values = uData.map(data => [loggedUserId, data.job_offer_id, data.user_data_option_id, data.number_value, data.string_value, data.media_id]);
                const otionsInserted = yield userDataRepository.saveMultiple(keys, values, connection);
                return otionsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create JobOffer UserData", 500, null, e);
            }
        });
    }
    saveUserTests(uData, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['user_id', 'test_id', 'user_quiz_id', 'option_id', 'answer', 'score', 'media_id'];
                const values = uData.map(data => [data.user_id, data.test_id, data.user_quiz_id, data.option_id, data.answer, data.score, data.media_id]);
                const otionsInserted = yield userTestRepository.saveMultiple(keys, values, connection);
                return otionsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create saveUserTests", 500, null, e);
            }
        });
    }
    saveUserSkills(uSkills, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['user_id', 'job_offer_skill_id', 'job_offer_id', 'confidence_level', 'years'];
                const values = uSkills.map(data => [loggedUserId, data.job_offer_skill_id, data.job_offer_id, data.confidence_level, data.years]);
                const otionsInserted = yield userSkillRepository.saveMultiple(keys, values, connection);
                return otionsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create JobOffer UserData", 500, null, e);
            }
        });
    }
    saveUserQuiz(dto, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const uQuiz = new UserQuiz_1.UserQuiz();
                uQuiz.user_id = loggedUserId;
                uQuiz.status = "NEW";
                uQuiz.quiz_id = dto.quiz_id;
                uQuiz.job_offer_id = dto.job_offer_id;
                uQuiz.score = 0;
                uQuiz.rate = 0;
                uQuiz.tests_given = 0;
                uQuiz.tests_right = 0;
                const coInserted = yield userQuizRepository.save(uQuiz, connection);
                yield connection.commit();
                LOG.info("NEW USER QUIZ", coInserted.insertId);
                return uQuiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save User Quiz", 500, null, e);
            }
        });
    }
    updateOrCreateUserTest(dto, userTestId = null, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield testRepository.findById(dto.test_id, connection);
            const correctOption = yield testOptionRepository.findCorrectOptionByTestId(dto.test_id, connection);
            if (!correctOption)
                throw new IndroError_1.IndroError("Test Settings Invalid, correct option does not exist", 500);
            const testType = test.type;
            yield connection.newTransaction();
            try {
                const uTest = userTestId ? yield userTestRepository.findById(userTestId, connection) : new UserTest_1.UserTest();
                uTest.user_id = userTestId ? uTest.user_id : loggedUserId;
                uTest.test_id = userTestId ? uTest.test_id : dto.test_id;
                uTest.user_quiz_id = userTestId ? uTest.user_quiz_id : dto.user_quiz_id;
                uTest.option_id = dto.option_id || uTest.option_id;
                uTest.answer = dto.answer || uTest.answer;
                uTest.score = testType === "MULTIPLE" ? (correctOption.id === dto.option_id ? test.points : 0) : 0;
                uTest.media_id = dto.media_id || uTest.media_id;
                const coInserted = userTestId ? yield userTestRepository.update(uTest, connection) : yield userTestRepository.save(uTest, connection);
                uTest.id = userTestId ? uTest.id : coInserted.insertId;
                yield connection.commit();
                !userTestId && LOG.info("NEW USER TEST", uTest.id);
                return uTest;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create User Test", 500, null, e);
            }
        });
    }
    saveUserQuizResult(uQuizId, score, rate, tests_given, tests_right, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const uQuiz = yield userQuizRepository.findById(uQuizId, connection);
                uQuiz.status = rate > 0.5 ? "PASSED" : "FAILED";
                uQuiz.rate = rate;
                uQuiz.score = score;
                uQuiz.tests_given = tests_given;
                uQuiz.tests_right = tests_right;
                yield userQuizRepository.update(uQuiz, connection);
                yield connection.commit();
                return uQuiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save User Quiz Result", 500, null, e);
            }
        });
    }
}
exports.UserApplicationService = UserApplicationService;
//# sourceMappingURL=UserApplicationService.js.map