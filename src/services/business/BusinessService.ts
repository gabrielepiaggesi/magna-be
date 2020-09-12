import { Response } from "express";
import { auth } from "../../integration/middleware/index";
import { BusinessRepository } from "../../repositories/business/BusinessRepository";
import { Logger } from "../../utils/Logger";

const LOG = new Logger("BusinessService.class");
const businessRepository = new BusinessRepository();
const db = require("../../connection");

export class BusinessService {

    public async getLoggedBusiness(res: Response) {
        const loggedId = auth.loggedId;
        const user = await businessRepository.findById(loggedId);
        delete user.password;
        LOG.debug("user", user);
        return res.status(200).send(user);
    }

    public async getBusiness(res: Response, businessId: number) {
        const user = await businessRepository.findById(businessId);
        delete user.password;
        LOG.debug("user", user);
        return res.status(200).send(user);
    }


    public async updateBusiness(res: Response, obj) {
        const loggedId = auth.loggedId;
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let business = await businessRepository.findById(loggedId, connection);

            business.name = obj.name;
            business.contact = obj.contact;
            business.address = obj.address;
            await businessRepository.update(business, connection);

            business = await businessRepository.findById(loggedId, connection);
            await connection.commit();
            return res.status(200).send(business);
        } catch (e) {
            await connection.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }
}
