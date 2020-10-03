import { Repository } from "../../framework/repositories/Repository";
import { Transaction } from "../model/Transaction";
const db = require("../../connection");
import mysql from "mysql";

export class TransactionRepository extends Repository<Transaction> {
    public table = "transactions";

    public async findByUser(userId: number, conn = null, query = null) {
        const c = conn || await db.connection();
        query = `
        select tra.amount, 
        tra.operation_resume, 
        tra.created_at, 
        tra.stripe_payment_status, 
        tra.stripe_invoice_status, 
        tra.invoice_pdf_url, 
        tra.status as tra_status, 
        tra.stripe_payment_method as tra_payment_method_id, 
        tra.id as tra_id, 
        card.id as card_id,
        card.last_4, 
        card.payment_method_id as card_payment_method_id, 
        plan.title, 
        plan.id as plan_id,
        sub.subscription_id as sub_stripe_subscription_id,
        sub.id as sub_id 
        from transactions tra 
        inner join subscriptions sub on sub.subscription_id = tra.stripe_sub_id and sub.deleted_at is null 
        inner join cards card on card.payment_method_id = tra.stripe_payment_method and card.deleted_at is null 
        inner join plans plan on plan.id = sub.plan_id and plan.deleted_at is null 
        where tra.user_id = ${userId} 
        and tra.deleted_at is null 
        order by tra.created_at desc limit 10 
        `;
        return await c.query(query).then((results) => results);
    }

    public async findByPaymentIntentId(piId, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from transactions where stripe_payment_id = ${mysql.escape(piId)} and deleted_at is null order by id desc limit 1`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async findLastOfUserIdAndSubId(userId: number, subId, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from transactions where user_id = ${userId} and stripe_sub_id = ${mysql.escape(subId)} and deleted_at is null order by id desc limit 1`;
        return await c.query(query || q).then((results) => results[0]);
    }

}
