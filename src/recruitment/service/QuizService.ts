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

export type NewTestDTO = { test: TestDTO, options: TestOptionDTO[], texts: TestTextDTO[], files: TestImageDTO[] };

export class QuizService implements QuizApi {

    public async createQuiz(dto: QuizDTO, loggedUserId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const quiz = await this.updateOrCreateQuiz(dto, null, loggedUserId, connection);
        const jobOfferQuiz = await this.updateOrCreateJobOfferQuiz(dto, quiz.id, null, connection);
        const companyQuiz = await this.createCompanyQuiz(quiz.id, dto.company_id, connection);
        await connection.commit();
        await connection.release();
        return { quiz, jobOfferQuiz, companyQuiz };
    }

    public async updateQuiz(dto: QuizDTO, jQuizId: number) {
        const connection = await db.connection();
        await connection.newTransaction(); // update jobn offer quiz!
        const quiz = await this.updateOrCreateQuiz(dto, dto.quiz_id, null, connection);
        const jobOfferQuiz = await this.updateOrCreateJobOfferQuiz(dto, quiz.id, jQuizId, connection);
        await connection.commit();
        await connection.release();
        return {quiz, jobOfferQuiz};
    }

    public async createTest(dto: NewTestDTO) {
        const connection = await db.connection();
        await connection.newTransaction();
        const test = await this.updateOrCreateTest(dto.test, null, connection);
        const options = dto.options.length ? await this.saveTestOptions(dto.options, test.id, connection) : [];
        const texts = dto.texts.length ? await this.saveTestTexts(dto.texts, test.id, connection): [];
        const files = dto.files.length ? this.uploadTestImages(dto.files, test.id) : [];
        const images = files.length ? await this.saveTestImages(files, test.id, connection) : [];
        await connection.commit();
        await connection.release();
        return { test, options, texts, images };
    }

    public async updateTest(dto: TestDTO, testId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const test = await this.updateOrCreateTest(dto, testId, connection);
        if (dto.new_right_option != dto.old_right_option &&
            dto.new_right_option > 0 && dto.old_right_option > 0) {

                const oldRightOption = await testOptionRepository.findById(dto.old_right_option, connection);
                const newRightOption = await testOptionRepository.findById(dto.new_right_option, connection);

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
            }
        await connection.commit();
        await connection.release();
        return test;
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

    public async createNewTestImage(dto: TestImageDTO, testId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const image  = this.transformTestImageToUploadImage(dto, testId);
        const img = await this.saveNewTestImage(image, testId, connection);
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

    public async removeTestImage(imageId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const img = await this.deleteTestImage(imageId, connection);
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

    public async getQuiz(quizId: number) {
        const connection = await db.connection();
        const jQuiz = await jobOfferQuizRepository.findById(quizId, connection);
        const quiz = await quizRepository.findById(jQuiz.quiz_id, connection);
        const tests = await testRepository.findByQuizId(quizId, connection);
        await connection.release();
        return { jQuiz, quiz, tests };
    }

    public async getJobOfferQuizs(jobOfferId: number) {
        const connection = await db.connection();
        const quizs = await jobOfferQuizRepository.findByJobOfferId(jobOfferId, connection);
        await connection.release();
        return quizs;
    }

    private async updateOrCreateQuiz(dto: QuizDTO, quizId = null, loggedUserId: number, connection) {
        try {
            const quiz = quizId ? await quizRepository.findById(quizId, connection) : new Quiz();
            quiz.author_user_id = quizId ? quiz.author_user_id : loggedUserId;
            quiz.minutes = dto.minutes || quiz.minutes;
            quiz.check_camera = dto.check_camera >= 0 ? dto.check_camera : quiz.check_camera;;
            quiz.check_mic = dto.check_mic >= 0 ? dto.check_mic : quiz.check_mic;
            quiz.topic = dto.topic || quiz.topic;
            quiz.category = dto.category || quiz.category;
            quiz.difficulty_level = dto.difficulty_level || quiz.difficulty_level;
            quiz.public = dto.public >= 0 ? dto.public : quiz.public;
            quiz.tests_amount = dto.tests_amount >= 0 ? dto.tests_amount : quiz.tests_amount;
            quiz.tests_points = dto.tests_points >= 0 ? dto.tests_points : quiz.tests_points;

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
            test.position_order = dto.position_order || test.position_order;
            test.difficulty_level = dto.difficulty_level || test.difficulty_level;

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

    private uploadTestImages(files: TestImageDTO[], testId: number): TestImageUploadedDTO[] {
        return files.map(this.transformTestImageToUploadImage); // TODO REAL UPLOAD
    }

    private transformTestImageToUploadImage(file: TestImageDTO, testId: number): TestImageUploadedDTO {
        return {
            image_url: '',
            position_order: file.position_order,
            media_id: 0
        } as TestImageUploadedDTO;
    }

    private async saveTestImages(options: TestImageUploadedDTO[], testId: number, connection) {
        try {
            const keys = ['test_id', 'media_id', 'image_url', 'position_order'];
            const values = options.map(option => [testId, option.media_id, option.image_url, option.position_order]);

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

    private async saveNewTestImage(dto: TestImageUploadedDTO, testId: number, connection) {
        try {
            const img = new TestImage();
            img.media_id = dto.media_id;
            img.image_url = dto.image_url;
            img.position_order = dto.position_order;
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