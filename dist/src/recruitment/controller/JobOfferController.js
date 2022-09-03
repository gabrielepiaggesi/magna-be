"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const __1 = require("../..");
const Logger_1 = require("../../framework/services/Logger");
const Decorator_1 = require("../../utils/Decorator");
const JobOfferService_1 = require("../service/JobOfferService");
// services
const jobOfferService = new JobOfferService_1.JobOfferService();
const LOG = new Logger_1.Logger("JobOfferController.class");
class JobOfferController {
    createJobOffer(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield jobOfferService.createJobOffer(req.body, loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.CreateJobOffer' }));
            }
        });
    }
    updateJobOffer(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.updateJobOffer(req.body, parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.UpdateJobOffer' }));
            }
        });
    }
    updateJobOfferSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.updateJobOfferSkill(req.body, parseInt(req.params.skillId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.updateJobOfferSkill' }));
            }
        });
    }
    addJobOfferSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.addJobOfferSkill(req.body);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.addJobOfferSkill' }));
            }
        });
    }
    removeJobOfferSkill(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.removeJobOfferSkill(parseInt(req.params.skillId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.EraseJobOfferSkill' }));
            }
        });
    }
    getJobOffers(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOffers(parseInt(req.params.companyId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOffers' }));
            }
        });
    }
    getUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getUserData(parseInt(req.params.userId, 10), parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.getUserData' }));
            }
        });
    }
    getJobOffer(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOffer(parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOffer' }));
            }
        });
    }
    getJobOfferFromLink(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOfferFromLink(req.params.linkUUID.toString());
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOffer' }));
            }
        });
    }
    getJobOfferSkills(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOfferSkills(parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOfferSkills' }));
            }
        });
    }
    getUsersDataOptions(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getUsersDataOptions();
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetUsersDataOptions' }));
            }
        });
    }
    setJobOfferUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.setJobOfferUserData(req.body, parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.SetJobOfferUserData' }));
            }
        });
    }
    removeJobOffer(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.removeJobOffer(parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.removeJobOffer' }));
            }
        });
    }
    getJobOfferUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOfferUserData(parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOfferUserData' }));
            }
        });
    }
    addJobOfferUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.addJobOfferUserData(parseInt(req.params.jobOfferId, 10), parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.AddJobOfferUserData' }));
            }
        });
    }
    removejobOfferUserData(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.removejobOfferUserData(parseInt(req.params.jobOfferId, 10), parseInt(req.params.optionId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.RemovejobOfferUserData' }));
            }
        });
    }
    getJobOfferUserApplicationsList(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield jobOfferService.getJobOfferUserApplicationsList(parseInt(req.params.jobOfferId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'JobOffer.GetJobOfferUserApplicationsList' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/createJobOffer")
], JobOfferController.prototype, "createJobOffer", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateJobOffer/:jobOfferId")
], JobOfferController.prototype, "updateJobOffer", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/editJobOfferSkill/:skillId")
], JobOfferController.prototype, "updateJobOfferSkill", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addJobOfferSkill")
], JobOfferController.prototype, "addJobOfferSkill", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeJobOfferSkill/:skillId")
], JobOfferController.prototype, "removeJobOfferSkill", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOffers/:companyId")
], JobOfferController.prototype, "getJobOffers", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUserData/:userId/:jobOfferId")
], JobOfferController.prototype, "getUserData", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOffer/:jobOfferId")
], JobOfferController.prototype, "getJobOffer", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOfferFromLink/:linkUUID")
], JobOfferController.prototype, "getJobOfferFromLink", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOfferSkills/:jobOfferId")
], JobOfferController.prototype, "getJobOfferSkills", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getUsersDataOptions")
], JobOfferController.prototype, "getUsersDataOptions", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/setJobOfferUserData/:jobOfferId")
], JobOfferController.prototype, "setJobOfferUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removeJobOffer/:jobOfferId")
], JobOfferController.prototype, "removeJobOffer", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOfferUserData/:jobOfferId")
], JobOfferController.prototype, "getJobOfferUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/addJobOfferUserData/:jobOfferId/:optionId")
], JobOfferController.prototype, "addJobOfferUserData", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/removejobOfferUserData/:jobOfferId/:optionId")
], JobOfferController.prototype, "removejobOfferUserData", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getJobOfferUserApplicationsList/:jobOfferId")
], JobOfferController.prototype, "getJobOfferUserApplicationsList", null);
exports.JobOfferController = JobOfferController;
//# sourceMappingURL=JobOfferController.js.map