import { Logger } from "../../framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { QuizApi } from "../integration/QuizApi";
import { QuizDTO } from "../type/QuizDTO";
import { TestDTO } from "../type/TestDTO";
import { TestImageDTO } from "../type/TestImageDTO";
import { TestImageUploadedDTO } from "../type/TestImageUploadedDTO";
import { TestOptionDTO } from "../type/TestOptionDTO";
import { TestTextDTO } from "../type/TestTextDTO";
import { CompanyQuiz } from "../model/CompanyQuiz";
import { JobOfferQuiz } from "../model/JobOfferQuiz";
import { Quiz } from "../model/Quiz";
import { Test } from "../model/Test";
import { TestImage } from "../model/TestImage";
import { CompanyQuizRepository } from "../repository/CompanyQuizRepository";
import { JobOfferQuizRepository } from "../repository/JobOfferQuizRepository";
import { QuizRepository } from "../repository/QuizRepository";
import { TestImageRepository } from "../repository/TestImageRepository";
import { TestOptionRepository } from "../repository/TestOptionRepository";
import { TestRepository } from "../repository/TestRepository";
import { TestTextRepository } from "../repository/TestTextRepository";
import { UserTestRepository } from "../repository/UserTestRepository";
import { UserQuizRepository } from "../repository/UserQuizRepository";
import { MediaService } from "../../media/services/MediaService";
import { Media } from "../../media/models/Media";
import { ExamQuizRepository } from "../repository/ExamQuizRepository";
import { UserApplicationRepository } from "../repository/UserApplicationRepository";
import { ExamRepository } from "../repository/ExamRepository";

const LOG = new Logger("QuizService.class");
const db = require("../../connection");
const quizRepository = new QuizRepository();
const jobOfferQuizRepository = new JobOfferQuizRepository();
const testRepository = new TestRepository();
const testOptionRepository = new TestOptionRepository();
const testTextRepository = new TestTextRepository();
const testImageRepository = new TestImageRepository();
const companyQuizRepository = new CompanyQuizRepository();
const userTestRepository = new UserTestRepository();
const userQuizRepository = new UserQuizRepository();
const mediaService = new MediaService();
const userApplicationRepository = new UserApplicationRepository();
const examRepository = new ExamRepository();
const examQuizRepository = new ExamQuizRepository();

export type NewTestDTO = { test: TestDTO, options: TestOptionDTO[], texts: TestTextDTO[], file: TestImageDTO };

export class QuizService implements QuizApi {

    public async createQuiz(dto: QuizDTO, loggedUserId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const quiz = await this.updateOrCreateQuiz(dto, null, loggedUserId, connection);
        // const jobOfferQuiz = await this.updateOrCreateJobOfferQuiz(dto, quiz.id, null, connection);
        const companyQuiz = await this.createCompanyQuiz(quiz.id, dto.company_id, connection);
        await connection.commit();
        await connection.release();
        return { quiz, companyQuiz };
    }

    public async updateQuizAndJobOfferQuiz(dto: QuizDTO, jQuizId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const quiz = await this.updateOrCreateQuiz(dto, dto.quiz_id, null, connection);
        const jobOfferQuiz = await this.updateOrCreateJobOfferQuiz(dto, quiz.id, jQuizId, connection);
        await connection.commit();
        await connection.release();
        return {quiz, jobOfferQuiz};
    }

    public async updateQuiz(dto: QuizDTO, quizId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const quiz = await this.updateOrCreateQuiz(dto, quizId, null, connection);
        await connection.commit();
        await connection.release();
        return quiz;
    }

    public async createTest(dto: NewTestDTO, loggedUserId: number) {
        console.log(dto);
        const connection = await db.connection();
        await connection.newTransaction();
        const test = await this.updateOrCreateTest(dto.test, null, connection);
        const options = dto.options.length ? await this.saveTestOptions(dto.options, test.id, connection) : [];
        const texts = dto.texts.length ? await this.saveTestTexts(dto.texts, test.id, connection): [];
        const image = dto.file ? await this.saveTestImages(dto.file, test.id, loggedUserId, connection) : null;
        await connection.commit();
        await connection.release();

        await this.resetQuizTestsPoints(test.quiz_id);
        return { test, options, texts, image };
    }

