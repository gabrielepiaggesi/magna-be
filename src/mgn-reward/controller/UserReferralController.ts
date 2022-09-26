import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserReferralApi } from "../integration/UserReferralApi";
import { UserReferralService } from "../service/UserReferralService";

// services
const userReferralService = new UserReferralService();
const LOG = new Logger("UserReferralController.class");

export class UserReferralController implements UserReferralApi {

    @Post()
    @Path("/generateUserReferral/:userId/:businessId")
    public async generateUserReferral(res: Response, req) {
        try {
            const response = await userReferralService.generateUserReferral(parseInt(req.params.userId, 10), parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReferral.generateUserReferral.Error'});
        }
    }

    @Get()
    @Path("/getUserReferralInsight/:referralId")
    public async getUserReferralInsight(res: Response, req) {
        try {
            const response = await userReferralService.getUserReferralInsight(parseInt(req.params.referralId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReferral.getUserReferralInsight.Error'});
        }
    }

    @Post()
    @Path("/generateUserDiscountFromReferral/:uuid")
    public async generateUserDiscountFromReferral(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userReferralService.generateUserDiscountFromReferral(req.params.uuid, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReferral.generateUserDiscountFromReferral.Error'});
        }
    }

    @Get()
    @Path("/getUserReferral/:userId/:businessId")
    public async getUserReferral(res: Response, req) {
        try {
            const response = await userReferralService.getUserReferral(parseInt(req.params.userId, 10), parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReferral.getUserReferral.Error'});
        }
    }

}