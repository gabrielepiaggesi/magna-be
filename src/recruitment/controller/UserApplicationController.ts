import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { UserApplicationService } from "../service/UserApplicationService";
import { Response } from "express";
import { UserApplicationApi } from "../integration/UserApplicationApi";
import { Get, Multer, Path, Post } from "../../utils/Decorator";
import { memoryStorage } from "multer";

const LOG = new Logger("UserApplicationController.class");
const userApplicationService = new UserApplicationService();

const multerConfig = {
    storage: memoryStorage(),
    limits: {
      fileSize: 3 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
};

export class UserApplicationController implements UserApplicationApi {

    @Post()
    @Path("/createUserApplication")
    @Multer({ multerConfig, type: 'multiple' })
    public async createUserApplication(res: Response, req) {
        try {
            const body = JSON.parse(req.body.data);
            const files = req.files;
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.createUserApplication(body, files, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.CreateUserApplication'});
        }
    }

    @Post()
    @Path("/uploadUserTestImage")
    @Multer({ multerConfig, type: 'single', path: 'file' })
    public async uploadUserTestImage(res: Response, req) {
        try {
            const body = JSON.parse(req.body.data);
            const file = req.file;
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.uploadUserTestImage({...body, file}, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.UploadUserTestImage'});
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

    @Get()
    @Path("/getUserTestsImages/:userId/:jobOfferId")
    public async getUserTestsImages(res: Response, req) {
        try {
            const response = await userApplicationService.getUserTestsImages(parseInt(req.params.userId, 10), parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.getUserTestsImages'});
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
    @Path("/createUserTests")
    public async createUserTests(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await userApplicationService.createUserTests(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'UserApplication.CreateUserTests'});
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