    public async updateTest(dto: {test: TestDTO, file: any}, testId: number, loggedUserId: number) {
        console.log(dto);
        
        const connection = await db.connection();
        const oldTest = await testRepository.findById(testId, connection);
        await connection.newTransaction();
        const test = await this.updateOrCreateTest(dto.test, testId, connection);
        if (dto.test.new_right_option != dto.test.old_right_option &&
            dto.test.new_right_option > 0 && dto.test.old_right_option > 0) {

                const oldRightOption = await testOptionRepository.findById(dto.test.old_right_option, connection);
                const newRightOption = await testOptionRepository.findById(dto.test.new_right_option, connection);

                const oldDto = {...oldRightOption};
                delete oldDto.is_correct;
                delete oldDto.points;
                oldDto.is_correct = 0;
                oldDto.points = 0;

                const newDto = {...newRightOption};
                delete newDto.is_correct;
                delete newDto.points;
                newDto.is_correct = 1;
                newDto.points = test.points;

                const opt1 = await this.updateTestOption(oldDto, oldRightOption.id, connection);
                const opt2 = await this.updateTestOption(newDto, newRightOption.id, connection);
            } else if (dto.test.new_right_option && !dto.test.old_right_option) {

                const oldRightOption = await testOptionRepository.findCorrectOptionByTestId(test.id, connection);
                if (oldRightOption && oldRightOption.id !== dto.test.new_right_option) {
                    const newRightOption = await testOptionRepository.findById(dto.test.new_right_option, connection);
                    const oldDto = {...oldRightOption};
                    delete oldDto.is_correct;
                    delete oldDto.points;
                    oldDto.is_correct = 0;
                    oldDto.points = 0;

                    const newDto = {...newRightOption};
                    delete newDto.is_correct;
                    delete newDto.points;
                    newDto.is_correct = 1;
                    newDto.points = test.points;

                    const opt1 = await this.updateTestOption(oldDto, oldRightOption.id, connection);
                    const opt2 = await this.updateTestOption(newDto, newRightOption.id, connection);
                } else if (!oldRightOption) {
                    const newRightOption = await testOptionRepository.findById(dto.test.new_right_option, connection);
                    const newDto = {...newRightOption};
                    delete newDto.is_correct;
                    delete newDto.points;
                    newDto.is_correct = 1;
                    newDto.points = test.points;
                    const opt2 = await this.updateTestOption(newDto, newRightOption.id, connection);
                }
            }
        await connection.commit();
        await connection.release();
        if (oldTest.points != test.points) await this.resetQuizTestsPoints(test.quiz_id);

        if (dto.file && dto.file !== 'cancel') {
            const img = await this.createNewTestImage(dto.file, testId, loggedUserId);
            test['image_url'] = img.image_url;
        }
        if (dto.file && dto.file === 'cancel') {
            await this.removeTestImage(testId);
        }
        return test;
    }

    public async resetQuizTestsPoints(quizId: number) {
        const connection = await db.connection();
        let quiz = await quizRepository.findById(quizId, connection);
        const quizTests = await testRepository.findByQuizId(quizId, connection);
        const totalScore = quizTests.filter(qT => qT.type === 'MULTIPLE').reduce((acc, elem) => acc + elem.points, 0);

        await connection.newTransaction();
        quiz = await this.updateOrCreateQuiz({ ...quiz, tests_points: totalScore, tests_amount: quizTests.length }, quiz.id, null, connection);
        await connection.commit();
        await connection.release();
        return quiz;
    }

    public async editTestOption(dto: TestOptionDTO, optionId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const opt = await this.updateTestOption(dto, optionId, connection);
        await connection.commit();
        await connection.release();
        return opt;
    }

    public async removeTestOption(optionId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const opt = await this.deleteTestOption(optionId, connection);
        await connection.commit();
        await connection.release();
        return opt;
    }

    public async editTestText(dto: TestTextDTO, textId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const text = await this.updateTestText(dto, textId, connection);
        await connection.commit();
        await connection.release();
        return text;
    }

    public async removeTestText(textId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const text = await this.deleteTestText(textId, connection);
        await connection.commit();
        await connection.release();
        return text;
    }

    public async removeTest(testId: number, quizId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const test = await this.deleteTest(testId, connection);
        await this.resetQuizTestsPoints(quizId);
        await connection.commit();
        await connection.release();
        return test;
    }

    public async removeQuiz(quizId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const quiz = await this.deleteQuiz(quizId, connection);
        await connection.commit();
        await connection.release();
        return quiz;
    }

    public async createNewTestImage(newFile: File, testId: number, loggedUserId: number) {
        console.log(newFile);
        
        const connection = await db.connection();
        const images = await testImageRepository.findByTestId(testId, connection);
        await connection.newTransaction();

        if (images.length) {
            const img = await this.deleteTestImage(images[0].id, connection);
        }
        const img = await this.saveNewTestImage(newFile, testId, loggedUserId, connection);
        await connection.commit();
        await connection.release();
        return img;
    }

