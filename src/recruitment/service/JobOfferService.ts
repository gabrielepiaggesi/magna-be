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

const LOG = new Logger("JobOfferService.class");
const db = require("../../connection");
const jobOfferRepository = new JobOfferRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository();
const jobOfferUserDataRepository = new JobOfferUserDataRepository();
const userApplicationRepository = new UserApplicationRepository();
const userRepository = new UserRepository();
const userQuizRepository = new UserQuizRepository();

type NewJobOffer = { jobOffer: JobOfferDTO, skills: JobOfferSkillDTO[] };

export class JobOfferService implements JobOfferApi {

    public async createJobOffer(jODTO: NewJobOffer, loggedUserId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const newJobOffer = await this.updateOrCreateJobOffer(jODTO.jobOffer, null, loggedUserId, connection);
        const skillsSaved = await this.saveJobOfferSkills(jODTO.skills, newJobOffer.id, connection);
        await connection.commit();
        await connection.release();
        return { newJobOffer, skillsSaved };
    }

    public async updateJobOffer(jODTO: JobOfferDTO, jobOfferId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        console.log(jobOfferId);
        const newJobOffer = await this.updateOrCreateJobOffer(jODTO, jobOfferId, null, connection);
        await connection.commit();
        await connection.release();
        return newJobOffer;
    }

    public async updateJobOfferSkill(skillDTO: JobOfferSkillDTO, skillId: number) {
        const connection = await db.connection();
        const skill = await this.updateOrCreateJobOfferSkill(skillDTO, skillId, connection);
        await connection.release();
        return skill;
    }

    public async addJobOfferSkill(skillDTO: JobOfferSkillDTO) {
        const connection = await db.connection();
        const skill = await this.updateOrCreateJobOfferSkill(skillDTO, null, connection);
        await connection.release();
        return skill;
    }

    public async removeJobOfferSkill(skillId: number) {
        const connection = await db.connection();
        const skill = await this.deleteJobOfferSkill(skillId, connection);
        await connection.release();
        return skill;
    }

    public async getJobOffers(companyId: number) {
        const connection = await db.connection();
        const jOffers = await jobOfferRepository.findByCompanyId(companyId, connection);
        await connection.release();
        return jOffers;
    }

    public async getJobOffer(jobOfferId: number) {
        const connection = await db.connection();
        const jOffer = await jobOfferRepository.findById(jobOfferId, connection);
        const skills = await jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
        await connection.release();
        return {jOffer, skills};
    }

    public async getJobOfferSkills(jobOfferId: number) {
        const connection = await db.connection();
        const skills = await jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
        await connection.release();
        return skills;
    }

    public async getUsersDataOptions() {
        const connection = await db.connection();
        const data = await userDataOptionRepository.findAllActive(null, connection);
        await connection.release();
        return data;
    }

    public async setJobOfferUserData(dataOptionIds: number[], jobOfferId: number) {
        const connection = await db.connection();
        const data = await this.saveJobOfferUserData(dataOptionIds, jobOfferId, connection);
        await connection.release();
        return data;
    }

