import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { SubScription } from "../../models/financial/SubScription";

export class SubScriptionRepository extends Repository<SubScription> {
    public table = "subscriptions";

    public async findByUserIdAndPlanId(userId, planId, query = null) {
        const q = `select * from subscriptions where user_id = ${userId} and plan_id = ${planId}`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}