    public async createNewTestOption(dto: TestOptionDTO, testId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const img = await this.saveTestOptions([dto], testId, connection);
        await connection.commit();
        await connection.release();
        return img;
    }

    public async createNewTestText(dto: TestTextDTO, testId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const img = await this.saveTestTexts([dto], testId, connection);
        await connection.commit();
        await connection.release();
        return img;
    }

    public async removeTestImage(testId: number) {
        const connection = await db.connection();
        const images = await testImageRepository.findByTestId(testId, connection);
        if (!images.length) {
            await connection.release();
            return;
        }
        await connection.newTransaction();
        const img = await this.deleteTestImage(images[0].id, connection);
        await connection.commit();
        await connection.release();
        return img;
    }

    public async getTest(testId: number, loggedUserId: number) {
        const connection = await db.connection();
        const test = await testRepository.findById(testId, connection);
        const options = await testOptionRepository.findByTestId(testId, connection);
        const texts = await testTextRepository.findByTestId(testId, connection);
        const images = await testImageRepository.findByTestId(testId, connection);
        const uTest = await userTestRepository.findByUserIdAndTestId(loggedUserId, testId, connection);
        await connection.release();
        return { test, options, texts, images, uTest };
    }

    public async getQuizs(companyId: number) {
        const connection = await db.connection();
        const companyQuizs = await companyQuizRepository.findByCompanyId(companyId, connection);
        const quizIds = companyQuizs.map(cQ => cQ.quiz_id);
        const quizs = await quizRepository.findWhereIdIn(quizIds, connection);
        await connection.release();
        return quizs;
    }

    public async getJobOfferQuiz(jobOfferQuizId: number, loggedUserId: number) {
        const connection = await db.connection();
        const jQuiz = await jobOfferQuizRepository.findById(jobOfferQuizId, connection);
        const quiz = await quizRepository.findById(jQuiz.quiz_id, connection);
        const uQuiz = await userQuizRepository.findByQuizIdAndJobOfferIdAndUserId(jQuiz.quiz_id, jQuiz.job_offer_id, loggedUserId, connection);
        const tests = await testRepository.findByQuizId(quiz.id, connection);
        const testsIds = tests.map(t => t.id);
        const opts = testsIds.length ? await testOptionRepository.findByTestIdsIn(testsIds, connection) : [];
        const texts = testsIds.length ? await testTextRepository.findByTestIdsIn(testsIds, connection) : [];
        const imgs = testsIds.length ? await testImageRepository.findByTestIdsIn(testsIds, connection) : [];
        await connection.release();
        
        const newTests = tests.map(test => {
            return {
                ...test,
                options: [...opts].filter(opt => opt.test_id == test.id),
                texts: [...texts].filter(opt => opt.test_id == test.id),
                images: [...imgs].filter(opt => opt.test_id == test.id)
            }
        });
        return { jQuiz, quiz, uQuiz, tests: newTests };
    }

    public async getExamQuiz(examQuizId: number, loggedUserId: number) {
        const connection = await db.connection();
        const eQuiz = await examQuizRepository.findById(examQuizId, connection);
        const quiz = await quizRepository.findById(eQuiz.quiz_id, connection);
        const uQuiz = await userQuizRepository.findByQuizIdAndExamIdAndUserId(eQuiz.quiz_id, eQuiz.exam_id, loggedUserId, connection);
        const tests = await testRepository.findByQuizId(quiz.id, connection);
        const testsIds = tests.map(t => t.id);
        const opts = testsIds.length ? await testOptionRepository.findByTestIdsIn(testsIds, connection) : [];
        const texts = testsIds.length ? await testTextRepository.findByTestIdsIn(testsIds, connection) : [];
        const imgs = testsIds.length ? await testImageRepository.findByTestIdsIn(testsIds, connection) : [];
        await connection.release();
        
        const newTests = tests.map(test => {
            return {
                ...test,
                options: [...opts].filter(opt => opt.test_id == test.id),
                texts: [...texts].filter(opt => opt.test_id == test.id),
                images: [...imgs].filter(opt => opt.test_id == test.id)
            }
        });
        return { eQuiz: eQuiz, quiz, uQuiz, tests: newTests };
    }

