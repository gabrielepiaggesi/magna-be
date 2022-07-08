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
const LOG = new Logger_1.Logger("JobOfferService.class");
const db = require("../../connection");
const jobOfferRepository = new JobOfferRepository_1.JobOfferRepository();
const jobOfferSkillRepository = new JobOfferSkillRepository_1.JobOfferSkillRepository();
const userDataOptionRepository = new UserDataOptionRepository_1.UserDataOptionRepository();
const jobOfferUserDataRepository = new JobOfferUserDataRepository_1.JobOfferUserDataRepository();
const userApplicationRepository = new UserApplicationRepository_1.UserApplicationRepository();
const userRepository = new UserRepository_1.UserRepository();
const userQuizRepository = new UserQuizRepository_1.UserQuizRepository();
class JobOfferService {
    createJobOffer(jODTO, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newJobOffer = yield this.updateOrCreateJobOffer(jODTO.jobOffer, null, loggedUserId, connection);
            const skillsSaved = yield this.saveJobOfferSkills(jODTO.skills, newJobOffer.id, connection);
            yield connection.commit();
            yield connection.release();
            return { newJobOffer, skillsSaved };
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
            yield connection.release();
            return { jOffer, skills };
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
    getJobOfferUserApplicationsList(jobOfferId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            // all order by user_id asc
            const applications = yield userApplicationRepository.findByJobOfferId(jobOfferId, connection);
            const userIds = applications.map(a => a.user_id);
            const users = yield userRepository.whereUserIdIn(userIds, connection);
            const usersQuizs = yield userQuizRepository.whereUserIdInAndJobOfferId(userIds, jobOfferId, connection);
            yield connection.release();
            const results = applications.map((app, idx) => {
                return {
                    userId: app.user_id,
                    application: app,
                    user: users[idx],
                    userQuizs: usersQuizs.filter(q => q.user_id === app.user_id)
                };
            });
            return results;
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