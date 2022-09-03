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

const shortid = require('shortid');
const LOG = new Logger("JobOfferService.class");
const db = require("../../connection");
const jobOfferRepository = new JobOfferRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository();
const jobOfferUserDataRepository = new JobOfferUserDataRepository();
const userApplicationRepository = new UserApplicationRepository();
const userRepository = new UserRepository();
const userQuizRepository = new UserQuizRepository();
const jobOfferQuizRepository = new JobOfferQuizRepository();
const userDataRepository = new UserDataRepository();
const userSkillRepository = new UserSkillRepository();
const jobOfferLinkRepository = new JobOfferLinkRepository();
const companyRepository = new CompanyRepository();

type NewJobOffer = { jobOffer: JobOfferDTO, skills: JobOfferSkillDTO[] };

export class JobOfferService implements JobOfferApi {

    public async createJobOffer(jODTO: NewJobOffer, loggedUserId: number) {
        const connection = await db.connection();
        await connection.newTransaction();
        const newJobOffer = await this.updateOrCreateJobOffer(jODTO.jobOffer, null, loggedUserId, connection);
        const skillsSaved = await this.saveJobOfferSkills(jODTO.skills, newJobOffer.id, connection);
        const link = await this.saveNewJobOfferLink(newJobOffer.id, newJobOffer.company_id, connection);
        const data = await this.saveJobOfferUserData([1,2,4], newJobOffer.id, connection);
        await connection.commit();
        await connection.release();
        return { newJobOffer, skillsSaved, link };
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
        const link = await jobOfferLinkRepository.findByJobOfferId(jOffer.id, connection);
        const jData = await jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);
        const uData = await userDataOptionRepository.findAllActive(null, connection);
        await connection.release();
        return {jOffer, skills, link, jData, uData};
    }

    public async getJobOfferFromLink(linkUUID: string) {
        const connection = await db.connection();
        const link = await jobOfferLinkRepository.findByUUID(linkUUID, connection);
        let jOffer = await jobOfferRepository.findById(link.job_offer_id, connection);
        const company = await companyRepository.findById(jOffer.company_id, connection);
        jOffer['company_name'] = company.name;
        await connection.release();
        return jOffer;
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
        let data = await jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);

        // data = data.filter(d => ![1,2,4].includes(d.option_id));
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
        if ([1,2,4].includes(optionId)) {
            return null;
        }
        const connection = await db.connection();
        const data = await this.deleteJobOfferUserData(jobOfferId, optionId, connection);
        await connection.release();
        return data;
    }

    public async getUserData(userId: number, jobOfferId: number) {
        const connection = await db.connection();
        const options = await userDataOptionRepository.findAllActive(null, connection);
        let userData = await userDataRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
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

    public async getJobOfferUserApplicationsList(jobOfferId: number) {
        const connection = await db.connection();
        const uApps = await userApplicationRepository.findByJobOfferId(jobOfferId, connection);
        if (!uApps || !uApps.length) {
            await connection.release();
            return { columns: [], usersResults: [] };
        }
        
        const opts: UserDataOption[] = await userDataOptionRepository.findAllActive(null, connection);
        let jobOfferUserData = await jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);
        const jobOfferSkills = await jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);

        const userIds = uApps.map(app => app.user_id);
        
        const userData = await userDataRepository.findByUserIdInAndJobOfferId(userIds, jobOfferId, connection);
        const userSkills = await userSkillRepository.findByUserIdInAndJobOfferId(userIds, jobOfferId, connection);
        await connection.release();

        jobOfferUserData = jobOfferUserData.filter(jO => !!opts.find(opt => opt.id === jO.option_id).relevant);
        const jobOfferUserDataColumns = jobOfferUserData.map(jO => {
            const opt = opts.find(opt => opt.id === jO.option_id);
            let position = 0;
            if (opt.option_key === 'name') position = 2;
            if (opt.option_key === 'lastname') position = 1;
            let jOC = { key: opt.option_key, label: null, type: 'options', position };
            return jOC;
        }).sort((a, b) => b.position - a.position);
        const jobOfferSkillsColumns = jobOfferSkills.sort((a, b) => b.required - a.required).map(jS => ({ key: 'skill_'+jS.id, label: jS.text, type: 'skills' }));
        const columns = [...jobOfferUserDataColumns,...jobOfferSkillsColumns];
        const usersResults = uApps.map(app => {
            let userResult = { userId: app.user_id };
            
            jobOfferUserData.forEach(jO => {
                const option = opts.find(opt => opt.id === jO.option_id);
                const userDataOpt = userData.find(uO => uO.user_id === app.user_id && uO.user_data_option_id === jO.option_id);
                if (userDataOpt) {
                    if (option.type === 'BOOLEAN') userResult[option.option_key] = userDataOpt.number_value ? 'YES' : 'NO';
                    if (option.type !== 'BOOLEAN') userResult[option.option_key] = userDataOpt.string_value || +userDataOpt.number_value || null;
                }
            });
            jobOfferSkills.forEach(jS => {
                const userSkill = userSkills.find(uS => uS.user_id === app.user_id && uS.job_offer_skill_id === jS.id);
                if (userSkill) {
                    userResult['skill_'+jS.id] = ConfidenceLevel[(userSkill.confidence_level || 3)] + ' - ' + (userSkill.years || 1) + ' anni';
                }
                // userResult['years_skill_'+jS.id] = userSkill.years || 0;
            });
            return userResult;
        });
        return { columns, usersResults };
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
            const keys = ["job_offer_id", "text", "required", "years"];
            const values = jobOfferSkills.map(skill => {
                let newSkill = {
                    job_offer_id: jobOfferId,
                    text: skill.text,
                    required: skill.required,
                    years: skill.years
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
            skill.required = skillDTO.required >= 0 ? skillDTO.required : (skill.required || 0);
            skill.years = skillDTO.years || skill.years;
            const operation = skillId ? await jobOfferSkillRepository.update(skill, connection) : await jobOfferSkillRepository.save(skill, connection);
            skill.id = skillId ? skillId : operation.insertId;
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

    private async saveNewJobOfferLink(jobOfferId: number, companyId: number,connection) {
        try {
            const jLink = new JobOfferLink();
            jLink.job_offer_id = jobOfferId;
            jLink.company_id = companyId;
            jLink.uuid = shortid.generate();
            const linkInserted = await jobOfferLinkRepository.save(jLink, connection);
            jLink.id = linkInserted.insertId;
            return jLink;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Add JobOffer Link", 500, null, e);
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
