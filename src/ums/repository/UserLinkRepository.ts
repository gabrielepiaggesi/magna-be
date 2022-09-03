import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Company } from "../model/Company";
import { UserLink } from "../model/UserLink";

export class UserLinkRepository extends Repository<UserLink> {
    public table = "companies";
    // ${mysql2.escape(stripeId)}

    public async findByUserId(userId: number, conn = null, query = null): Promise<UserLink[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where user_id = ${mysql2.escape(userId)}`).then((results) => results);
    }

    public async findByUserIdAndExamId(userId: number, examId: number, conn = null, query = null): Promise<UserLink> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and link_for = 'EXAM' 
            and entity_id = ${mysql2.escape(examId)} 
            and deleted_at is null 
            order by id desc 
            limit 1`).then((results) => results[0] || null);
    }
}