    public async getJobOfferUserData(jobOfferId: number) {
        const connection = await db.connection();
        const data = await jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);
        await connection.release();
        return data;
    }

    public async addJobOfferUserData(jobOfferId: number, optionId: number) {
        const connection = await db.connection();
        const data = await this.insertJobOfferUserData(jobOfferId, optionId, connection);
        await connection.release();
        return data;
    }

    public async removejobOfferUserData(jobOfferId: number, optionId: number) {
        const connection = await db.connection();
        const data = await this.deleteJobOfferUserData(jobOfferId, optionId, connection);
        await connection.release();
        return data;
    }

    public async getJobOfferUserApplicationsList(jobOfferId: number) {
        const connection = await db.connection();
        // all order by user_id asc
        const applications = await userApplicationRepository.findByJobOfferId(jobOfferId, connection);
        const userIds = applications.map(a => a.user_id);
        const users = await userRepository.whereUserIdIn(userIds, connection);
        const usersQuizs = await userQuizRepository.whereUserIdInAndJobOfferId(userIds, jobOfferId, connection);
        await connection.release();
        const results = applications.map((app, idx) => {
            return {
                userId: app.user_id,
                application: app,
                user: users[idx],
                userQuizs: usersQuizs.filter(q => q.user_id === app.user_id)
            };
        })
        return results;
    }

    private async updateOrCreateJobOffer(jODTO: JobOfferDTO, jobOfferId = null, loggedUserId: number, connection) {
        try {
            const newJo = jobOfferId ? await jobOfferRepository.findById(jobOfferId, connection) : new JobOffer();
            newJo.author_user_id = jobOfferId ? newJo.author_user_id : loggedUserId;
            newJo.status = jobOfferId ? newJo.status : "NEW";
            newJo.company_id = jODTO.company_id || newJo.company_id;
            newJo.lang = jODTO.lang || newJo.lang;
            newJo.role = jODTO.role || newJo.role;
            newJo.country = jODTO.country || newJo.country;
            newJo.city = jODTO.city || newJo.city;
            newJo.address = jODTO.address || newJo.address;
            newJo.equipment = jODTO.equipment || newJo.equipment;
            newJo.description = jODTO.description || newJo.description;
            newJo.mode = jODTO.mode || newJo.mode;
            newJo.type = jODTO.type || newJo.type;
            newJo.public = jODTO.public || newJo.public;
            newJo.contract_timing = jODTO.contract_timing || newJo.contract_timing;
            newJo.contract_type = jODTO.contract_type || newJo.contract_type;
            newJo.salary_range = jODTO.salary_range || newJo.salary_range;
            newJo.expired_at = jODTO.expired_at || newJo.expired_at;

            const coInserted = jobOfferId ? await jobOfferRepository.update(newJo, connection) : await jobOfferRepository.save(newJo, connection);
            newJo.id = jobOfferId ? newJo.id : coInserted.insertId;
            !jobOfferId && LOG.info("NEW JOB OFFER", newJo.id);
            return newJo;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer", 500, null, e);
        }
    }

    private async saveJobOfferSkills(jobOfferSkills: JobOfferSkillDTO[], jobOfferId: number, connection) {
        try {
            const keys = ["job_offer_id", "text", "required"];
            const values = jobOfferSkills.map(skill => {
                let newSkill = {
                    job_offer_id: jobOfferId,
                    text: skill.text,
                    required: skill.required
                };
                return Object.values(newSkill); // [1,'React',1]
            });

            const skillsInserted = await jobOfferSkillRepository.saveMultiple(keys, values, connection);
            return skillsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer Skills", 500, null, e);
        }
    }

    private async updateOrCreateJobOfferSkill(skillDTO: JobOfferSkillDTO, skillId: number = null, connection) {
        await connection.newTransaction();
        try {
            const skill = skillId ? await jobOfferSkillRepository.findById(skillId, connection) : new JobOfferSkill();
            skill.quiz_id = skillDTO.quiz_id || skill.quiz_id;
            skill.job_offer_id = skillDTO.job_offer_id || skill.job_offer_id;
            skill.text = skillDTO.text || skill.text;
            skill.required = skillDTO.required >= 0 ? 1 : (skill.required || 0);
            skillId ? await jobOfferSkillRepository.update(skill, connection) : await jobOfferSkillRepository.save(skill, connection);
            await connection.commit();
            return skill;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update JobOffer Skill", 500, null, e);
        }
    }

    private async deleteJobOfferSkill(skillId: number, connection) {
        await connection.newTransaction();
        try {
            const skill = await jobOfferSkillRepository.findById(skillId, connection);
            await jobOfferSkillRepository.delete(skill, connection);
            await connection.commit();
            return skill;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete JobOffer Skill", 500, null, e);
        }
    }

    private async saveJobOfferUserData(dataOptionIds: number[], jobOfferId: number, connection) {
        await connection.newTransaction();
        try {
            const keys = ['job_offer_id', 'option_id'];
            const values = dataOptionIds.map(optionId => [jobOfferId, optionId]);

            const otionsInserted = await jobOfferUserDataRepository.saveMultiple(keys, values, connection);
            await connection.commit();
            return otionsInserted;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create JobOffer UserData", 500, null, e);
        }
    }

    private async insertJobOfferUserData(jobOfferId: number, optionId: number,connection) {
        await connection.newTransaction();
        try {
            const data = new JobOfferUserData();
            data.job_offer_id = jobOfferId;
            data.option_id = optionId;
            await jobOfferUserDataRepository.save(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Add JobOffer UserData", 500, null, e);
        }
    }

    private async deleteJobOfferUserData(jobOfferId: number, optionId: number,connection) {
        await connection.newTransaction();
        try {
            const data = await jobOfferUserDataRepository.findByJobOfferIdAndOptionId(jobOfferId, optionId, connection);
            await jobOfferUserDataRepository.delete(data, connection);
            await connection.commit();
            return data;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete JobOffer UserData", 500, null, e);
        }
    }
}
