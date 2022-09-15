import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserSocialPostApi } from "../integration/UserSocialPostApi";
import { UserSocialPostService } from "../service/UserSocialPostService";

// services
const userSocialPostService = new UserSocialPostService();
const LOG = new Logger("UserSocialPostController.class");

export class UserSocialPostController implements UserSocialPostApi {

    @Get()
    @Path("/getBusinessSocialPosts/:businessId")
    public async getBusinessSocialPosts(res: Response, req) {
        try {
            const response = await userSocialPostService.getBusinessSocialPosts(parseInt(req.params.businessId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.getBusinessSocialPosts.Error'});
        }
    }

    @Post()
    @Path("/approveSocialPost/:userSocialPostId")
    public async approveSocialPost(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userSocialPostService.approveSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.approveSocialPost.Error'});
        }
    }

    @Post()
    @Path("/discardSocialPost/:userSocialPostId")
    public async discardSocialPost(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userSocialPostService.discardSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.discardSocialPost.Error'});
        }
    }

    @Post()
    @Path("/sendSocialPost/:businessId")
    public async sendSocialPost(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userSocialPostService.sendSocialPost(req.body, parseInt(req.params.businessId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.sendSocialPost.Error'});
        }
    }

    @Get()
    @Path("/getUserSocialPosts")
    public async getUserSocialPosts(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userSocialPostService.getUserSocialPosts(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.getUserSocialPosts.Error'});
        }
    }

    @Get()
    @Path("/getUserSocialPost/:userSocialPostId")
    public async getUserSocialPost(res: Response, req) {
        try {
            const response = await userSocialPostService.getUserSocialPost(parseInt(req.params.userSocialPostId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.getUserSocialPost.Error'});
        }
    }

    @Post()
    @Path("/deleteUserSocialPost/:userSocialPostId")
    public async deleteUserSocialPost(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userSocialPostService.deleteUserSocialPost(parseInt(req.params.userSocialPostId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserSocialPost.deleteUserSocialPost.Error'});
        }
    }

}