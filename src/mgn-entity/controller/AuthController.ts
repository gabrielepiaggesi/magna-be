import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { AuthApi } from "../integration/AuthApi";
import { AuthService } from "../service/AuthService";

// services
const authService = new AuthService();
const LOG = new Logger("AuthController.class");

export class AuthController implements AuthApi {

    @Post()
    @Path("/login")
    public async login(res: Response, req) {
        try {
            const response = await authService.login(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Auth.Login.Error'});
        }
    }

    @Post()
    @Path("/signup")
    public async signup(res: Response, req) {
        try {
            const response = await authService.signup(req.body);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Auth.Signup.Error'});
        }
    }

    @Get()
    @Path("/appVersion")
    public async appVersion(res: Response, req) {
        try {
            const response = await authService.appVersion();
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Auth.appVersion.Error'});
        }
    }

}