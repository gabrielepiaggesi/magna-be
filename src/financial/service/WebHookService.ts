import { Logger } from "../../utils/Logger";
import Stripe from "stripe";
import { WalletService } from "./WalletService";
import { StripeService } from "./StripeService";
import { EmailSender } from "../../framework/services/EmailSender";

const LOG = new Logger("WebHookService.class");
const walletService = new WalletService();
const stripeService = new StripeService();
const db = require("../../connection");

export class WebHookService {

    public async updateSubScriptionWH(res, sub: any) {
        LOG.debug("subscription webhook", sub.data.object.id);
        sub = await stripeService.getStripeSubscription(sub.data.object.id);
        const connection = await db.connection();

        await connection.newTransaction();
        try {
            const walletIsUpdated = await walletService.updateUserWallet(sub, connection);
            await connection.commit();
            await connection.release();

            if (sub.status == 'past_due' ||
                sub.status == 'canceled' ||
                sub.status == 'unpaid')
            {
                // notify user
            }

            return res.status(200).send({ status: "success" });
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("subscription webhook error", e);
            return res.status(500).send({ status: "error" });
        }
    }
}
