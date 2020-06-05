import { Response } from "express";
import { auth } from "../../integration/middleware/index";
import { BusinessRepository } from "../../repositories/business/BusinessRepository";
import { Logger } from "../../utils/Logger";

const LOG = new Logger("BusinessService.class");
const businessRepository = new BusinessRepository();
const db = require("../../database");

export class BusinessService {

    public async getLoggedBusiness(res: Response) {
        const loggedId = auth.loggedId;
        const user = await businessRepository.findById(loggedId);
        delete user.password;
        LOG.debug("user", user);
        return res.status(200).send(user);
    }
}