    public async getQuiz(quizId: number) {
        const connection = await db.connection();
        let uApps = [];
        const examQuizs = await examQuizRepository.findByQuizId(quizId, connection);
        const examsIds = examQuizs.map(eQz => eQz.exam_id);
        if (examsIds.length) {
            const exams = await examRepository.findByIdInAndActive(examsIds, connection);
            if (exams.length) {
                uApps = await userApplicationRepository.findByExamIdIn(examsIds, connection);
            }
        }
        const quiz = await quizRepository.findById(quizId, connection);
        const tests = await testRepository.findByQuizId(quiz.id, connection);
        const testsIds = tests.map(t => t.id);
        const opts = testsIds.length ? await testOptionRepository.findByTestIdsIn(testsIds, connection) : [];
        const texts = testsIds.length ? await testTextRepository.findByTestIdsIn(testsIds, connection) : [];
        const imgs = testsIds.length ? await testImageRepository.findByTestIdsIn(testsIds, connection) : [];
        await connection.release();
        
        const newTests = tests.map(test => {
            return {
                ...test,
                options: [...opts].filter(opt => opt.test_id == test.id),
                texts: [...texts].filter(opt => opt.test_id == test.id),
                images: [...imgs].filter(opt => opt.test_id == test.id)
            }
        });
        return { quiz, tests: newTests, uApps };
    }

    public async getJobOfferQuizs(jobOfferId: number, loggedUserId: number) {
        const connection = await db.connection();
        const quizs = await jobOfferQuizRepository.findByJobOfferId(jobOfferId, connection);
        const uQuizs = await userQuizRepository.findByJobOfferIdAndUserId(jobOfferId, loggedUserId, connection);
        await connection.release();
        return {quizs, uQuizs};
    }

    public async getExamQuizs(examId: number, loggedUserId: number) {
        const connection = await db.connection();
        const quizs = await examQuizRepository.findByExamId(examId, connection);
        const uQuizs = await userQuizRepository.findByExamIdAndUserId(examId, loggedUserId, connection);
        await connection.release();
        return {quizs, uQuizs};
    }

    private async updateOrCreateQuiz(dto: QuizDTO, quizId = null, loggedUserId: number, connection) {
        try {
            const quiz = quizId ? await quizRepository.findById(quizId, connection) : new Quiz();
            quiz.author_user_id = quizId ? quiz.author_user_id : loggedUserId;
            quiz.minutes = +dto.minutes || quiz.minutes;
            quiz.check_camera = +dto.check_camera >= 0 ? dto.check_camera : quiz.check_camera;;
            quiz.check_mic = +dto.check_mic >= 0 ? dto.check_mic : quiz.check_mic;
            quiz.topic = dto.topic || quiz.topic;
            quiz.category = dto.category || quiz.category;
            quiz.difficulty_level = +dto.difficulty_level || quiz.difficulty_level;
            quiz.public = +dto.public >= 0 ? (dto.public === 0 ? 1 : 0) : quiz.public;
            quiz.tests_amount = +dto.tests_amount >= 0 ? dto.tests_amount : quiz.tests_amount;
            quiz.tests_points = +dto.tests_points >= 0 ? dto.tests_points : quiz.tests_points;

            const coInserted = quizId ? await quizRepository.update(quiz, connection) : await quizRepository.save(quiz, connection);
            quiz.id = quizId ? quiz.id : coInserted.insertId;
            !quizId && LOG.info("NEW QUIZ", quiz.id);
            return quiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Quiz", 500, null, e);
        }
    }

    private async updateOrCreateJobOfferQuiz(dto: QuizDTO, quizId: number, jQuizId = null, connection) {
        try {
            const jQuiz = jQuizId ? await jobOfferQuizRepository.findById(jQuizId, connection) : new JobOfferQuiz();
            jQuiz.quiz_id = jQuizId ? jQuiz.quiz_id : quizId;
            jQuiz.job_offer_id = jQuizId ? jQuiz.job_offer_id : dto.job_offer_id;
            jQuiz.position_order = dto.position_order >= 0 ? dto.position_order : jQuiz.position_order;
            jQuiz.required = +dto.required;
            
            const coInserted = jQuizId ? await jobOfferQuizRepository.update(jQuiz, connection) : await jobOfferQuizRepository.save(jQuiz, connection);
            jQuiz.id = jQuizId ? jQuiz.id : coInserted.insertId;
            return jQuiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update JobOffer Quiz", 500, null, e);
        }
    }

