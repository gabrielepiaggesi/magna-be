import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { UserStripe } from "../../models/financial/UserStripe";

export class StripeRepository extends Repository<UserStripe> {
    public table = "stripes";

    public async findByUserId(userId, query = null) {
        const q = `select * from stripes where user_id = ${userId} and deleted_at is null`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async findByCustomerId(cId, query = null) {
        const q = `select * from stripes where customer_id = "${cId}" and deleted_at is null`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}