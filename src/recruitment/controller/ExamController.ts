import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { ExamApi } from "../integration/ExamApi";
import { ExamService } from "../service/ExamService";

// services
const examService = new ExamService();
const LOG = new Logger("ExamController.class");

export class ExamController implements ExamApi {

    @Post()
    @Path("/createExam")
    public async createExam(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await examService.createExam(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.createExam'});
        }
    }

    @Post()
    @Path("/updateExam/:examId")
    public async updateExam(res: Response, req) {
        try {
            const response = await examService.updateExam(req.body, parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.updateExam'});
        }
    }

    @Post()
    @Path("/editExamSkill/:skillId")
    public async updateExamSkill(res: Response, req) {
        try {
            const response = await examService.updateExamSkill(req.body, parseInt(req.params.skillId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.updateExamSkill'});
        }
    }

    @Post()
    @Path("/addExamSkill")
    public async addExamSkill(res: Response, req) {
        try {
            const response = await examService.addExamSkill(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.addExamSkill'});
        }
    }

    @Post()
    @Path("/addQuizsToExam/:examId")
    public async addQuizsToExam(res: Response, req) {
        try {
            const response = await examService.addQuizsToExam(parseInt(req.params.examId, 10), req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.addQuizsToExam'});
        }
    }

    @Post()
    @Path("/removeExamSkill/:skillId")
    public async removeExamSkill(res: Response, req) {
        try {
            const response = await examService.removeExamSkill(parseInt(req.params.skillId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.removeExamSkill'});
        }
    }

    @Get()
    @Path("/getExams/:companyId/:status")
    public async getExams(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await examService.getExams(parseInt(req.params.companyId, 10), req.params.status.toString().toUpperCase());
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExams'});
        }
    }

    @Get()
    @Path("/getUserData/:userId/:examId")
    public async getUserData(res: Response, req) {
        try {
            const response = await examService.getUserData(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getUserData'});
        }
    }

    @Get()
    @Path("/getExamUserReport/:userId/:examId")
    public async getExamUserReport(res: Response, req) {
        try {
            const response = await examService.getExamUserReport(parseInt(req.params.userId, 10), parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamUserReport'});
        }
    }

    @Get()
    @Path("/getExam/:examId")
    public async getExam(res: Response, req) {
        try {
            const response = await examService.getExam(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExam'});
        }
    }

    @Get()
    @Path("/getExamFromLink/:linkUUID")
    public async getExamFromLink(res: Response, req) {
        try {
            const response = await examService.getExamFromLink(req.params.linkUUID.toString());
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamFromLink'});
        }
    }

    @Get()
    @Path("/getExamSkills/:examId")
    public async getExamSkills(res: Response, req) {
        try {
            const response = await examService.getExamSkills(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamSkills'});
        }
    }

    @Get()
    @Path("/getUsersDataOptions")
    public async getUsersDataOptions(res: Response, req) {
        try {
            const response = await examService.getUsersDataOptions();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.GetUsersDataOptions'});
        }
    }

    @Post()
    @Path("/setExamUserData/:examId")
    public async setExamUserData(res: Response, req) {
        try {
            const response = await examService.setExamUserData(req.body, parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.setExamUserData'});
        }
    }

    @Get()
    @Path("/getExamUserData/:examId")
    public async getExamUserData(res: Response, req) {
        try {
            const response = await examService.getExamUserData(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamUserData'});
        }
    }

    @Post()
    @Path("/addExamUserData/:examId/:optionId")
    public async addExamUserData(res: Response, req) {
        try {
            const response = await examService.addExamUserData(parseInt(req.params.examId, 10), parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.addExamUserData'});
        }
    }

    @Post()
    @Path("/removeExamUserData/:examId/:optionId")
    public async removeExamUserData(res: Response, req) {
        try {
            const response = await examService.removeExamUserData(parseInt(req.params.examId, 10), parseInt(req.params.optionId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.removeExamUserData'});
        }
    }

    @Post()
    @Path("/removeExam/:examId")
    public async removeExam(res: Response, req) {
        try {
            const response = await examService.removeExam(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.removeExam'});
        }
    }

    @Post()
    @Path("/addQuizToExam/:examId/:quizId/:companyId")
    public async addQuizToExam(res: Response, req) {
        try {
            const response = await examService.addQuizToExam(parseInt(req.params.examId, 10), parseInt(req.params.quizId, 10), parseInt(req.params.companyId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.addQuizToExam'});
        }
    }

    @Post()
    @Path("/removeExamQuiz/:examId/:quizId")
    public async removeExamQuiz(res: Response, req) {
        try {
            const response = await examService.removeExamQuiz(parseInt(req.params.examId, 10), parseInt(req.params.quizId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.removeExamQuiz'});
        }
    }

    @Get()
    @Path("/getExamUserApplicationsList/:examId")
    public async getExamUserApplicationsList(res: Response, req) {
        try {
            const response = await examService.getExamUserApplicationsList(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamUserApplicationsList'});
        }
    }

    @Get()
    @Path("/getExamQuizs/:examId")
    public async getExamQuizs(res: Response, req) {
        try {
            const response = await examService.getExamQuizs(parseInt(req.params.examId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Exam.getExamQuizs'});
        }
    }

}