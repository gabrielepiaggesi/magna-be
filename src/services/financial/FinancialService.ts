import { Response } from "express";
import { auth } from "../../integration/middleware/index";
import { Logger } from "../../utils/Logger";
import { BusinessRepository } from "../../repositories/business/BusinessRepository";
import { SubScriptionReq } from "./classes/SubScriptionReq";
import { PaymentService } from "./PaymentService";
import { SubScription } from "../../models/financial/SubScription";
import { SubScriptionRepository } from "../../repositories/financial/SubScriptionRepository";
import Stripe from "stripe";
import { TransactionRepository } from "../../repositories/financial/TransactionRepository";
import { Transaction } from "../../models/financial/Transaction";
import { CardRepository } from "../../repositories/financial/CardRepository";
import { Card } from "../../models/financial/Card";
import { Business } from "../../models/business/Business";

const LOG = new Logger("FinancialService.class");
const userRepository = new BusinessRepository();
const paymentService = new PaymentService();
const subScriptionRepository = new SubScriptionRepository();
const transactionRepository = new TransactionRepository();
const cardRepository = new CardRepository();
const db = require("../../database");

export class FinancialService {

    public async payUserSubScription(res: Response, obj: SubScriptionReq) {
        LOG.debug("payUserSubScription", obj);
        const userLogged = auth.loggedId;

        await db.newTransaction();
        try {
            const user: Business = await userRepository.findById(userLogged);
            LOG.debug("user", user.id);
            obj.userId = user.id;
            const subscription = await paymentService.subscribeTo(obj);
            
            await db.commit();
            return res.status(200).send(subscription);
        } catch (e) {
            await db.rollback();
            LOG.error("new subscription error", e);
            let msg = (e.message) ? e.message : null;
            let error_code = (e.code) ? e.code : null;
            let decline_code = (e.decline_code) ? e.decline_code : null;
            return res.status(500).send({msg, error_code, decline_code});
        }
    }

    public async getUserSubScription(res, planId) {
        LOG.debug("getUserSubScription");
        const userLogged = auth.loggedId;

        let userSub: SubScription = await subScriptionRepository.findCurrentSubForUser(userLogged, planId);
        userSub = userSub || new SubScription();
        return res.status(200).send(userSub);
    }

    public async getUserTransactions(res) {
        LOG.debug("getUserTransactions");
        const userLogged = auth.loggedId;
        let userTras: Transaction[] = await transactionRepository.findByUser(userLogged);
        return res.status(200).send(userTras);
    }

    public async getUserCards(res) {
        LOG.debug("getUserCards");
        const userLogged = auth.loggedId;
        let userTras: Card[] = await cardRepository.findByUserId(userLogged);
        return res.status(200).send(userTras);
    }

}
