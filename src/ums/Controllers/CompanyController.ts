import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { IndroError } from "../../utils/IndroError";
import { AuthService } from "../service/AuthService";
import { CompanyService } from "../service/CompanyService";

// services
const companyService = new CompanyService();
const LOG = new Logger("CompanyController.class");

export class CompanyController {

    @Post()
    @Path("/newCompany")
    public async newCompany(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await companyService.newCompany(req.body, loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Company.NewCompany'});
        }
    }

    @Post()
    @Path("/invite")
    public async invite(res: Response, req) {
        try {
            const response = await companyService.inviteUserInCompany(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Company.Invite'});
        }
    }

    @Get()
    @Path("/invite/:companyId")
    public async getCompany(res: Response, req) {
        try {
            const response = await companyService.getCompanyInfo(parseInt(req.params.companyId, 10));
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Company.GetCompany'});
        }
    }

    @Get()
    @Path("/getUserCompanies")
    public async getUserCompanies(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            console.log('USER ID ', loggedUserId);
            const response = await companyService.getUserCompanies(loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Company.GetUserCompanies'});
        }
    }

    @Post()
    @Path("/updateCompanyDetails/:companyId")
    public async updateCompanyDetails(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await companyService.updateCompanyDetails(req.body, parseInt(req.params.companyId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Company.UpdateCompanyDetails'});
        }
    }

}