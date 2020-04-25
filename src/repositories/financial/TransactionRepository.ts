import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { Transaction } from "../../models/financial/Transaction";

export class TransactionRepository extends Repository<Transaction> {
    public table = "transactions";

    public async findByPaymentIntentId(piId, query = null) {
        const q = `select * from transactions where stripe_payment_id = "${piId}" and deleted_at is null order by id desc limit 1`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async findLastOfUserIdAndSubId(userId, subId, query = null) {
        const q = `select * from transactions where user_id = ${userId} and stripe_sub_id = "${subId}" and deleted_at is null order by id desc limit 1`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

}