    private async updateOrCreateTest(dto: TestDTO, testId = null, connection) {
        try {
            const test = testId ? await testRepository.findById(testId, connection) : new Test();
            test.quiz_id = testId ? test.quiz_id : dto.quiz_id;
            test.question = dto.question || test.question;
            test.minutes = dto.minutes || test.minutes;
            test.type = dto.type || test.type;
            test.points = dto.points >= 0 ? dto.points : test.points;
            test.position_order = dto.position_order >= 0 ? dto.position_order : test.position_order;
            test.difficulty_level = dto.difficulty_level  >= 0 ? dto.difficulty_level : test.difficulty_level;

            const coInserted = testId ? await testRepository.update(test, connection) : await testRepository.save(test, connection);
            test.id = testId ? test.id : coInserted.insertId;
            !testId && LOG.info("NEW TEST", test.id);
            return test;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Test", 500, null, e);
        }
    }

    private async saveTestOptions(options: TestOptionDTO[], testId: number, connection) {
        try {
            const keys = ['test_id', 'option_text', 'is_correct', 'points', 'position_order'];
            const values = options.map(option => [testId, option.option_text, option.is_correct, option.points, option.position_order]);

            const otionsInserted = await testOptionRepository.saveMultiple(keys, values, connection);
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer UserData", 500, null, e);
        }
    }

    private async saveTestTexts(options: TestTextDTO[], testId: number, connection) {
        try {
            const keys = ['test_id', 'text', 'position_order'];
            const values = options.map(option => [testId, option.text, option.position_order]);

            const otionsInserted = await testTextRepository.saveMultiple(keys, values, connection);
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer UserData", 500, null, e);
        }
    }

    private async saveTestImages(file: TestImageDTO, testId: number, loggedId: number, connection) {
        try {
            let media: Media = await mediaService.uploadFile({ file, user_id: loggedId }, connection);
            const keys = ['test_id', 'media_id', 'image_url', 'position_order'];
            const values = [file].map(option => [testId, media.id, media.url, (option.position_order || 0)]);

            const otionsInserted = await testImageRepository.saveMultiple(keys, values, connection);
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Test Images", 500, null, e);
        }
    }

    private async updateTestOption(dto: TestOptionDTO, optionId: number, connection) {
        try {
            const opt = await testOptionRepository.findById(optionId, connection);
            opt.option_text = dto.option_text || opt.option_text;
            opt.is_correct = dto.is_correct >= 0 ? dto.is_correct : opt.is_correct;
            opt.points = dto.points >= 0 ? dto.points : opt.points;
            opt.position_order = dto.position_order || opt.position_order;
            await testOptionRepository.update(opt, connection);
            return opt;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Test Option", 500, null, e);
        }
    }

    private async deleteTestOption(optionId: number, connection) {
        try {
            const opt = await testOptionRepository.findById(optionId, connection);
            await testOptionRepository.delete(opt, connection);
            return opt;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Test Option", 500, null, e);
        }
    }

    private async updateTestText(dto: TestTextDTO, textId: number, connection) {
        try {
            const text = await testTextRepository.findById(textId, connection);
            text.text = dto.text || text.text;
            text.position_order = dto.position_order || text.position_order;
            await testTextRepository.update(text, connection);
            return text;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Test Text", 500, null, e);
        }
    }

    private async deleteTestText(textId: number, connection) {
        try {
            const text = await testTextRepository.findById(textId, connection);
            await testTextRepository.delete(text, connection);
            return text;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Test Text", 500, null, e);
        }
    }

    private async deleteTest(testId: number, connection) {
        try {
            const test = await testRepository.deleteById(testId, connection);
            return test;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Test", 500, null, e);
        }
    }

    private async deleteQuiz(quizId: number, connection) {
        try {
            const q = await quizRepository.deleteById(quizId, connection);
            return q;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Quiz", 500, null, e);
        }
    }

    private async saveNewTestImage(file: File, testId: number, loggedId: number, connection) {
        try {
            let media: Media = await mediaService.uploadFile({ file, user_id: loggedId }, connection);
            const img = new TestImage();
            img.media_id = media.id;
            img.image_url = media.url;
            img.position_order = 0;
            img.test_id = testId;
            await testImageRepository.save(img, connection);
            return img;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Save Test Image", 500, null, e);
        }
    }

    private async deleteTestImage(imageId: number, connection) {
        try {
            const img = await testImageRepository.findById(imageId, connection);
            await testImageRepository.delete(img, connection);
            return img;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Test Image", 500, null, e);
        }
    }

    private async createCompanyQuiz(quizId: number, companyId: number, connection) {
        try {
            const cQuiz = new CompanyQuiz();
            cQuiz.quiz_id = quizId;
            cQuiz.company_id = companyId;
            await companyQuizRepository.save(cQuiz, connection);
            return cQuiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Company Quiz", 500, null, e);
        }
    }

}