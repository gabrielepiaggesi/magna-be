import { Repository } from "../Repository";
import { SubScription } from "../../models/financial/SubScription";
const db = require("../../connection");

export class SubScriptionRepository extends Repository<SubScription> {
    public table = "subscriptions";

    public async findCurrentSubForUser(userId: number, planId: number, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from subscriptions sub 
        inner join plans plan on plan.id = sub.plan_id 
        where sub.user_id = ${userId} and sub.plan_id = ${planId} and sub.subscription_status not in ("canceled", "unpaid") and sub.deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async findByUserIdAndPlanId(userId: number, planId: number, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from subscriptions where user_id = ${userId} and plan_id = ${planId} and subscription_status not in ("canceled", "unpaid") and deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }
}
