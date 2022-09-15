import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { BusinessDiscountApi } from "../integration/BusinessDiscountApi";
import { BusinessDiscountService } from "../service/BusinessDiscountService";

// services
const businessDiscountService = new BusinessDiscountService();
const LOG = new Logger("BusinessDiscountController.class");

export class BusinessDiscountController implements BusinessDiscountApi {

    @Post()
    @Path("/addBusinessDiscount/:discountId")
    public async addBusinessDiscount(res: Response, req) {
        try {
            const response = await businessDiscountService.addBusinessDiscount(req.body, parseInt(req.params.discountId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.addBusinessDiscount.Error'});
        }
    }

    @Post()
    @Path("/deleteBusinessDiscount/:discountId")
    public async deleteBusinessDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessDiscountService.deleteBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.deleteBusinessDiscount.Error'});
        }
    }

    @Post()
    @Path("/updateBusinessDiscount/:discountId")
    public async updateBusinessDiscount(res: Response, req) {
        try {
            const response = await businessDiscountService.updateBusinessDiscount(req.body, parseInt(req.params.discountId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.updateBusinessDiscount.Error'});
        }
    }

    @Post()
    @Path("/suspendBusinessDiscount/:discountId")
    public async suspendBusinessDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessDiscountService.suspendBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.suspendBusinessDiscount.Error'});
        }
    }

    @Post()
    @Path("/activateBusinessDiscount/:discountId")
    public async activateBusinessDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessDiscountService.activateBusinessDiscount(parseInt(req.params.discountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.activateBusinessDiscount.Error'});
        }
    }

    @Get()
    @Path("/getBusinessDiscount/:discountId")
    public async getBusinessDiscount(res: Response, req) {
        try {
            const response = await businessDiscountService.getBusinessDiscount(parseInt(req.params.discountId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.getBusinessDiscount.Error'});
        }
    }

    @Get()
    @Path("/getBusinessDiscounts/:businessId")
    public async getBusinessDiscounts(res: Response, req) {
        try {
            const response = await businessDiscountService.getBusinessDiscounts(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.getBusinessDiscounts.Error'});
        }
    }

    @Post()
    @Path("/checkUserDiscountValidity/:userDiscountId/:businessId")
    public async checkUserDiscountValidity(res: Response, req) {
        try {
            const response = await businessDiscountService.checkUserDiscountValidity(parseInt(req.params.userDiscountId, 10), parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessDiscount.checkUserDiscountValidity.Error'});
        }
    }

}