import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { Transaction } from "../../models/financial/Transaction";

export class TransactionRepository extends Repository<Transaction> {
    public table = "transactions";

    public async findByUser(userId, query = null) {
        query = `
        select tra.* as transaction, sub.* as subscription, plan.* as plan 
        from transactions tra 
        inner join subscriptions sub on sub.subscription_id = tra.stripe_sub_id and sub.deleted_at is null 
        inner join cards card on card.payment_method_id = tra.stripe_payment_method and card.deleted_at is null 
        inner join plans plan on plan.id = sub.plan_id and plan.deleted_at is null 
        where tra.user_id = ${userId} 
        and tra.deleted_at is null 
        order by tra.created_at desc limit 10 
        `;
        return await this.db.query(query).then((results) => results);
    }

    public async findByPaymentIntentId(piId, query = null) {
        const q = `select * from transactions where stripe_payment_id = "${piId}" and deleted_at is null order by id desc limit 1`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async findLastOfUserIdAndSubId(userId, subId, query = null) {
        const q = `select * from transactions where user_id = ${userId} and stripe_sub_id = "${subId}" and deleted_at is null order by id desc limit 1`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

}
