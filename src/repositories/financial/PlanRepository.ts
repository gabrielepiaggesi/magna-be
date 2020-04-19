import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
import { Plan } from "../../models/financial/Plan";

export class PlanRepository extends Repository<Plan> {
    public table = "plans";

    public async findByTag(tag, query = null) {
        const q = `select * from plans where tag = "${tag}"`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}
