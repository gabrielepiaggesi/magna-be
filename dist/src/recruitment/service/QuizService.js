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
const UserQuizRepository_1 = require("../repository/UserQuizRepository");
const MediaService_1 = require("../../media/services/MediaService");
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
const userQuizRepository = new UserQuizRepository_1.UserQuizRepository();
const mediaService = new MediaService_1.MediaService();
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
            yield connection.newTransaction();
            const quiz = yield this.updateOrCreateQuiz(dto, dto.quiz_id, null, connection);
            const jobOfferQuiz = yield this.updateOrCreateJobOfferQuiz(dto, quiz.id, jQuizId, connection);
            yield connection.commit();
            yield connection.release();
            return { quiz, jobOfferQuiz };
        });
    }
    createTest(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dto);
            const connection = yield db.connection();
            yield connection.newTransaction();
            const test = yield this.updateOrCreateTest(dto.test, null, connection);
            const options = dto.options.length ? yield this.saveTestOptions(dto.options, test.id, connection) : [];
            const texts = dto.texts.length ? yield this.saveTestTexts(dto.texts, test.id, connection) : [];
            const image = dto.file ? yield this.saveTestImages(dto.file, test.id, loggedUserId, connection) : null;
            yield connection.commit();
            yield connection.release();
            yield this.resetQuizTestsPoints(test.quiz_id);
            return { test, options, texts, image };
        });
    }
    updateTest(dto, testId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(dto);
            const connection = yield db.connection();
            const oldTest = yield testRepository.findById(testId, connection);
            yield connection.newTransaction();
            const test = yield this.updateOrCreateTest(dto.test, testId, connection);
            if (dto.test.new_right_option != dto.test.old_right_option &&
                dto.test.new_right_option > 0 && dto.test.old_right_option > 0) {
                const oldRightOption = yield testOptionRepository.findById(dto.test.old_right_option, connection);
                const newRightOption = yield testOptionRepository.findById(dto.test.new_right_option, connection);
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
            if (oldTest.points != test.points)
                yield this.resetQuizTestsPoints(test.quiz_id);
            if (dto.file && dto.file !== 'cancel') {
                const img = yield this.createNewTestImage(dto.file, testId, loggedUserId);
                test['image_url'] = img.image_url;
            }
            if (dto.file && dto.file === 'cancel') {
                yield this.removeTestImage(testId);
            }
            return test;
        });
    }
    resetQuizTestsPoints(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            let quiz = yield quizRepository.findById(quizId, connection);
            const quizTests = yield testRepository.findByQuizId(quizId, connection);
            const totalScore = quizTests.filter(qT => qT.type === 'MULTIPLE').reduce((acc, elem) => acc + elem.points, 0);
            yield connection.newTransaction();
            quiz = yield this.updateOrCreateQuiz(Object.assign(Object.assign({}, quiz), { tests_points: totalScore, tests_amount: quizTests.length }), quiz.id, null, connection);
            yield connection.commit();
            yield connection.release();
            return quiz;
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
    removeTest(testId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const test = yield this.deleteTest(testId, connection);
            yield connection.commit();
            yield connection.release();
            yield this.resetQuizTestsPoints(quizId);
            return test;
        });
    }
    removeQuiz(quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const quiz = yield this.deleteQuiz(quizId, connection);
            yield connection.commit();
            yield connection.release();
            return quiz;
        });
    }
    createNewTestImage(newFile, testId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(newFile);
            const connection = yield db.connection();
            const images = yield testImageRepository.findByTestId(testId, connection);
            yield connection.newTransaction();
            if (images.length) {
                const img = yield this.deleteTestImage(images[0].id, connection);
            }
            const img = yield this.saveNewTestImage(newFile, testId, loggedUserId, connection);
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
    removeTestImage(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const images = yield testImageRepository.findByTestId(testId, connection);
            if (!images.length) {
                yield connection.release();
                return;
            }
            yield connection.newTransaction();
            const img = yield this.deleteTestImage(images[0].id, connection);
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
    getQuiz(quizId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const jQuiz = yield jobOfferQuizRepository.findById(quizId, connection);
            const quiz = yield quizRepository.findById(jQuiz.quiz_id, connection);
            const uQuiz = yield userQuizRepository.findByQuizIdAndJobOfferIdAndUserId(jQuiz.quiz_id, jQuiz.job_offer_id, loggedUserId, connection);
            const tests = yield testRepository.findByQuizId(quizId, connection);
            const testsIds = tests.map(t => t.id);
            const opts = testsIds.length ? yield testOptionRepository.findByTestIdsIn(testsIds, connection) : [];
            const texts = testsIds.length ? yield testTextRepository.findByTestIdsIn(testsIds, connection) : [];
            const imgs = testsIds.length ? yield testImageRepository.findByTestIdsIn(testsIds, connection) : [];
            yield connection.release();
            const newTests = tests.map(test => {
                return Object.assign(Object.assign({}, test), { options: [...opts].filter(opt => opt.test_id == test.id), texts: [...texts].filter(opt => opt.test_id == test.id), images: [...imgs].filter(opt => opt.test_id == test.id) });
            });
            return { jQuiz, quiz, uQuiz, tests: newTests };
        });
    }
    getJobOfferQuizs(jobOfferId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const quizs = yield jobOfferQuizRepository.findByJobOfferId(jobOfferId, connection);
            const uQuizs = yield userQuizRepository.findByJobOfferIdAndUserId(jobOfferId, loggedUserId, connection);
            yield connection.release();
            return { quizs, uQuizs };
        });
    }
    updateOrCreateQuiz(dto, quizId = null, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const quiz = quizId ? yield quizRepository.findById(quizId, connection) : new Quiz_1.Quiz();
                quiz.author_user_id = quizId ? quiz.author_user_id : loggedUserId;
                quiz.minutes = +dto.minutes || quiz.minutes;
                quiz.check_camera = +dto.check_camera >= 0 ? dto.check_camera : quiz.check_camera;
                ;
                quiz.check_mic = +dto.check_mic >= 0 ? dto.check_mic : quiz.check_mic;
                quiz.topic = dto.topic || quiz.topic;
                quiz.category = dto.category || quiz.category;
                quiz.difficulty_level = +dto.difficulty_level || quiz.difficulty_level;
                quiz.public = +dto.public >= 0 ? (dto.public === 0 ? 1 : 0) : quiz.public;
                quiz.tests_amount = +dto.tests_amount >= 0 ? dto.tests_amount : quiz.tests_amount;
                quiz.tests_points = +dto.tests_points >= 0 ? dto.tests_points : quiz.tests_points;
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
    saveTestImages(file, testId, loggedId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let media = yield mediaService.uploadFile({ file, user_id: loggedId }, connection);
                const keys = ['test_id', 'media_id', 'image_url', 'position_order'];
                const values = [file].map(option => [testId, media.id, media.url, (option.position_order || 0)]);
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
    deleteTest(testId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const test = yield testRepository.deleteById(testId, connection);
                return test;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Test", 500, null, e);
            }
        });
    }
    deleteQuiz(quizId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = yield quizRepository.deleteById(quizId, connection);
                return q;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Quiz", 500, null, e);
            }
        });
    }
    saveNewTestImage(file, testId, loggedId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let media = yield mediaService.uploadFile({ file, user_id: loggedId }, connection);
                const img = new TestImage_1.TestImage();
                img.media_id = media.id;
                img.image_url = media.url;
                img.position_order = 0;
                img.test_id = testId;
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