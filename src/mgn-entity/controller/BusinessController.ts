import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { BusinessApi } from "../integration/BusinessApi";
import { BusinessService } from "../service/BusinessService";

// services
const businessService = new BusinessService();
const LOG = new Logger("BusinessController.class");

export class BusinessController implements BusinessApi {
    
    @Post()
    @Path("/addBusiness")
    public async addBusiness(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.addBusiness(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.addBusiness.Error'});
        }
    }

    @Post()
    @Path("/addUserBusiness/:businessId/:userId")
    public async addUserBusiness(res: Response, req) {
        try {
            const response = await businessService.addUserBusiness(parseInt(req.params.businessId, 10), parseInt(req.params.userId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.addUserBusiness.Error'});
        }
    }

    @Post()
    @Path("/removeUserBusiness/:businessId/:userId")
    public async removeUserBusiness(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.removeUserBusiness(parseInt(req.params.businessId, 10), parseInt(req.params.userId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.removeUserBusiness.Error'});
        }
    }

    @Post()
    @Path("/sendNotificationToClients/:businessId")
    public async sendNotificationToClients(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.sendNotificationToClients(parseInt(req.params.businessId, 10), loggedUserId, req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.sendNotificationToClients.Error'});
        }
    }

    @Get()
    @Path("/getUserBusinesses/:businessId")
    public async getUserBusinesses(res: Response, req) {
        try {
            const response = await businessService.getUserBusinesses(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getUserBusinesses.Error'});
        }
    }

    @Get()
    @Path("/getBusinessInfo/:businessId")
    public async getBusinessInfo(res: Response, req) {
        try {
            const response = await businessService.getUserBusinesses(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getUserBusinesses.Error'});
        }
    }

    @Post()
    @Path("/getBusinessesByCaps")
    public async getBusinessesByCaps(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const caps = req.body.caps || [];
            const businessesIds = req.body.businessesIds || [];
            const response = await businessService.getBusinessesByCaps(caps, businessesIds, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getBusinessesByCaps.Error'});
        }
    }

    @Get()
    @Path("/getBusinessNotifications/:businessId")
    public async getBusinessNotifications(res: Response, req) {
        try {
            const response = await businessService.getBusinessNotifications(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getBusinessNotifications.Error'});
        }
    }

    @Post()
    @Path("/deleteBusiness/:businessId")
    public async deleteBusiness(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.deleteBusiness(parseInt(req.params.businessId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.deleteBusiness.Error'});
        }
    }

    @Post()
    @Path("/deleteNotification/:notificationId")
    public async deleteNotification(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.deleteNotification(parseInt(req.params.notificationId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.deleteNotification.Error'});
        }
    }

    @Post()
    @Path("/updateBusiness/:businessId")
    public async updateBusiness(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessService.updateBusiness(parseInt(req.params.businessId, 10), req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.updateBusiness.Error'});
        }
    }

    @Get()
    @Path("/getBusiness/:businessId")
    public async getBusiness(res: Response, req) {
        try {
            const response = await businessService.getBusiness(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getBusiness.Error'});
        }
    }

    @Get()
    @Path("/getUserBusinessesList/:userId")
    public async getUserBusinessesList(res: Response, req) {
        try {
            const response = await businessService.getUserBusinessesList(parseInt(req.params.userId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getUserBusinessesList.Error'});
        }
    }

}