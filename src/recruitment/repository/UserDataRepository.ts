import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserData } from "../model/UserData";

export class UserDataRepository extends Repository<UserData> {
    public table = "users_data";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndJobOfferId(userId: number, jobOfferId: number, conn,  query = null): Promise<UserData[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where user_id = ${mysql2.escape(userId)} and job_offer_id = ${mysql2.escape(jobOfferId)} and deleted_at is null`)
            .then((results) => results);
    }
}
