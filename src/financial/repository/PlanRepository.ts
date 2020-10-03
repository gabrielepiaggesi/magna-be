import { Repository } from "../../framework/repositories/Repository";
import { Plan } from "../model/Plan";
const db = require("../../connection");
import mysql from "mysql";

export class PlanRepository extends Repository<Plan> {
    public table = "plans";

    public async findByStripePlanId(stripeId, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from plans where stripe_plan_id = ${mysql.escape(stripeId)} and deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }
}
