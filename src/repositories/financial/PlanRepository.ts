import { Repository } from "../Repository";
import { Plan } from "../../models/financial/Plan";
const db = require("../../database");
import mysql from "mysql";

export class PlanRepository extends Repository<Plan> {
    public table = "plans";

    public async findByStripePlanId(stripeId, query = null) {
        const q = `select * from plans where stripe_plan_id = ${mysql.escape(stripeId)} and deleted_at is null`;
        return await db.query(query || q).then((results) => results[0]);
    }
}
