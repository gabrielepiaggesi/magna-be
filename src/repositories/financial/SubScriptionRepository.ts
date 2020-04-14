import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { SubScription } from "../../models/financial/SubScription";

export class SubScriptionRepository extends Repository<SubScription> {
    public table = "subscriptions";

    public async findByUserId(userId, query = null) {
        const q = `select * from subscriptions where user_id = ${userId}`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}
