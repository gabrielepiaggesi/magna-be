import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { BusinessApi } from "../integration/BusinessApi";
import { BusinessService } from "../service/BusinessService";
import { InsightService } from "../service/InsightService";

// services
const businessService = new BusinessService();
const insightService = new InsightService();
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

    @Get()
    @Path("/getTotalUsers")
    public async getTotalUsers(res: Response, req) {
        try {
            const response = await insightService.getTotalUsers();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalUsers.Error'});
        }
    }

    @Get()
    @Path("/getTotalFidelitiesCards")
    public async getTotalFidelitiesCards(res: Response, req) {
        try {
            const response = await insightService.getTotalFidelitiesCards();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalFidelitiesCards.Error'});
        }
    }

    @Get()
    @Path("/getTotalBusinesses")
    public async getTotalBusinesses(res: Response, req) {
        try {
            const response = await insightService.getTotalBusinesses();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalBusinesses.Error'});
        }
    }

    @Get()
    @Path("/getTotalReservations")
    public async getTotalReservations(res: Response, req) {
        try {
            const response = await insightService.getTotalReservations();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalReservations.Error'});
        }
    }

    @Get()
    @Path("/getTotalReservationsToday")
    public async getTotalReservationsToday(res: Response, req) {
        try {
            const response = await insightService.getTotalReservationsToday();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalReservationsToday.Error'});
        }
    }

    @Get()
    @Path("/getTotalReviews")
    public async getTotalReviews(res: Response, req) {
        try {
            const response = await insightService.getTotalReviews();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalReviews.Error'});
        }
    }

    @Get()
    @Path("/getTotalReviewsToday")
    public async getTotalReviewsToday(res: Response, req) {
        try {
            const response = await insightService.getTotalReviewsToday();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Business.getTotalReviewsToday.Error'});
        }
    }
}