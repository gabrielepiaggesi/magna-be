import { Response } from "express";
import { Database } from "../../database";
import { auth } from "../../integration/middleware/index";
import { Logger } from "../../utils/Logger";
import { UserRepository } from "../../repositories/user/UserRepository";
import { SubScriptionReq } from "./classes/SubScriptionReq";
import { PaymentService } from "./PaymentService";
import { User } from "../../models/user/User";
import { SubScription } from "../../models/financial/SubScription";
import { SubScriptionRepository } from "../../repositories/financial/SubScriptionRepository";

const LOG = new Logger("FinancialService.class");
const userRepository = new UserRepository();
const paymentService = new PaymentService();
const subScriptionRepository = new SubScriptionRepository();
const db = new Database();

export class FinancialService {

    public async payUserSubScription(res: Response, obj: SubScriptionReq) {
        LOG.debug("payUserSubScription", obj);
        const userLogged = auth.loggedId;

        await db.newTransaction();
        try {
            const user: User = await userRepository.findById(userLogged);
            LOG.debug("user", user.id);
            obj.userId = user.id;
            const subscription = await paymentService.subscribeTo(obj);
            
            await db.commit();
            return res.status(200).send(subscription);
        } catch (e) {
            await db.rollback();
            LOG.error("new subscription error", e);
            return res.status(500).send(e);
        }
    }

    public async getUserSubScription(res, planId) {
        LOG.debug("getUserSubScription");
        const userLogged = auth.loggedId;

        let userSub: SubScription = await subScriptionRepository.findByUserIdAndPlanId(userLogged, planId);
        userSub = userSub || new SubScription();
        return res.status(200).send(userSub);
    }

}
