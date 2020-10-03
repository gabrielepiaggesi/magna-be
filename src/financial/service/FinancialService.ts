import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { SubScriptionReq } from "./classes/SubScriptionReq";
import { PaymentService } from "./PaymentService";
import { SubScription } from "../model/SubScription";
import { SubScriptionRepository } from "../repository/SubScriptionRepository";
import Stripe from "stripe";
import { TransactionRepository } from "../repository/TransactionRepository";
import { Transaction } from "../model/Transaction";
import { CardRepository } from "../repository/CardRepository";
import { Card } from "../model/Card";
import { UserRepository } from "../../ums/repository/UserRepository";
import { auth } from "../../framework/integrations/middleware";
import { User } from "../../ums/model/User";

const LOG = new Logger("FinancialService.class");
const userRepository = new UserRepository();
const paymentService = new PaymentService();
const subScriptionRepository = new SubScriptionRepository();
const transactionRepository = new TransactionRepository();
const cardRepository = new CardRepository();
const db = require("../../connection");

export class FinancialService {

    public async payUserSubScription(res: Response, obj: SubScriptionReq) {
        LOG.debug("payUserSubScription", obj);
        const userLogged = auth.loggedId;
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            const user: User = await userRepository.findById(userLogged, connection);
            LOG.debug("user", user.id);
            obj.userId = user.id;
            const subscription = await paymentService.subscribeTo(obj, connection);
            
            await connection.commit();
            await connection.release();
            return res.status(200).send(subscription);
        } catch (e) {
            await connection.rollback();
            await connection.release();
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

        const connection = await db.connection();
        let userSub: SubScription = await subScriptionRepository.findCurrentSubForUser(userLogged, planId, connection);
        await connection.release();
        userSub = userSub || new SubScription();
        return res.status(200).send(userSub);
    }

    public async getUserTransactions(res) {
        LOG.debug("getUserTransactions");
        const userLogged = auth.loggedId;
        const connection = await db.connection();
        let userTras: Transaction[] = await transactionRepository.findByUser(userLogged, connection);
        await connection.release();
        return res.status(200).send(userTras);
    }

    public async getUserCards(res) {
        LOG.debug("getUserCards");
        const userLogged = auth.loggedId;
        const connection = await db.connection();
        let userTras: Card[] = await cardRepository.findByUserId(userLogged, connection);
        await connection.release();
        return res.status(200).send(userTras);
    }

}
