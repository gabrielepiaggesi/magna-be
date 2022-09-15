import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserDiscountApi } from "../integration/UserDiscountApi";
import { UserDiscountService } from "../service/UserDiscountService";

// services
const userDiscountService = new UserDiscountService();
const LOG = new Logger("UserDiscountController.class");

export class UserDiscountController implements UserDiscountApi {

    @Post()
    @Path("/addUserDiscount/:userId")
    public async addUserDiscount(res: Response, req) {
        try {
            const response = await userDiscountService.addUserDiscount(req.body, parseInt(req.params.userId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.addUserDiscount.Error'});
        }
    }

    @Post()
    @Path("/deleteUserDiscount/:userDiscountId")
    public async deleteUserDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userDiscountService.deleteUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.deleteUserDiscount.Error'});
        }
    }

    @Post()
    @Path("/updateUserDiscount/:userDiscountId")
    public async updateUserDiscount(res: Response, req) {
        try {
            const response = await userDiscountService.updateUserDiscount(req.body, parseInt(req.params.userDiscountId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.updateUserDiscount.Error'});
        }
    }

    @Post()
    @Path("/suspendUserDiscount/:userDiscountId")
    public async suspendUserDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userDiscountService.suspendUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.suspendUserDiscount.Error'});
        }
    }

    @Post()
    @Path("/activateUserDiscount/:userDiscountId")
    public async activateUserDiscount(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userDiscountService.suspendUserDiscount(parseInt(req.params.userDiscountId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.suspendUserDiscount.Error'});
        }
    }

    @Get()
    @Path("/getUserDiscount/:userDiscountId")
    public async getUserDiscount(res: Response, req) {
        try {
            const response = await userDiscountService.getUserDiscount(parseInt(req.params.userDiscountId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.getUserDiscount.Error'});
        }
    }

    @Get()
    @Path("/getUserDiscounts")
    public async getUserDiscounts(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userDiscountService.getUserDiscounts(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserDiscount.getUserDiscounts.Error'});
        }
    }

}