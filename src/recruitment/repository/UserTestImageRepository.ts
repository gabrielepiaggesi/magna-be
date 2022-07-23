import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserTestImage } from "../model/UserTestImage";

export class UserTestImageRepository extends Repository<UserTestImage> {
    public table = "users_tests_images";

    public async findByUserIdAndJobOfferId(userId: number, jobOfferId: number, conn,  query = null): Promise<UserTestImage[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and job_offer_id = ${mysql2.escape(jobOfferId)} 
            and deleted_at is null`)
            .then((results) => (results));
    }
}
