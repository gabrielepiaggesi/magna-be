import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { JobOfferService } from "../service/JobOfferService";
import { JobOfferApi } from "../integration/JobOfferApi";

// services
const jobOfferService = new JobOfferService();
const LOG = new Logger("JobOfferController.class");

export class JobOfferController implements JobOfferApi {

    @Post()
    @Path("/createJobOffer")
    public async createJobOffer(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await jobOfferService.createJobOffer(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.CreateJobOffer'});
        }
    }

    @Post()
    @Path("/updateJobOffer/:jobOfferId")
    public async updateJobOffer(res: Response, req) {
        try {
            const response = await jobOfferService.updateJobOffer(req.body, parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.UpdateJobOffer'});
        }
    }

    @Post()
    @Path("/editJobOfferSkill/:skillId")
    public async updateJobOfferSkill(res: Response, req) {
        try {
            const response = await jobOfferService.updateJobOfferSkill(req.body, parseInt(req.params.skillId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.updateJobOfferSkill'});
        }
    }

    @Post()
    @Path("/addJobOfferSkill")
    public async addJobOfferSkill(res: Response, req) {
        try {
            const response = await jobOfferService.addJobOfferSkill(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.addJobOfferSkill'});
        }
    }

    @Post()
    @Path("/removeJobOfferSkill/:skillId")
    public async removeJobOfferSkill(res: Response, req) {
        try {
            const response = await jobOfferService.removeJobOfferSkill(parseInt(req.params.skillId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.EraseJobOfferSkill'});
        }
    }

    @Get()
    @Path("/getJobOffers/:companyId")
    public async getJobOffers(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOffers(parseInt(req.params.companyId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOffers'});
        }
    }

    @Get()
    @Path("/getUserData/:userId/:jobOfferId")
    public async getUserData(res: Response, req) {
        try {
            const response = await jobOfferService.getUserData(parseInt(req.params.userId, 10), parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.getUserData'});
        }
    }

    @Get()
    @Path("/getJobOffer/:jobOfferId")
    public async getJobOffer(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOffer(parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOffer'});
        }
    }

    @Get()
    @Path("/getJobOfferFromLink/:linkUUID")
    public async getJobOfferFromLink(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOfferFromLink(req.params.linkUUID.toString());
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOffer'});
        }
    }

    @Get()
    @Path("/getJobOfferSkills/:jobOfferId")
    public async getJobOfferSkills(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOfferSkills(parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOfferSkills'});
        }
    }

    @Get()
    @Path("/getUsersDataOptions")
    public async getUsersDataOptions(res: Response, req) {
        try {
            const response = await jobOfferService.getUsersDataOptions();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetUsersDataOptions'});
        }
    }

    @Post()
    @Path("/setJobOfferUserData/:jobOfferId")
    public async setJobOfferUserData(res: Response, req) {
        try {
            const response = await jobOfferService.setJobOfferUserData(req.body, parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.SetJobOfferUserData'});
        }
    }

    @Get()
    @Path("/getJobOfferUserData/:jobOfferId")
    public async getJobOfferUserData(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOfferUserData(parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOfferUserData'});
        }
    }

    @Post()
    @Path("/addJobOfferUserData/:jobOfferId/:optionId")
    public async addJobOfferUserData(res: Response, req) {
        try {
            const response = await jobOfferService.addJobOfferUserData(parseInt(req.params.jobOfferId, 10), parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.AddJobOfferUserData'});
        }
    }

    @Post()
    @Path("/removejobOfferUserData/:jobOfferId/:optionId")
    public async removejobOfferUserData(res: Response, req) {
        try {
            const response = await jobOfferService.removejobOfferUserData(parseInt(req.params.jobOfferId, 10), parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.RemovejobOfferUserData'});
        }
    }

    @Get()
    @Path("/getJobOfferUserApplicationsList/:jobOfferId")
    public async getJobOfferUserApplicationsList(res: Response, req) {
        try {
            const response = await jobOfferService.getJobOfferUserApplicationsList(parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'JobOffer.GetJobOfferUserApplicationsList'});
        }
    }


}