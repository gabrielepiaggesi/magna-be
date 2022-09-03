import { Logger } from "../../framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { JobOffer } from "../model/JobOffer";
import { JobOfferRepository } from "../repository/JobOfferRepository";
import { JobOfferDTO } from "../type/JobOfferDTO";
import { JobOfferSkillDTO } from "../type/JobOfferSkillDTO";
import { JobOfferSkillRepository } from "../repository/JobOfferSkillRepository";
import { UserDataOptionRepository } from "../repository/UserDataOptionRepository";
import { JobOfferUserDataRepository } from "../repository/JobOfferUserDataRepository";
import { JobOfferUserData } from "../model/JobOfferUserData";
import { UserApplicationRepository } from "../repository/UserApplicationRepository";
import { UserRepository } from "../../ums/repository/UserRepository";
import { UserQuizRepository } from "../repository/UserQuizRepository";
import { JobOfferApi } from "../integration/JobOfferApi";
import { JobOfferSkill } from "../model/JobOfferSkill";
import { JobOfferQuizRepository } from "../repository/JobOfferQuizRepository";
import { UserDataRepository } from "../repository/UserDataRepository";
import { UserSkillRepository } from "../repository/UserSkillRepository";
import { skipPartiallyEmittedExpressions } from "typescript";
import { UserDataOption } from "../model/UserDataOption";
import { ConfidenceLevel } from "../type/ConfidenceLevel";
import { JobOfferLink } from "../model/JobOfferLink";
import { JobOfferLinkRepository } from "../repository/JobOfferLinkRepository";
import { CompanyRepository } from "../../ums/repository/CompanyRepository";
import { ExamApi } from "../integration/ExamApi";
import { ExamDTO } from "../type/ExamDTO";
import { ExamSkillDTO } from "../type/ExamSkillDTO";
import { ExamRepository } from "../repository/ExamRepository";
import { Exam } from "../model/Exam";
import { ExamSkillRepository } from "../repository/ExamSkillRepository";
import { ExamLink } from "../model/ExamLink";
import { ExamLinkRepository } from "../repository/ExamLinkRepository";
import { ExamSkill } from "../model/ExamSkill";
import { ExamUserDataRepository } from "../repository/ExamUserDataRepository";
import { ExamUserData } from "../model/ExamUserData";
import { ExamQuizRepository } from "../repository/ExamQuizRepository";
import { ExamQuiz } from "../model/ExamQuiz";
import { QuizDTO } from "../type/QuizDTO";
import { QuizRepository } from "../repository/QuizRepository";
import { CompanyQuizRepository } from "../repository/CompanyQuizRepository";
import { UserTestRepository } from "../repository/UserTestRepository";
import { TestRepository } from "../repository/TestRepository";
import { TestOptionRepository } from "../repository/TestOptionRepository";

const shortid = require('shortid');
const LOG = new Logger("JobOfferService.class");
const db = require("../../connection");
const userDataOptionRepository = new UserDataOptionRepository();
const userApplicationRepository = new UserApplicationRepository();
const userQuizRepository = new UserQuizRepository();
const userDataRepository = new UserDataRepository();
const userSkillRepository = new UserSkillRepository();
const companyRepository = new CompanyRepository();
const companyQuizRepository = new CompanyQuizRepository();

const examRepository = new ExamRepository();
const examSkillRepository = new ExamSkillRepository();
const examLinkRepository = new ExamLinkRepository();
const examUserDataRepository = new ExamUserDataRepository();
const examQuizRepository = new ExamQuizRepository();
const quizRepository = new QuizRepository();
const userTestRepository = new UserTestRepository();
const testRepository = new TestRepository();
const testOptionRepository = new TestOptionRepository();

type NewExam = { exam: ExamDTO, skills: ExamSkillDTO[] };

export class ExamService implements ExamApi {

