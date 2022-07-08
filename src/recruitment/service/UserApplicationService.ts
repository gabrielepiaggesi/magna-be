import { Logger } from "../../framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Test } from "../model/Test";
import { TestOption } from "../model/TestOption";
import { UserApplication } from "../model/UserApplication";
import { UserQuiz } from "../model/UserQuiz";
import { UserTest } from "../model/UserTest";
import { JobOfferSkillRepository } from "../repository/JobOfferSkillRepository";
import { QuizRepository } from "../repository/QuizRepository";
import { TestOptionRepository } from "../repository/TestOptionRepository";
import { TestRepository } from "../repository/TestRepository";
import { UserApplicationRepository } from "../repository/UserApplicationRepository";
import { UserDataOptionRepository } from "../repository/UserDataOptionRepository";
import { UserDataRepository } from "../repository/UserDataRepository";
import { UserQuizRepository } from "../repository/UserQuizRepository";
import { UserSkillRepository } from "../repository/UserSkillRepository";
import { UserTestRepository } from "../repository/UserTestRepository";
import { UserAppDTO } from "../type/UserAppDTO";
import { UserApplicationApi } from "../integration/UserApplicationApi";
import { UserDataDTO } from "../type/UserDataDTO";
import { UserQuizDTO } from "../type/UserQuizDTO";
import { UserSkillDTO } from "../type/UserSkillDTO";
import { UserTestDTO } from "../type/UserTestDTO";

const LOG = new Logger("UserApplicationService.class");
const db = require("../../connection");
const userApplicationRepository = new UserApplicationRepository();
const userDataRepository = new UserDataRepository();
const userSkillRepository = new UserSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository();
const userQuizRepository = new UserQuizRepository();
const userTestRepository = new UserTestRepository();
const testRepository = new TestRepository();
const testOptionRepository = new TestOptionRepository();
const quizRepository = new QuizRepository();

export type NewUserAppDTO = { uApp: UserAppDTO, uData: UserDataDTO[], uSkills: UserSkillDTO[] };

export class UserApplicationService implements UserApplicationApi {

    public async createUserApplication(dto: NewUserAppDTO, loggedUserId: number) {
        const connection = await db.connection();
        const uApp = await this.saveUserApplication(dto.uApp, loggedUserId, connection);
        const uData = await this.saveUserData(dto.uData, loggedUserId, connection);
        const uSkills = await this.saveUserSkills(dto.uSkills, loggedUserId, connection);
        await connection.release();
        return { uApp, uData, uSkills };
    }

    public async getUserApplication(userId: number, jobOfferId: number) {
        const connection = await db.connection();
        const uApp = await userApplicationRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
        const dataOptions = await userDataOptionRepository.findAllActive(null, connection);
        const userData = await userDataRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
        const jobOfferSkills = await jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
        const userSkills = await userSkillRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
        await connection.release();
        return { uApp, dataOptions, userData, jobOfferSkills, userSkills };
    }

    public async createUserQuiz(dto: UserQuizDTO, loggedUserId: number) {
        const connection = await db.connection();
        const uQuiz = await this.saveUserQuiz(dto, loggedUserId, connection);
        await connection.release();
        return uQuiz;
    }

    public async createUserTest(dto: UserTestDTO, loggedUserId: number) {
        const connection = await db.connection();
        const uQuiz = await this.updateOrCreateUserTest(dto, null, loggedUserId, connection);
        await connection.release();
        return uQuiz;
    }

    public async updateUserTest(dto: UserTestDTO, userTestId: number, loggedUserId: number) {
        const connection = await db.connection();
        const uQuiz = await this.updateOrCreateUserTest(dto, userTestId, loggedUserId, connection);
        await connection.release();
        return uQuiz;
    }

    public async confirmAndSendUserQuiz(userQuizId: number, loggedUserId: number) {
        const connection = await db.connection();
        let uQuiz: UserQuiz = await userQuizRepository.findById(userQuizId, connection);
        const quiz = await quizRepository.findById(uQuiz.quiz_id, connection);
        const uTests = await userTestRepository.findByUserIdAndUserQuizId(loggedUserId, uQuiz.id, connection);
        const testsGiven = uTests.length;
        const testsRight = uTests.filter((t: UserTest) => t.score > 0).length;
        const uQuizScore = uTests.reduce((accumulator: number, uTest: UserTest) => accumulator + uTest.score, 0);
        const uQuizRate = uQuizScore / quiz.tests_points;
        uQuiz = await this.saveUserQuizResult(uQuiz.id, uQuizScore, uQuizRate, testsGiven, testsRight, connection);
        await connection.release();
        return uQuiz;
    }

