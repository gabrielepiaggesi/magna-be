import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { UserApplicationService } from "../service/UserApplicationService";
import { Response } from "express";
import { UserApplicationApi } from "../integration/UserApplicationApi";
import { Get, Path, Post } from "../../utils/Decorator";

const LOG = new Logger("UserApplicationController.class");
const userApplicationService = new UserApplicationService();

export class UserApplicationController implements UserApplicationApi {

    @Post()
    @Path("/createUserApplication")
    public async createUserApplication(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.createUserApplication(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.CreateUserApplication'});
        }
    }

    @Get()
    @Path("/getUserApplication/:userId/:jobOfferId")
    public async getUserApplication(res: Response, req) {
        try {
            const response = await userApplicationService.getUserApplication(parseInt(req.params.userId, 10), parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.GetUserApplication'});
        }
    }

    @Post()
    @Path("/createUserQuiz")
    public async createUserQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.createUserQuiz(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.CreateUserQuiz'});
        }
    }

    @Post()
    @Path("/createUserTest")
    public async createUserTest(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.createUserTest(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.CreateUserTest'});
        }
    }

    @Post()
    @Path("/updateUserTest/:userTestId")
    public async updateUserTest(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.updateUserTest(req.body, parseInt(req.params.userTestId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.UpdateUserTest'});
        }
    }

    @Post()
    @Path("/confirmAndSendUserQuiz/:userQuizId")
    public async confirmAndSendUserQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.confirmAndSendUserQuiz(parseInt(req.params.userQuizId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.ConfirmAndSendUserQuiz'});
        }
    }

    @Post()
    @Path("/getUserQuiz/:quizId/:jobOfferId")
    public async getUserQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.getUserQuiz(parseInt(req.params.quizId, 10), parseInt(req.params.jobOfferId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.GetUserQuiz'});
        }
    }

}