    public async createExam(exDTO: NewExam, loggedUserId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const newExam = await this.updateOrCreateExam(exDTO.exam, null, loggedUserId, connection);
        // const skillsSaved = await this.saveExamSkills(exDTO.skills, newExam.id, connection);
        const link = await this.saveNewExamLink(newExam.id, newExam.company_id, connection);
        //name,lastname,email
        const data = await this.saveExamUserData([1,2,4], newExam.id, connection);
        await connection.commit();
        await connection.release();
        return { newExam: newExam, link };
    }

    public async updateExam(exDTO: ExamDTO, examId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        console.log(examId);
        const newExam = await this.updateOrCreateExam(exDTO, examId, null, connection);
        await connection.commit();
        await connection.release();
        return newExam;
    }

    public async updateExamSkill(skillDTO:ExamSkillDTO, skillId: number) {
        const connection = await db.connection();
        const skill = await this.updateOrCreateExamSkill(skillDTO, skillId, connection);
        await connection.release();
        return skill;
    }

    public async addExamSkill(skillDTO: ExamSkillDTO) {
        const connection = await db.connection();
        const skill = await this.updateOrCreateExamSkill(skillDTO, null, connection);
        await connection.release();
        return skill;
    }

    public async addQuizToExam(examId: number, quizId: number, companyId: number) {
        const connection = await db.connection();
        const companyQuizs = await companyQuizRepository.findByCompanyIdAndQuizId(companyId, quizId, connection);
        if (!companyQuizs) {
            await connection.release();
            return null;
        }
        const examQuizs = await examQuizRepository.findByExamId(examId, connection);
        const sameQuizs = examQuizs.filter(eQ => eQ.quiz_id === quizId);
        if (sameQuizs.length) {
            await connection.release();
            return null;
        }
        await connection.newTransaction();
        const exQuiz = await this.updateOrCreateExamQuiz(examId, quizId, 1, null, connection);
        await connection.commit();
        await connection.release();
        return exQuiz;
    }

    public async addQuizsToExam(examId: number, quizIds: number[]) {
        const connection = await db.connection();

        const exam = await examRepository.findById(examId, connection);
        if (exam.status === 'CLOSED') {
            await connection.release();
            return null;
        }

        const examQuizs = await examQuizRepository.findByExamId(examId, connection);
        const examQuizsIds = examQuizs.map(eQ => eQ.quiz_id);
        quizIds = quizIds.filter(qId => !examQuizsIds.includes(qId));
        if (!quizIds.length) {
            await connection.release();
            return null;
        }
        await connection.newTransaction();
        if (exam.status === 'DRAFT') {
            exam.status = 'ACTIVE';
            const newExam = await this.updateOrCreateExam(exam as ExamDTO, examId, exam.author_user_id, connection);
        }
        const exQuiz = await this.saveExamQuizs(quizIds, examId, connection);
        await connection.commit();
        await connection.release();
        return exQuiz;
    }

    public async getExamQuizs(examId: number) {
        const connection = await db.connection();
        const examQuizs = await examQuizRepository.findByExamId(examId, connection);
        const quizIds = examQuizs.map(cQ => cQ.quiz_id);
        const quizs = await quizRepository.findWhereIdIn(quizIds, connection);
        await connection.release();
        return quizs;
    }

