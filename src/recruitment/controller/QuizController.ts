import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { QuizService } from "../service/QuizService";
import { Response } from "express";
import { QuizApi } from "../integration/QuizApi";
import { Get, Multer, Path, Post } from "../../utils/Decorator";
import { memoryStorage } from "multer";

const LOG = new Logger("QuizController.class");
const quizService = new QuizService();

const multerConfig = {
    storage: memoryStorage(),
    limits: {
      fileSize: 3 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
};

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
    @Path("/updateQuizAndJobOfferQuiz/:jQuizId")
    public async updateQuizAndJobOfferQuiz(res: Response, req) {
        try {
            const response = await quizService.updateQuizAndJobOfferQuiz(req.body, parseInt(req.params.jQuizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.updateQuizAndJobOfferQuiz'});
        }
    }

    @Post()
    @Path("/updateQuiz/:quizId")
    public async updateQuiz(res: Response, req) {
        try {
            const response = await quizService.updateQuiz(req.body, parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.updateQuiz'});
        }
    }

    @Post()
    @Path("/createTest")
    @Multer({ multerConfig, path: 'file' })
    public async createTest(res: Response, req) {
        try {
            const body = JSON.parse(req.body.data);
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.createTest({...body, file: req.file || null}, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.CreateTest'});
        }
    }

    @Post()
    @Path("/updateTest/:testId")
    @Multer({ multerConfig, path: 'file' })
    public async updateTest(res: Response, req) {
        try {
            const body = JSON.parse(req.body.data);
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.updateTest({ test: {...body}, file: req.file || body.file || null}, parseInt(req.params.testId, 10), loggedUserId);
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
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.createNewTestImage({...req.body, newFile: req.file}, parseInt(req.params.testId, 10), loggedUserId);
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
    @Path("/getQuizs/:companyId")
    public async getQuizs(res: Response, req) {
        try {
            const response = await quizService.getQuizs(parseInt(req.params.companyId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.getQuizs'});
        }
    }

    @Get()
    @Path("/getJobOfferQuiz/:jobOfferQuizId")
    public async getJobOfferQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.getJobOfferQuiz(parseInt(req.params.jobOfferQuizId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetQuiz'});
        }
    }

    @Get()
    @Path("/getExamQuiz/:examQuizId")
    public async getExamQuiz(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.getExamQuiz(parseInt(req.params.examQuizId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.getExamQuiz'});
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
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.getQuiz'});
        }
    }

    @Get()
    @Path("/getJobOfferQuizs/:jobOfferId")
    public async getJobOfferQuizs(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.getJobOfferQuizs(parseInt(req.params.jobOfferId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetQuiz'});
        }
    }

    @Get()
    @Path("/getExamQuizs/:examId")
    public async getExamQuizs(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await quizService.getExamQuizs(parseInt(req.params.examId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.GetQuiz'});
        }
    }

    @Post()
    @Path("/resetQuizTestsPoints/:quizId")
    public async resetQuizTestsPoints(res: Response, req) {
        try {
            const response = await quizService.resetQuizTestsPoints(parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.resetQuizTestsPoints'});
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
    @Path("/removeTest/:testId/:quizId")
    public async removeTest(res: Response, req) {
        try {
            const response = await quizService.removeTest(parseInt(req.params.testId, 10), parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.removeTest'});
        }
    }

    @Post()
    @Path("/removeQuiz/:quizId")
    public async removeQuiz(res: Response, req) {
        try {
            const response = await quizService.removeQuiz(parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Quiz.removeQuiz'});
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