import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { BusinessApi } from "../integration/BusinessApi";
import { BusinessService } from "../service/BusinessService";

// services
const businessService = new BusinessService();
const LOG = new Logger("PublicController.class");

export class PublicController {
    @Get()
    @Path("/getBusinessInfo/:businessId")
    public async getBusinessInfo(res: Response, req) {
        try {
            const response = await businessService.getBusinessInfo(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getBusinessInfo.Error'});
        }
    }
}