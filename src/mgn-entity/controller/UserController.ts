import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { UserApi } from "../integration/UserApi";
import { UserService } from "../service/UserService";

// services
const userService = new UserService();
const LOG = new Logger("UserController.class");

export class UserController implements UserApi {

    @Get()
    @Path("/getLoggedUser")
    public async getLoggedUser(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userService.getLoggedUser(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'User.getLoggedUser.Error'});
        }
    }

    @Get()
    @Path("/getUserNotifications")
    public async getUserNotifications(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userService.getUserNotifications(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'User.getUserNotifications.Error'});
        }
    }

    @Post()
    @Path("/updateUser")
    public async updateUser(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userService.updateUser(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'User.getLoggedUser.Error'});
        }
    }

    @Post()
    @Path("/deleteUser")
    public async deleteUser(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userService.deleteUser(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'User.getLoggedUser.Error'});
        }
    }

}