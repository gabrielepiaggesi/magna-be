import { Logger } from "../../utils/Logger";
import { PaymentService } from "./PaymentService";
import { SubScription } from "../model/SubScription";
import { SubScriptionRepository } from "../repository/SubScriptionRepository";
import Stripe from "stripe";
import { UserStripe } from "../model/UserStripe";
import { StripeRepository } from "../repository/StripeRepository";
import { Plan } from "../model/Plan";
import { PlanRepository } from "../repository/PlanRepository";
import { PaymentStatus } from "./classes/PaymentStatus";
import { StripeService } from "./StripeService";
import { Transaction } from "../model/Transaction";
import { TransactionRepository } from "../repository/TransactionRepository";
import { OperationSign } from "./classes/OperationSign";
import { UserRepository } from "../../ums/repository/UserRepository";
import { UserStatus } from "../../ums/service/classes/UserStatus";
import { EmailSender } from "../../framework/services/EmailSender";
import { User } from "../../ums/model/User";

const LOG = new Logger("WalletService.class");
const userRepository = new UserRepository();
const subScriptionRepository = new SubScriptionRepository();
const transactionRepository = new TransactionRepository();
const stripeRepository = new StripeRepository();
const planRepository = new PlanRepository();
const stripeService = new StripeService();
const db = require("../../connection");

export class WalletService {

    public async updateUserWallet(sub: Stripe.Subscription, conn): Promise<SubScription> {
        let userStripe: UserStripe = await stripeRepository.findByCustomerId(sub.customer.toString(), conn);
        let userPlan: Plan = await planRepository.findByStripePlanId(sub.plan.id, conn);
        const user = await userRepository.findById(userStripe.user_id, conn);

        let inv = await stripeService.getStripeInvoice(sub.latest_invoice['id']);
        let pi = await stripeService.getStripePaymentIntent(sub.latest_invoice['payment_intent']['id']);
        inv = inv || null;
        pi = pi || null;
        
        if (userStripe) {
            const userSubUpdated = await this.updateUserSubScription(user, userPlan.id, sub, inv, pi, conn);
            await this.updateUserTransaction(user, userPlan.id, sub, inv, pi, conn);
            return userSubUpdated;
        } else {
            LOG.error('no stripe user found on db!', sub.customer.toString());
            return new SubScription();
        }
    }

    private async updateUserSubScription(user: User, planId, sub: Stripe.Subscription, inv: Stripe.Invoice, pi: Stripe.PaymentIntent, conn) {
        const now = new Date(Date.now());
        let userSub: SubScription = await subScriptionRepository.findByUserIdAndPlanId(user.id, planId, conn);
        userSub = userSub || new SubScription();
        
        userSub.subscription_id = sub.id;
        userSub.user_id = user.id;
        userSub.plan_id = planId;
        userSub.status = (pi.status == 'succeeded') ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        userSub.resume_status = sub.status + '.' + inv.status + '.' + pi.status;
        userSub.subscription_status = sub.status;
        userSub.last_renew = now.toISOString();
        userSub.next_renew = new Date((now.setMonth(now.getMonth() + 1))).toISOString();

        if (userSub.id) {
            const userSubUpdated = await await subScriptionRepository.update(userSub, conn);
        } else {
            const userSubInserted = await subScriptionRepository.save(userSub, conn);
            userSub.id = userSubInserted.insertId;
            LOG.info('new subscription', userSubInserted.insertId);
        }

        user.status = (userSub.status == PaymentStatus.SUCCESS) ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
        const userUpdated = await userRepository.update(user, conn);
        return userSub;
    }

    private async updateUserTransaction(user: User, planId, sub: Stripe.Subscription, inv: Stripe.Invoice, pi: Stripe.PaymentIntent, conn) {
        let tra: Transaction = await transactionRepository.findByPaymentIntentId(pi.id, conn);
        tra = tra || new Transaction();
        
        tra.user_id = user.id;
        tra.stripe_sub_id = sub.id || null;
        tra.stripe_payment_id = pi.id || null;
        tra.stripe_invoice_id = inv.id || null;
        tra.stripe_sub_status = sub.status;
        tra.stripe_payment_status = pi.status;
        tra.stripe_invoice_status = inv.status;
        tra.status = (tra.stripe_payment_status == 'succeeded') ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
        tra.currency = 'EUR';
        tra.amount = pi.amount / 100;
        tra.invoice_pdf_url = inv.invoice_pdf;
        tra.stripe_payment_method = pi.payment_method.toString();
        tra.operation_sign = OperationSign.NEGATIVE;
        tra.operation_resume = -tra.amount;

        if (tra.id) {
            const traUpdated = await transactionRepository.update(tra, conn);
        } else {
            const traInserted = await transactionRepository.save(tra, conn);
            tra.id = traInserted.insertId;
            EmailSender.sendNewRenewMessage({ email: user.email, params: { paymentValue: (pi.amount / 100), subscription_id: tra.stripe_sub_id, invoice_pdf_url: tra.invoice_pdf_url } });
            LOG.info('new transaction', traInserted.insertId);
        }

        return tra;
    }
}
