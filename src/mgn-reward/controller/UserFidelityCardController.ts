import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserFidelityCardApi } from "../integration/UserFidelityCardApi";
import { UserFidelityCardService } from "../service/UserFidelityCardService";

// services
const userFidelityCardService = new UserFidelityCardService();
const LOG = new Logger("UserFidelityCardController.class");

export class UserFidelityCardController implements UserFidelityCardApi {
    
    @Post()
    @Path("/addUserFidelityCard/:businessId")
    public async addUserFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userFidelityCardService.addUserFidelityCard(parseInt(req.params.businessId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.addUserFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/deleteUserFidelityCard/:userFidelityCardId")
    public async deleteUserFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userFidelityCardService.deleteUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.deleteUserFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/updateUserFidelityCard/:userFidelityCardId")
    public async updateUserFidelityCard(res: Response, req) {
        try {
            const response = await userFidelityCardService.updateUserFidelityCard(req.body, parseInt(req.params.userFidelityCardId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.updateUserFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/suspendUserFidelityCard/:userFidelityCardId")
    public async suspendUserFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userFidelityCardService.suspendUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.suspendUserFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/activateUserFidelityCard/:userFidelityCardId")
    public async activateUserFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userFidelityCardService.activateUserFidelityCard(parseInt(req.params.userFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.activateUserFidelityCard.Error'});
        }
    }

    @Get()
    @Path("/getUserFidelityCard/:userFidelityCardId")
    public async getUserFidelityCard(res: Response, req) {
        try {
            const response = await userFidelityCardService.getUserFidelityCard(parseInt(req.params.userFidelityCardId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.getUserFidelityCard.Error'});
        }
    }

    @Get()
    @Path("/getUserFidelityCards")
    public async getUserFidelityCards(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userFidelityCardService.getUserFidelityCards(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserFidelityCard.getUserFidelityCards.Error'});
        }
    }

}