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
const JobOffer_1 = require("../model/JobOffer");
const JobOfferRepository_1 = require("../repository/JobOfferRepository");
const JobOfferSkillRepository_1 = require("../repository/JobOfferSkillRepository");
const UserDataOptionRepository_1 = require("../repository/UserDataOptionRepository");
const JobOfferUserDataRepository_1 = require("../repository/JobOfferUserDataRepository");
const JobOfferUserData_1 = require("../model/JobOfferUserData");
const UserApplicationRepository_1 = require("../repository/UserApplicationRepository");
const UserRepository_1 = require("../../ums/repository/UserRepository");
const UserQuizRepository_1 = require("../repository/UserQuizRepository");
const JobOfferSkill_1 = require("../model/JobOfferSkill");
const JobOfferQuizRepository_1 = require("../repository/JobOfferQuizRepository");
const UserDataRepository_1 = require("../repository/UserDataRepository");
const UserSkillRepository_1 = require("../repository/UserSkillRepository");
const ConfidenceLevel_1 = require("../type/ConfidenceLevel");
const JobOfferLink_1 = require("../model/JobOfferLink");
const JobOfferLinkRepository_1 = require("../repository/JobOfferLinkRepository");
const CompanyRepository_1 = require("../../ums/repository/CompanyRepository");
const shortid = require('shortid');
const LOG = new Logger_1.Logger("JobOfferService.class");
const db = require("../../connection");
const jobOfferRepository = new JobOfferRepository_1.JobOfferRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository_1.JobOfferSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository_1.UserDataOptionRepository();
const jobOfferUserDataRepository = new JobOfferUserDataRepository_1.JobOfferUserDataRepository();
const userApplicationRepository = new UserApplicationRepository_1.UserApplicationRepository();
const userRepository = new UserRepository_1.UserRepository();
const userQuizRepository = new UserQuizRepository_1.UserQuizRepository();
const jobOfferQuizRepository = new JobOfferQuizRepository_1.JobOfferQuizRepository();
const userDataRepository = new UserDataRepository_1.UserDataRepository();
const userSkillRepository = new UserSkillRepository_1.UserSkillRepository();
const jobOfferLinkRepository = new JobOfferLinkRepository_1.JobOfferLinkRepository();
const companyRepository = new CompanyRepository_1.CompanyRepository();
class JobOfferService {
    createJobOffer(jODTO, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newJobOffer = yield this.updateOrCreateJobOffer(jODTO.jobOffer, null, loggedUserId, connection);
            const skillsSaved = yield this.saveJobOfferSkills(jODTO.skills, newJobOffer.id, connection);
            const link = yield this.saveNewJobOfferLink(newJobOffer.id, newJobOffer.company_id, connection);
            yield connection.commit();
            yield connection.release();
            return { newJobOffer, skillsSaved, link };
        });
    }
    updateJobOffer(jODTO, jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            console.log(jobOfferId);
            const newJobOffer = yield this.updateOrCreateJobOffer(jODTO, jobOfferId, null, connection);
            yield connection.commit();
            yield connection.release();
            return newJobOffer;
        });
    }
    updateJobOfferSkill(skillDTO, skillId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.updateOrCreateJobOfferSkill(skillDTO, skillId, connection);
            yield connection.release();
            return skill;
        });
    }
    addJobOfferSkill(skillDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.updateOrCreateJobOfferSkill(skillDTO, null, connection);
            yield connection.release();
            return skill;
        });
    }
    removeJobOfferSkill(skillId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skill = yield this.deleteJobOfferSkill(skillId, connection);
            yield connection.release();
            return skill;
        });
    }
    getJobOffers(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const jOffers = yield jobOfferRepository.findByCompanyId(companyId, connection);
            yield connection.release();
            return jOffers;
        });
    }
    getJobOffer(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const jOffer = yield jobOfferRepository.findById(jobOfferId, connection);
            const skills = yield jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
            const link = yield jobOfferLinkRepository.findByJobOfferId(jOffer.id, connection);
            yield connection.release();
            return { jOffer, skills, link };
        });
    }
    getJobOfferFromLink(linkUUID) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const link = yield jobOfferLinkRepository.findByUUID(linkUUID, connection);
            let jOffer = yield jobOfferRepository.findById(link.job_offer_id, connection);
            const company = yield companyRepository.findById(jOffer.company_id, connection);
            jOffer['company_name'] = company.name;
            yield connection.release();
            return jOffer;
        });
    }
    getJobOfferSkills(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const skills = yield jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
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
    setJobOfferUserData(dataOptionIds, jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.saveJobOfferUserData(dataOptionIds, jobOfferId, connection);
            yield connection.release();
            return data;
        });
    }
    getJobOfferUserData(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);
            yield connection.release();
            return data;
        });
    }
    addJobOfferUserData(jobOfferId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.insertJobOfferUserData(jobOfferId, optionId, connection);
            yield connection.release();
            return data;
        });
    }
    removejobOfferUserData(jobOfferId, optionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const data = yield this.deleteJobOfferUserData(jobOfferId, optionId, connection);
            yield connection.release();
            return data;
        });
    }
    getUserData(userId, jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const options = yield userDataOptionRepository.findAllActive(null, connection);
            let userData = yield userDataRepository.findByUserIdAndJobOfferId(userId, jobOfferId, connection);
            console.log(userData);
            const candidateData = userData.map(uO => {
                const opt = options.find(opt => opt.id === uO.user_data_option_id);
                return Object.assign(Object.assign({}, uO), { option_key: opt.option_key, type: opt.type });
            });
            yield connection.release();
            return candidateData;
        });
    }
    getJobOfferUserApplicationsList(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uApps = yield userApplicationRepository.findByJobOfferId(jobOfferId, connection);
            if (!uApps || !uApps.length) {
                yield connection.release();
                return { columns: [], usersResults: [] };
            }
            const opts = yield userDataOptionRepository.findAllActive(null, connection);
            let jobOfferUserData = yield jobOfferUserDataRepository.findByJobOfferId(jobOfferId, connection);
            const jobOfferSkills = yield jobOfferSkillRepository.findByJobOfferId(jobOfferId, connection);
            const jobOfferQuizs = yield jobOfferQuizRepository.findByJobOfferId(jobOfferId, connection);
            const userIds = uApps.map(app => app.user_id);
            const quizIds = jobOfferQuizs.map(jQ => jQ.quiz_id);
            const userData = yield userDataRepository.findByUserIdInAndJobOfferId(userIds, jobOfferId, connection);
            const userSkills = yield userSkillRepository.findByUserIdInAndJobOfferId(userIds, jobOfferId, connection);
            const userQuizs = yield userQuizRepository.whereUserIdInAndQuizIdInAndJobOfferId(userIds, quizIds, jobOfferId, connection);
            yield connection.release();
            jobOfferUserData = jobOfferUserData.filter(jO => !!opts.find(opt => opt.id === jO.option_id).relevant);
            const jobOfferUserDataColumns = jobOfferUserData.map(jO => {
                const opt = opts.find(opt => opt.id === jO.option_id);
                let position = 0;
                if (opt.option_key === 'name')
                    position = 2;
                if (opt.option_key === 'lastname')
                    position = 1;
                let jOC = { key: opt.option_key, label: null, type: 'options', position };
                return jOC;
            }).sort((a, b) => b.position - a.position);
            const jobOfferSkillsColumns = jobOfferSkills.sort((a, b) => b.required - a.required).map(jS => ({ key: 'skill_' + jS.id, label: jS.text, type: 'skills' }));
            const jobOfferQuizsColumns = jobOfferQuizs.sort((a, b) => b.required - a.required).map(jQ => ({ key: 'quiz_' + jQ.quiz_id, label: jQ.topic, type: 'quizs' }));
            const otherColumns = [{ key: 'requiredScore', label: 'Tests Score', type: 'general' }, { key: 'bonusScore', label: 'Bonus Tests Score', type: 'general' }];
            const columns = [...jobOfferUserDataColumns, 'space', ...jobOfferSkillsColumns, 'space', ...jobOfferQuizsColumns, 'space', ...otherColumns];
            const usersResults = uApps.map(app => {
                let userResult = { userId: app.user_id };
                jobOfferUserData.forEach(jO => {
                    const option = opts.find(opt => opt.id === jO.option_id);
                    const userDataOpt = userData.find(uO => uO.user_id === app.user_id && uO.user_data_option_id === jO.option_id);
                    if (userDataOpt) {
                        if (option.type === 'BOOLEAN')
                            userResult[option.option_key] = userDataOpt.number_value ? 'YES' : 'NO';
                        if (option.type !== 'BOOLEAN')
                            userResult[option.option_key] = userDataOpt.string_value || +userDataOpt.number_value || null;
                    }
                });
                jobOfferSkills.forEach(jS => {
                    const userSkill = userSkills.find(uS => uS.user_id === app.user_id && uS.job_offer_skill_id === jS.id);
                    if (userSkill) {
                        userResult['skill_' + jS.id] = ConfidenceLevel_1.ConfidenceLevel[(userSkill.confidence_level || 3)] + ' - ' + (userSkill.years || 1) + ' anni';
                    }
                    // userResult['years_skill_'+jS.id] = userSkill.years || 0;
                });
                userResult['requiredScore'] = 0;
                userResult['bonusScore'] = 0;
                jobOfferQuizs.forEach(jQ => {
                    const userQuiz = userQuizs.find(uQ => uQ.user_id === app.user_id && uQ.quiz_id === jQ.quiz_id);
                    if (userQuiz) {
                        userResult['quiz_' + jQ.id] = userQuiz.score + ' - ' + (userQuiz.rate * 100).toFixed(0) + '%';
                        if (jQ.required)
                            userResult['requiredScore'] = userResult['requiredScore'] + userQuiz.score;
                        if (!jQ.required)
                            userResult['bonusScore'] = userResult['bonusScore'] + userQuiz.score;
                    }
                });
                return userResult;
            });
            return { columns, usersResults };
        });
    }
    updateOrCreateJobOffer(jODTO, jobOfferId = null, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newJo = jobOfferId ? yield jobOfferRepository.findById(jobOfferId, connection) : new JobOffer_1.JobOffer();
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
                const coInserted = jobOfferId ? yield jobOfferRepository.update(newJo, connection) : yield jobOfferRepository.save(newJo, connection);
                newJo.id = jobOfferId ? newJo.id : coInserted.insertId;
                !jobOfferId && LOG.info("NEW JOB OFFER", newJo.id);
                return newJo;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create JobOffer", 500, null, e);
            }
        });
    }
    saveJobOfferSkills(jobOfferSkills, jobOfferId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const skillsInserted = yield jobOfferSkillRepository.saveMultiple(keys, values, connection);
                return skillsInserted;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create JobOffer Skills", 500, null, e);
            }
        });
    }
    updateOrCreateJobOfferSkill(skillDTO, skillId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const skill = skillId ? yield jobOfferSkillRepository.findById(skillId, connection) : new JobOfferSkill_1.JobOfferSkill();
                skill.quiz_id = skillDTO.quiz_id || skill.quiz_id;
                skill.job_offer_id = skillDTO.job_offer_id || skill.job_offer_id;
                skill.text = skillDTO.text || skill.text;
                skill.required = skillDTO.required >= 0 ? 1 : (skill.required || 0);
                skillId ? yield jobOfferSkillRepository.update(skill, connection) : yield jobOfferSkillRepository.save(skill, connection);
                yield connection.commit();
                return skill;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update JobOffer Skill", 500, null, e);
            }
        });
    }
    deleteJobOfferSkill(skillId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const skill = yield jobOfferSkillRepository.findById(skillId, connection);
                yield jobOfferSkillRepository.delete(skill, connection);
                yield connection.commit();
                return skill;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete JobOffer Skill", 500, null, e);
            }
        });
    }
    saveJobOfferUserData(dataOptionIds, jobOfferId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const keys = ['job_offer_id', 'option_id'];
                const values = dataOptionIds.map(optionId => [jobOfferId, optionId]);
                const otionsInserted = yield jobOfferUserDataRepository.saveMultiple(keys, values, connection);
                yield connection.commit();
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
    insertJobOfferUserData(jobOfferId, optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const data = new JobOfferUserData_1.JobOfferUserData();
                data.job_offer_id = jobOfferId;
                data.option_id = optionId;
                yield jobOfferUserDataRepository.save(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Add JobOffer UserData", 500, null, e);
            }
        });
    }
    saveNewJobOfferLink(jobOfferId, companyId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jLink = new JobOfferLink_1.JobOfferLink();
                jLink.job_offer_id = jobOfferId;
                jLink.company_id = companyId;
                jLink.uuid = shortid.generate();
                const linkInserted = yield jobOfferLinkRepository.save(jLink, connection);
                jLink.id = linkInserted.insertId;
                return jLink;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Add JobOffer Link", 500, null, e);
            }
        });
    }
    deleteJobOfferUserData(jobOfferId, optionId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const data = yield jobOfferUserDataRepository.findByJobOfferIdAndOptionId(jobOfferId, optionId, connection);
                yield jobOfferUserDataRepository.delete(data, connection);
                yield connection.commit();
                return data;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete JobOffer UserData", 500, null, e);
            }
        });
    }
}
exports.JobOfferService = JobOfferService;
//# sourceMappingURL=JobOfferService.js.map