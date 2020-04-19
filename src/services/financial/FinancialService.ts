import { Response } from "express";
import { Database } from "../../database";
import { auth } from "../../integration/middleware/index";
import { Logger } from "../../utils/Logger";
import { UserRepository } from "../../repositories/user/UserRepository";
import { SubScriptionReq } from "./classes/SubScriptionReq";
import { PaymentService } from "./PaymentService";
import { User } from "../../models/user/User";

const LOG = new Logger("FinancialService.class");
const userRepository = new UserRepository();
const paymentService = new PaymentService();
const db = new Database();

export class FinancialService {

    public async trySubScription(res: Response, obj: SubScriptionReq) {
        LOG.debug("trySubScription", obj);
        const userLogged = auth.loggedId;

        await db.newTransaction();
        try {
            const user: User = await userRepository.findById(userLogged);
            LOG.debug("user", user.id);
            obj.userId = user.id;
            const subscription = await paymentService.subscribeTo(obj);
            
            LOG.info("new subscription success", subscription.id);
            await db.commit();
            return res.status(200).send(subscription);
        } catch (e) {
            await db.rollback();
            LOG.error("new subscription error", e);
            return res.status(500).send(e);
        }
    }

    public async updateSubScription(subScriptionWebHookEvent) {
        LOG.debug("updateSubScription");
        // const userLogged = auth.loggedId;

        // await db.newTransaction();
        // try {
        //     const user = await userRepository.findById(userLogged);
        //     obj.userId = user.getId();
        //     const subscription = await paymentService.subscribeTo(obj);
            
        //     LOG.info("new subscription success", subscription.getId());
        //     await db.commit();
        // } catch (e) {
        //     await db.rollback();
        //     LOG.error("new subscription error", e);
        // }
    }
}
