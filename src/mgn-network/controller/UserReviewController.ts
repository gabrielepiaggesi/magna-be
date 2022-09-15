import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserReviewApi } from "../integration/UserReviewApi";
import { UserReviewService } from "../service/UserReviewService";

// services
const userReviewService = new UserReviewService();
const LOG = new Logger("UserReviewController.class");

export class UserReviewController implements UserReviewApi {

    @Get()
    @Path("/getBusinessReviews/:businessId")
    public async getBusinessReviews(res: Response, req) {
        try {
            const response = await userReviewService.getBusinessReviews(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReview.getBusinessReviews.Error'});
        }
    }

    @Get()
    @Path("/getUserReviews")
    public async getUserReviews(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userReviewService.getUserReviews(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReview.getUserReviews.Error'});
        }
    }

    @Post()
    @Path("/addBusinessReview/:businessId")
    public async addBusinessReview(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userReviewService.addBusinessReview(req.body, parseInt(req.params.businessId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReview.addBusinessReview.Error'});
        }
    }
    
    @Post()
    @Path("/deleteUserReview/:userReviewId")
    public async deleteUserReview(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userReviewService.deleteUserReview(parseInt(req.params.userReviewId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserReview.deleteUserReview.Error'});
        }
    }

}