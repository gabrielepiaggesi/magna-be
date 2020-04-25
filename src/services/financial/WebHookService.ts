import { Database } from "../../database";
import { Logger } from "../../utils/Logger";
import Stripe from "stripe";
import { WalletService } from "./WalletService";
import { StripeService } from "./StripeService";

const LOG = new Logger("WebHookService.class");
const walletService = new WalletService();
const stripeService = new StripeService();
const db = new Database();

export class WebHookService {

    public async updateSubScriptionWH(res, sub: Stripe.Subscription) {
        LOG.debug("subscription webhook", sub.id);
        sub = await stripeService.getStripeSubscription(sub.id);

        await db.newTransaction();
        try {
            const walletIsUpdated = await walletService.updateUserWallet(sub);
            await db.commit();

            if (sub.status == 'past_due' ||
                sub.status == 'canceled' ||
                sub.status == 'unpaid')
            {
                // notify user
            }

            return res.status(200).send({ status: "success" });
        } catch (e) {
            await db.rollback();
            LOG.error("subscription webhook error", e);
            return res.status(500).send(e);
        }
    }
}