    public async getExamUserReport(userId: number, examId: number) {
        const connection = await db.connection();
        const examUserQuizs = await userQuizRepository.findByExamIdAndUserId(examId, userId, connection);
        const userQuizIds = examUserQuizs.map(eQ => eQ.id);
        const quizIds = examUserQuizs.map(eQ => eQ.quiz_id);
        const quizs = await quizRepository.findWhereIdIn(quizIds, connection);
        const tests = await testRepository.findByQuizIdIn(quizIds, connection);
        const testIds = tests.map(t => t.id);
        const options = await testOptionRepository.findByTestIdsIn(testIds, connection);
        const userTests = await userTestRepository.findByUserIdAndUserQuizIdIn(userId, userQuizIds, connection);

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
                }
            });
            results.push(result);
        });

        await connection.release();
        return results;
    }

    public async removeExamSkill(skillId: number) {
        const connection = await db.connection();
        const skill = await this.deleteExamSkill(skillId, connection);
        await connection.release();
        return skill;
    }

    public async getExams(companyId: number, status: string) {
        const connection = await db.connection();
        const exams = await examRepository.findByCompanyIdAndStatus(companyId, status, connection);
        await connection.release();
        return exams;
    }

    public async getExam(examId: number) {
        const connection = await db.connection();
        const exam = await examRepository.findById(examId, connection);
        const uApps = await userApplicationRepository.findByExamId(examId, connection);
        const skills = await examSkillRepository.findByExamId(examId, connection);
        const link = await examLinkRepository.findByExamId(exam.id, connection);
        await connection.release();
        return {exam, skills, link, uApps};
    }

    public async getExamFromLink(linkUUID: string) {
        const connection = await db.connection();
        const link = await examLinkRepository.findByUUID(linkUUID, connection);
        let exam = await examRepository.findById(link.exam_id, connection);
        const company = await companyRepository.findById(exam.company_id, connection);
        exam['company_name'] = company.name;
        await connection.release();
        return exam;
    }

    public async getExamSkills(examId: number) {
        const connection = await db.connection();
        const skills = await examSkillRepository.findByExamId(examId, connection);
        await connection.release();
        return skills;
    }

    public async getUsersDataOptions() {
        const connection = await db.connection();
        const data = await userDataOptionRepository.findAllActive(null, connection);
        await connection.release();
        return data;
    }

    public async setExamUserData(dataOptionIds: number[], examId: number) {
        const connection = await db.connection();
        const data = await this.saveExamUserData(dataOptionIds, examId, connection);
        await connection.release();
        return data;
    }

    public async getExamUserData(examId: number) {
        const connection = await db.connection();
        const data = await examUserDataRepository.findByExamId(examId, connection);
        await connection.release();
        return data;
    }

    public async addExamUserData(examId: number, optionId: number) {
        const connection = await db.connection();
        const data = await this.insertExamUserData(examId, optionId, connection);
        await connection.release();
        return data;
    }

    public async removeExamUserData(examId: number, optionId: number) {
        const connection = await db.connection();
        const data = await this.deleteExamUserData(examId, optionId, connection);
        await connection.release();
        return data;
    }

    public async removeExam(examId: number) {
        const connection = await db.connection();

        const uApps = await userApplicationRepository.findByExamId(examId, connection);
        if (uApps && uApps.length) {
            await connection.release();
            return null;
        }

        const data = await this.deleteExam(examId, connection);
        await connection.release();
        return data;
    }

    public async removeExamQuiz(examId: number, quizId: number) {
        const connection = await db.connection();
        const data = await this.deleteExamQuiz(examId, quizId, connection);
        await connection.release();
        return data;
    }

    public async getUserData(userId: number, examId: number) {
        const connection = await db.connection();
        const options = await userDataOptionRepository.findAllActive(null, connection);
        let userData = await userDataRepository.findByUserIdAndExamId(userId, examId, connection);
        console.log(userData);
        const candidateData = userData.map(uO => {
            const opt = options.find(opt => opt.id === uO.user_data_option_id);
            return {
                ...uO,
                option_key: opt.option_key,
                type: opt.type
            }
        })
        await connection.release();
        return candidateData;
    }

    public async getExamUserApplicationsList(examId: number) {
        const connection = await db.connection();
        const uApps = await userApplicationRepository.findByExamId(examId, connection);
        console.log('apps', uApps.length);
        
        if (!uApps || !uApps.length) {
            await connection.release();
            return { columns: [], usersResults: [] };
        }
        
        const opts: UserDataOption[] = await userDataOptionRepository.findAllActive(null, connection);
        let examUserData = await examUserDataRepository.findByExamId(examId, connection);
        const examQuizs = await examQuizRepository.findByExamId(examId, connection);
        console.log('examQuizs', examQuizs.length);

        const userIds = uApps.map(app => app.user_id);
        console.log('userIds', userIds.length);
        const quizIds = examQuizs.map(jQ => jQ.quiz_id);
        console.log('quizIds', quizIds.length);
        
        const userData = await userDataRepository.findByUserIdInAndExamId(userIds, examId, connection);
        const userQuizs = await userQuizRepository.whereUserIdInAndQuizIdInAndExamId(userIds, quizIds, examId, connection);
        console.log('userQuizs', userQuizs.length);
        await connection.release();

        examUserData = examUserData.filter(jO => !!opts.find(opt => opt.id === jO.option_id));
        const examUserDataColumns = examUserData.map(jO => {
            const opt = opts.find(opt => opt.id === jO.option_id);
            let position = 0;
            // if (opt.option_key === 'name') position = 2;
            // if (opt.option_key === 'lastname') position = 1;
            let jOC = { key: opt.option_key, label: null, type: 'options', position };
            return jOC;
        }).sort((a, b) => b.position - a.position);
        const examQuizsColumns = examQuizs.sort((a, b) => b.required - a.required).map(jQ => ({ key: 'quiz_'+jQ.quiz_id, label: jQ.topic, type: 'quizs' }));
        const otherColumns = [{ key: 'score', label: 'Score', type: 'general' }];
        const columns = [...otherColumns, ...examQuizsColumns, ...examUserDataColumns];
        const usersResults = uApps.map(app => {
            let userResult = { userId: app.user_id };
            
            examUserData.forEach(jO => {
                const option = opts.find(opt => opt.id === jO.option_id);
                const userDataOpt = userData.find(uO => uO.user_id === app.user_id && uO.user_data_option_id === jO.option_id);
                if (userDataOpt) {
                    if (option.type === 'BOOLEAN') userResult[option.option_key] = userDataOpt.number_value ? 'YES' : 'NO';
                    if (option.type !== 'BOOLEAN') userResult[option.option_key] = userDataOpt.string_value || +userDataOpt.number_value || null;
                }
            });
            userResult['score'] = 0;
            examQuizs.forEach(jQ => {
                const userQuiz = userQuizs.find(uQ => uQ.user_id === app.user_id && uQ.quiz_id === jQ.quiz_id);
                if (userQuiz) {
                    userResult['quiz_'+jQ.id] = userQuiz.score + ' - ' + (userQuiz.rate * 100).toFixed(0) + '%';
                    userResult['score'] = userResult['score'] + userQuiz.score;
                }
            });
            return userResult;
        });
        return { columns, usersResults };
    }

    private async updateOrCreateExamQuiz(examId: number, quizId: number, required: number, exQuizId = null, connection) {
        try {
            const exQuiz = exQuizId ? await examQuizRepository.findById(exQuizId, connection) : new ExamQuiz();
            exQuiz.quiz_id = exQuizId ? exQuiz.quiz_id : quizId;
            exQuiz.exam_id = exQuizId ? exQuiz.exam_id : examId;
            exQuiz.position_order = 0;
            exQuiz.required = +required || 1;
            
            const coInserted = exQuizId ? await examQuizRepository.update(exQuiz, connection) : await examQuizRepository.save(exQuiz, connection);
            exQuiz.id = exQuizId ? exQuiz.id : coInserted.insertId;
            return exQuiz;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Exam Quiz", 500, null, e);
        }
    }

    private async updateOrCreateExam(exDTO: ExamDTO, examID = null, loggedUserId: number, connection) {
        try {
            const newEx = examID ? await examRepository.findById(examID, connection) : new Exam();
            newEx.author_user_id = examID ? newEx.author_user_id : loggedUserId;
            newEx.status = exDTO.status || newEx.status || "DRAFT";
            newEx.description = exDTO.description || newEx.description;
            newEx.company_id = exDTO.company_id || newEx.company_id;
            newEx.role = exDTO.role || newEx.role;

            const coInserted = examID ? await examRepository.update(newEx, connection) : await examRepository.save(newEx, connection);
            newEx.id = examID ? newEx.id : coInserted.insertId;
            !examID && LOG.info("NEW EXAM", newEx.id);
            return newEx;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Exam", 500, null, e);
        }
    }

    private async saveExamQuizs(quizIds: number[], examId: number, connection) {
        try {
            const keys = ["exam_id", "quiz_id", "required", "position_order"];
            const values = quizIds.map(quizId => {
                let newExamQuiz = {
                    exam_id: examId,
                    quiz_id: quizId,
                    required:  1,
                    position_order: 0
                };
                return Object.values(newExamQuiz); // [1,'React',1]
            });

            const skillsInserted = await examQuizRepository.saveMultiple(keys, values, connection);
            return skillsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Multiple Exam Quizs", 500, null, e);
        }
    }

    private async saveExamSkills(examSkills: ExamSkillDTO[], examId: number, connection) {
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

            const skillsInserted = await examSkillRepository.saveMultiple(keys, values, connection);
            return skillsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Exam Skills", 500, null, e);
        }
    }

    private async updateOrCreateExamSkill(skillDTO: ExamSkillDTO, skillId: number = null, connection) {
        await connection.newTransaction();
        try {
            const skill = skillId ? await examSkillRepository.findById(skillId, connection) : new ExamSkill();
            skill.exam_id = skillDTO.exam_id || skill.exam_id;
            skill.text = skillDTO.text || skill.text;
            skill.required = skillDTO.required >= 0 ? 1 : (skill.required || 0);
            skillId ? await examSkillRepository.update(skill, connection) : await examSkillRepository.save(skill, connection);
            await connection.commit();
            return skill;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update Exam Skill", 500, null, e);
        }
    }

    private async deleteExamSkill(skillId: number, connection) {
        const skill = await examSkillRepository.findById(skillId, connection);
        if (!skill) return skill;
        await connection.newTransaction();
        try {
            await examSkillRepository.delete(skill, connection);
            await connection.commit();
            return skill;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Exam Skill", 500, null, e);
        }
    }

    private async saveExamUserData(dataOptionIds: number[], examID: number, connection) {
        await connection.newTransaction();
        try {
            const keys = ['exam_id', 'option_id'];
            const values = dataOptionIds.map(optionId => [examID, optionId]);

            const otionsInserted = await examUserDataRepository.saveMultiple(keys, values, connection);
            await connection.commit();
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Exam UserData", 500, null, e);
        }
    }

    private async insertExamUserData(exam_id: number, optionId: number, connection) {
        await connection.newTransaction();
        try {
            const data = new ExamUserData();
            data.exam_id = exam_id;
            data.option_id = optionId;
            await examUserDataRepository.save(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Add Exam UserData", 500, null, e);
        }
    }

    private async saveNewExamLink(examId: number, companyId: number,connection) {
        try {
            const eLink = new ExamLink();
            eLink.exam_id = examId;
            eLink.company_id = companyId;
            eLink.uuid = shortid.generate();
            const linkInserted = await examLinkRepository.save(eLink, connection);
            eLink.id = linkInserted.insertId;
            return eLink;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Add Exam Link", 500, null, e);
        }
    }

    private async deleteExamUserData(examId: number, optionId: number,connection) {
        const data = await examUserDataRepository.findByExamIdAndOptionId(examId, optionId, connection);
        if (!data) return data;
        await connection.newTransaction();
        try {
            await examUserDataRepository.delete(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Exam UserData", 500, null, e);
        }
    }

    private async deleteExam(examId: number, connection) {
        const data = await examRepository.findById(examId, connection);
        if (!data) return data;
        await connection.newTransaction();
        try {
            await examRepository.delete(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Exam", 500, null, e);
        }
    }

    private async deleteExamQuiz(examId: number, quizId: number, connection) {
        const data = await examQuizRepository.findByExamIdAndQuizId(examId, quizId, connection);
        if (!data) return data;
        await connection.newTransaction();
        try {
            await examQuizRepository.delete(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Exam Quiz", 500, null, e);
        }
    }
}
