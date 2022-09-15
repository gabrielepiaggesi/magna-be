import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { BusinessFidelityCardApi } from "../integration/BusinessFidelityCardApi";
import { BusinessFidelityCardService } from "../service/BusinessFidelityCardService";

// services
const businessFidelityCardService = new BusinessFidelityCardService();
const LOG = new Logger("BusinessFidelityCardController.class");

export class BusinessFidelityCardController implements BusinessFidelityCardApi {

    @Post()
    @Path("/addBusinessFidelityCard/:businessId")
    public async addBusinessFidelityCard(res: Response, req) {
        try {
            const response = await businessFidelityCardService.addBusinessFidelityCard(req.body, parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.addBusinessFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/deleteBusinessFidelityCard/:businessFidelityCardId")
    public async deleteBusinessFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessFidelityCardService.deleteBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.deleteBusinessFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/updateBusinessFidelityCard/:businessFidelityCardId")
    public async updateBusinessFidelityCard(res: Response, req) {
        try {
            const response = await businessFidelityCardService.updateBusinessFidelityCard(req.body, parseInt(req.params.businessFidelityCardId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.updateBusinessFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/suspendBusinessFidelityCard/:businessFidelityCardId")
    public async suspendBusinessFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessFidelityCardService.suspendBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.suspendBusinessFidelityCard.Error'});
        }
    }

    @Post()
    @Path("/activateBusinessFidelityCard/:businessFidelityCardId")
    public async activateBusinessFidelityCard(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await businessFidelityCardService.activateBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.activateBusinessFidelityCard.Error'});
        }
    }

    @Get()
    @Path("/getBusinessFidelityCard/:businessFidelityCardId")
    public async getBusinessFidelityCard(res: Response, req) {
        try {
            const response = await businessFidelityCardService.getBusinessFidelityCard(parseInt(req.params.businessFidelityCardId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.getBusinessFidelityCard.Error'});
        }
    }

    @Get()
    @Path("/getBusinessFidelityCards/:businessId")
    public async getBusinessFidelityCards(res: Response, req) {
        try {
            const response = await businessFidelityCardService.getBusinessFidelityCards(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.getBusinessFidelityCards.Error'});
        }
    }

    @Post()
    @Path("/checkUserFidelityCardValidity/:userFidelityCardId/:businessId")
    public async checkUserFidelityCardValidity(res: Response, req) {
        try {
            const response = await businessFidelityCardService.checkUserFidelityCardValidity(parseInt(req.params.userFidelityCardId, 10), parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.checkUserFidelityCardValidity.Error'});
        }
    }

    @Post()
    @Path("/resetUserFidelityCardValidity/:userFidelityCardId/:businessId")
    public async resetUserFidelityCardValidity(res: Response, req) {
        try {
            const response = await businessFidelityCardService.resetUserFidelityCardValidity(parseInt(req.params.userFidelityCardId, 10), parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'BusinessFidelityCard.resetUserFidelityCardValidity.Error'});
        }
    }

}