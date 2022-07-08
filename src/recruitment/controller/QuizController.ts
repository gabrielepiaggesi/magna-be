import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { QuizService } from "../service/QuizService";
import { Response } from "express";
import { QuizApi } from "../integration/QuizApi";
import { Get, Path, Post } from "../../utils/Decorator";

const LOG = new Logger("QuizController.class");
const quizService = new QuizService();

export class QuizController implements QuizApi {

    @Post()
    @Path("/createQuiz")
    public async createQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.createQuiz(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.CreateQuiz'});
        }
    }

    @Post()
    @Path("/updateQuiz/:jQuizId")
    public async updateQuiz(res: Response, req) {
        try {
            const response = await quizService.updateQuiz(req.body, parseInt(req.params.jQuizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.UpdateQuiz'});
        }
    }

    @Post()
    @Path("/createTest")
    public async createTest(res: Response, req) {
        try {
            const response = await quizService.createTest(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.CreateTest'});
        }
    }

    @Post()
    @Path("/updateTest/:testId")
    public async updateTest(res: Response, req) {
        try {
            const response = await quizService.updateTest(req.body, parseInt(req.params.testId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.UpdateTest'});
        }
    }

    @Post()
    @Path("/editTestOption/:optionId")
    public async editTestOption(res: Response, req) {
        try {
            const response = await quizService.editTestOption(req.body, parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.EditTestOption'});
        }
    }

    @Post()
    @Path("/removeTestOption/:optionId")
    public async removeTestOption(res: Response, req) {
        try {
            const response = await quizService.removeTestOption(parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.RemoveTestOption'});
        }
    }

    @Post()
    @Path("/editTestText/:textId")
    public async editTestText(res: Response, req) {
        try {
            const response = await quizService.editTestText(req.body, parseInt(req.params.textId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.EditTestText'});
        }
    }

    @Post()
    @Path("/removeTestText/:textId")
    public async removeTestText(res: Response, req) {
        try {
            const response = await quizService.removeTestText(parseInt(req.params.textId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.RemoveTestText'});
        }
    }

    @Post()
    @Path("/createNewTestImage/:testId")
    public async createNewTestImage(res: Response, req) {
        try {
            const response = await quizService.createNewTestImage(req.body, parseInt(req.params.testId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.CreateNewTestImage'});
        }
    }

    @Post()
    @Path("/removeTestImage/:imageId")
    public async removeTestImage(res: Response, req) {
        try {
            const response = await quizService.removeTestImage(parseInt(req.params.imageId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.RemoveTestImage'});
        }
    }

    @Get()
    @Path("/getTest/:testId")
    public async getTest(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.getTest(parseInt(req.params.testId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetTest'});
        }
    }

    @Get()
    @Path("/getQuiz/:quizId")
    public async getQuiz(res: Response, req) {
        try {
            const response = await quizService.getQuiz(parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetQuiz'});
        }
    }

    @Get()
    @Path("/getJobOfferQuizs/:jobOfferId")
    public async getJobOfferQuizs(res: Response, req) {
        try {
            const response = await quizService.getJobOfferQuizs(parseInt(req.params.jobOfferId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetQuiz'});
        }
    }

    @Post()
    @Path("/createNewTestOption/:testId")
    public async createNewTestOption(res: Response, req) {
        try {
            const response = await quizService.createNewTestOption(req.body, parseInt(req.params.testId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.createNewTestOption'});
        }
    }

    @Post()
    @Path("/createNewTestText/:testId")
    public async createNewTestText(res: Response, req) {
        try {
            const response = await quizService.createNewTestText(req.body, parseInt(req.params.testId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.createNewTestText'});
        }
    }

}