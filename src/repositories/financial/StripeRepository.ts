import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { UserStripe } from "../../models/financial/UserStripe";
const db = require("../../connection");
import mysql from "mysql";

export class StripeRepository extends Repository<UserStripe> {
    public table = "stripes";

    public async findByUserId(userId: number, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from stripes where user_id = ${userId} and deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async findByCustomerId(cId, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from stripes where customer_id = ${mysql.escape(cId)} and deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }
}
