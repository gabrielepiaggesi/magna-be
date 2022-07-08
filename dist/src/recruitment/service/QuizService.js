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
const CompanyQuiz_1 = require("../model/CompanyQuiz");
const JobOfferQuiz_1 = require("../model/JobOfferQuiz");
const Quiz_1 = require("../model/Quiz");
const Test_1 = require("../model/Test");
const TestImage_1 = require("../model/TestImage");
const CompanyQuizRepository_1 = require("../repository/CompanyQuizRepository");
const JobOfferQuizRepository_1 = require("../repository/JobOfferQuizRepository");
const QuizRepository_1 = require("../repository/QuizRepository");
const TestImageRepository_1 = require("../repository/TestImageRepository");
const TestOptionRepository_1 = require("../repository/TestOptionRepository");
const TestRepository_1 = require("../repository/TestRepository");
const TestTextRepository_1 = require("../repository/TestTextRepository");
const UserTestRepository_1 = require("../repository/UserTestRepository");
const LOG = new Logger_1.Logger("QuizService.class");
const db = require("../../connection");
const quizRepository = new QuizRepository_1.QuizRepository();
const jobOfferQuizRepository = new JobOfferQuizRepository_1.JobOfferQuizRepository();
const testRepository = new TestRepository_1.TestRepository();
const testOptionRepository = new TestOptionRepository_1.TestOptionRepository();
const testTextRepository = new TestTextRepository_1.TestTextRepository();
const testImageRepository = new TestImageRepository_1.TestImageRepository();
const companyQuizRepository = new CompanyQuizRepository_1.CompanyQuizRepository();
const userTestRepository = new UserTestRepository_1.UserTestRepository();
class QuizService {
    createQuiz(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const quiz = yield this.updateOrCreateQuiz(dto, null, loggedUserId, connection);
            const jobOfferQuiz = yield this.updateOrCreateJobOfferQuiz(dto, quiz.id, null, connection);
            const companyQuiz = yield this.createCompanyQuiz(quiz.id, dto.company_id, connection);
            yield connection.commit();
            yield connection.release();
            return { quiz, jobOfferQuiz, companyQuiz };
        });
    }
    updateQuiz(dto, jQuizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction(); // update jobn offer quiz!
            const quiz = yield this.updateOrCreateQuiz(dto, dto.quiz_id, null, connection);
            const jobOfferQuiz = yield this.updateOrCreateJobOfferQuiz(dto, quiz.id, jQuizId, connection);
            yield connection.commit();
            yield connection.release();
            return { quiz, jobOfferQuiz };
        });
    }
    createTest(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const test = yield this.updateOrCreateTest(dto.test, null, connection);
            const options = dto.options.length ? yield this.saveTestOptions(dto.options, test.id, connection) : [];
            const texts = dto.texts.length ? yield this.saveTestTexts(dto.texts, test.id, connection) : [];
            const files = dto.files.length ? this.uploadTestImages(dto.files, test.id) : [];
            const images = files.length ? yield this.saveTestImages(files, test.id, connection) : [];
            yield connection.commit();
            yield connection.release();
            return { test, options, texts, images };
        });
    }
    updateTest(dto, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const test = yield this.updateOrCreateTest(dto, testId, connection);
            if (dto.new_right_option != dto.old_right_option &&
                dto.new_right_option > 0 && dto.old_right_option > 0) {
                const oldRightOption = yield testOptionRepository.findById(dto.old_right_option, connection);
                const newRightOption = yield testOptionRepository.findById(dto.new_right_option, connection);
                const oldDto = Object.assign({}, oldRightOption);
                delete oldDto.is_correct;
                delete oldDto.points;
                oldDto.is_correct = 0;
                oldDto.points = 0;
                const newDto = Object.assign({}, newRightOption);
                delete newDto.is_correct;
                delete newDto.points;
                newDto.is_correct = 1;
                newDto.points = test.points;
                const opt1 = yield this.updateTestOption(oldDto, oldRightOption.id, connection);
                const opt2 = yield this.updateTestOption(newDto, newRightOption.id, connection);
            }
            yield connection.commit();
            yield connection.release();
            return test;
        });
    }
    editTestOption(dto, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const opt = yield this.updateTestOption(dto, optionId, connection);
            yield connection.commit();
            yield connection.release();
            return opt;
        });
    }
    removeTestOption(optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const opt = yield this.deleteTestOption(optionId, connection);
            yield connection.commit();
            yield connection.release();
            return opt;
        });
    }
    editTestText(dto, textId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const text = yield this.updateTestText(dto, textId, connection);
            yield connection.commit();
            yield connection.release();
            return text;
        });
    }
    removeTestText(textId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const text = yield this.deleteTestText(textId, connection);
            yield connection.commit();
            yield connection.release();
            return text;
        });
    }
    createNewTestImage(dto, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const image = this.transformTestImageToUploadImage(dto, testId);
            const img = yield this.saveNewTestImage(image, testId, connection);
            yield connection.commit();
            yield connection.release();
            return img;
        });
    }
    createNewTestOption(dto, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const img = yield this.saveTestOptions([dto], testId, connection);
            yield connection.commit();
            yield connection.release();
            return img;
        });
    }
    createNewTestText(dto, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const img = yield this.saveTestTexts([dto], testId, connection);
            yield connection.commit();
            yield connection.release();
            return img;
        });
    }
    removeTestImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const img = yield this.deleteTestImage(imageId, connection);
            yield connection.commit();
            yield connection.release();
            return img;
        });
    }
    getTest(testId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const test = yield testRepository.findById(testId, connection);
            const options = yield testOptionRepository.findByTestId(testId, connection);
            const texts = yield testTextRepository.findByTestId(testId, connection);
            const images = yield testImageRepository.findByTestId(testId, connection);
            const uTest = yield userTestRepository.findByUserIdAndTestId(loggedUserId, testId, connection);
            yield connection.release();
            return { test, options, texts, images, uTest };
        });
    }
    getQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const jQuiz = yield jobOfferQuizRepository.findById(quizId, connection);
            const quiz = yield quizRepository.findById(jQuiz.quiz_id, connection);
            const tests = yield testRepository.findByQuizId(quizId, connection);
            yield connection.release();
            return { jQuiz, quiz, tests };
        });
    }
    getJobOfferQuizs(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const quizs = yield jobOfferQuizRepository.findByJobOfferId(jobOfferId, connection);
            yield connection.release();
            return quizs;
        });
    }
    updateOrCreateQuiz(dto, quizId = null, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quiz = quizId ? yield quizRepository.findById(quizId, connection) : new Quiz_1.Quiz();
                quiz.author_user_id = quizId ? quiz.author_user_id : loggedUserId;
                quiz.minutes = dto.minutes || quiz.minutes;
                quiz.check_camera = dto.check_camera >= 0 ? dto.check_camera : quiz.check_camera;
                ;
                quiz.check_mic = dto.check_mic >= 0 ? dto.check_mic : quiz.check_mic;
                quiz.topic = dto.topic || quiz.topic;
                quiz.category = dto.category || quiz.category;
                quiz.difficulty_level = dto.difficulty_level || quiz.difficulty_level;
                quiz.public = dto.public >= 0 ? dto.public : quiz.public;
                quiz.tests_amount = dto.tests_amount >= 0 ? dto.tests_amount : quiz.tests_amount;
                quiz.tests_points = dto.tests_points >= 0 ? dto.tests_points : quiz.tests_points;
                const coInserted = quizId ? yield quizRepository.update(quiz, connection) : yield quizRepository.save(quiz, connection);
                quiz.id = quizId ? quiz.id : coInserted.insertId;
                !quizId && LOG.info("NEW QUIZ", quiz.id);
                return quiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Quiz", 500, null, e);
            }
        });
    }
    updateOrCreateJobOfferQuiz(dto, quizId, jQuizId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jQuiz = jQuizId ? yield jobOfferQuizRepository.findById(jQuizId, connection) : new JobOfferQuiz_1.JobOfferQuiz();
                jQuiz.quiz_id = jQuizId ? jQuiz.quiz_id : quizId;
                jQuiz.job_offer_id = jQuizId ? jQuiz.job_offer_id : dto.job_offer_id;
                jQuiz.position_order = dto.position_order >= 0 ? dto.position_order : jQuiz.position_order;
                jQuiz.required = +dto.required;
                const coInserted = jQuizId ? yield jobOfferQuizRepository.update(jQuiz, connection) : yield jobOfferQuizRepository.save(jQuiz, connection);
                jQuiz.id = jQuizId ? jQuiz.id : coInserted.insertId;
                return jQuiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update JobOffer Quiz", 500, null, e);
            }
        });
    }
    updateOrCreateTest(dto, testId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const test = testId ? yield testRepository.findById(testId, connection) : new Test_1.Test();
                test.quiz_id = testId ? test.quiz_id : dto.quiz_id;
                test.question = dto.question || test.question;
                test.minutes = dto.minutes || test.minutes;
                test.type = dto.type || test.type;
                test.points = dto.points >= 0 ? dto.points : test.points;
                test.position_order = dto.position_order || test.position_order;
                test.difficulty_level = dto.difficulty_level || test.difficulty_level;
                const coInserted = testId ? yield testRepository.update(test, connection) : yield testRepository.save(test, connection);
                test.id = testId ? test.id : coInserted.insertId;
                !testId && LOG.info("NEW TEST", test.id);
                return test;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Test", 500, null, e);
            }
        });
    }
    saveTestOptions(options, testId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['test_id', 'option_text', 'is_correct', 'points', 'position_order'];
                const values = options.map(option => [testId, option.option_text, option.is_correct, option.points, option.position_order]);
                const otionsInserted = yield testOptionRepository.saveMultiple(keys, values, connection);
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
    saveTestTexts(options, testId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['test_id', 'text', 'position_order'];
                const values = options.map(option => [testId, option.text, option.position_order]);
                const otionsInserted = yield testTextRepository.saveMultiple(keys, values, connection);
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
    uploadTestImages(files, testId) {
        return files.map(this.transformTestImageToUploadImage); // TODO REAL UPLOAD
    }
    transformTestImageToUploadImage(file, testId) {
        return {
            image_url: '',
            position_order: file.position_order,
            media_id: 0
        };
    }
    saveTestImages(options, testId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = ['test_id', 'media_id', 'image_url', 'position_order'];
                const values = options.map(option => [testId, option.media_id, option.image_url, option.position_order]);
                const otionsInserted = yield testImageRepository.saveMultiple(keys, values, connection);
                return otionsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Test Images", 500, null, e);
            }
        });
    }
    updateTestOption(dto, optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const opt = yield testOptionRepository.findById(optionId, connection);
                opt.option_text = dto.option_text || opt.option_text;
                opt.is_correct = dto.is_correct >= 0 ? dto.is_correct : opt.is_correct;
                opt.points = dto.points >= 0 ? dto.points : opt.points;
                opt.position_order = dto.position_order || opt.position_order;
                yield testOptionRepository.update(opt, connection);
                return opt;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Test Option", 500, null, e);
            }
        });
    }
    deleteTestOption(optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const opt = yield testOptionRepository.findById(optionId, connection);
                yield testOptionRepository.delete(opt, connection);
                return opt;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Test Option", 500, null, e);
            }
        });
    }
    updateTestText(dto, textId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const text = yield testTextRepository.findById(textId, connection);
                text.text = dto.text || text.text;
                text.position_order = dto.position_order || text.position_order;
                yield testTextRepository.update(text, connection);
                return text;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Test Text", 500, null, e);
            }
        });
    }
    deleteTestText(textId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const text = yield testTextRepository.findById(textId, connection);
                yield testTextRepository.delete(text, connection);
                return text;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Test Text", 500, null, e);
            }
        });
    }
    saveNewTestImage(dto, testId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const img = new TestImage_1.TestImage();
                img.media_id = dto.media_id;
                img.image_url = dto.image_url;
                img.position_order = dto.position_order;
                yield testImageRepository.save(img, connection);
                return img;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Save Test Image", 500, null, e);
            }
        });
    }
    deleteTestImage(imageId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const img = yield testImageRepository.findById(imageId, connection);
                yield testImageRepository.delete(img, connection);
                return img;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Test Image", 500, null, e);
            }
        });
    }
    createCompanyQuiz(quizId, companyId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cQuiz = new CompanyQuiz_1.CompanyQuiz();
                cQuiz.quiz_id = quizId;
                cQuiz.company_id = companyId;
                yield companyQuizRepository.save(cQuiz, connection);
                return cQuiz;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Company Quiz", 500, null, e);
            }
        });
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=QuizService.js.map