    public async getUserQuiz(quizId: number, jobOfferId: number, loggedUserId: number) {
        const connection = await db.connection();
        let uQuiz: UserQuiz = await userQuizRepository.findByQuizIdAndJobOfferIdAndUserId(quizId, jobOfferId, loggedUserId, connection);
        await connection.release();
        return uQuiz;
    }

    private async saveUserApplication(dto: UserAppDTO, loggedUserId: number, connection) {
        await connection.newTransaction();
        try {
            const uApp = new UserApplication();
            uApp.company_id = dto.company_id;
            uApp.user_id = loggedUserId;
            uApp.job_offer_id = dto.job_offer_id;
            uApp.status = "NEW";
            uApp.note = dto.note;
            await userApplicationRepository.save(uApp, connection);
            await connection.commit();
            return uApp;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Save Test Image", 500, null, e);
        }
    }

    private async saveUserData(uData: UserDataDTO[], loggedUserId: number, connection) {
        await connection.newTransaction();
        try {
            const keys = ['user_id', 'job_offer_id', 'user_data_option_id', 'number_value', 'string_value'];
            const values = uData.map(data => [loggedUserId, data.job_offer_id, data.user_data_option_id, data.number_value, data.string_value]);

            const otionsInserted = await userDataRepository.saveMultiple(keys, values, connection);
            await connection.commit();
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer UserData", 500, null, e);
        }
    }

    private async saveUserSkills(uSkills: UserSkillDTO[], loggedUserId: number, connection) {
        await connection.newTransaction();
        try {
            const keys = ['user_id', 'job_offer_skill_id', 'job_offer_id', 'confidence_level', 'years'];
            const values = uSkills.map(data => [loggedUserId, data.job_offer_skill_id, data.job_offer_id, data.confidence_level, data.years]);

            const otionsInserted = await userSkillRepository.saveMultiple(keys, values, connection);
            await connection.commit();
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer UserData", 500, null, e);
        }
    }

    private async saveUserQuiz(dto: UserQuizDTO, loggedUserId: number, connection) {
        await connection.newTransaction();
        try {
            const uQuiz = new UserQuiz();
            uQuiz.user_id = loggedUserId;
            uQuiz.status = "NEW";
            uQuiz.quiz_id = dto.quiz_id;
            uQuiz.job_offer_id = dto.job_offer_id;
            uQuiz.score = 0;
            uQuiz.rate = 0;
            uQuiz.tests_given = 0;
            uQuiz.tests_right = 0;
            const coInserted = await userQuizRepository.save(uQuiz, connection);
            await connection.commit();
            LOG.info("NEW USER QUIZ", coInserted.insertId);
            return uQuiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Save User Quiz", 500, null, e);
        }
    }

    private async updateOrCreateUserTest(dto: UserTestDTO, userTestId = null, loggedUserId: number, connection) {
        const test: Test = await testRepository.findById(dto.test_id, connection);
        const correctOption: TestOption = await testOptionRepository.findCorrectOptionByTestId(dto.test_id, connection);
        if (!correctOption) throw new IndroError("Test Settings Invalid, correct option does not exist", 500);

        const testType = test.type;
        await connection.newTransaction();
        try {
            const uTest = userTestId ? await userTestRepository.findById(userTestId, connection) : new UserTest();
            uTest.user_id = userTestId ? uTest.user_id : loggedUserId;
            uTest.test_id = userTestId ? uTest.test_id : dto.test_id;
            uTest.user_quiz_id = userTestId ? uTest.user_quiz_id : dto.user_quiz_id;
            uTest.option_id = dto.option_id || uTest.option_id;
            uTest.answer = dto.answer || uTest.answer;
            uTest.score = testType === "MULTIPLE" ? (correctOption.id === dto.option_id ? test.points : 0) : 0; 
            uTest.media_id = dto.media_id || uTest.media_id;

            const coInserted = userTestId ? await userTestRepository.update(uTest, connection) : await userTestRepository.save(uTest, connection);
            uTest.id = userTestId ? uTest.id : coInserted.insertId;
            await connection.commit();
            !userTestId && LOG.info("NEW USER TEST", uTest.id);
            return uTest;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create User Test", 500, null, e);
        }
    }

    private async saveUserQuizResult(uQuizId: number, score: number, rate: number, tests_given: number, tests_right: number, connection) {
        await connection.newTransaction();
        try {
            const uQuiz = await userQuizRepository.findById(uQuizId, connection);
            uQuiz.status = rate > 0.5 ? "PASSED" : "FAILED";
            uQuiz.rate = rate;
            uQuiz.score = score;
            uQuiz.tests_given = tests_given;
            uQuiz.tests_right = tests_right;

            await userQuizRepository.update(uQuiz, connection);
            await connection.commit();
            return uQuiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();                                                                                                                    
            throw new IndroError("Cannot Save User Quiz Result", 500, null, e);
        }
    }

}