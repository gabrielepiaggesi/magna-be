import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserReview } from "../model/UserReview";

export class UserReviewRepository extends Repository<UserReview> {
    public table = "users_reviews";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndBusinessId(businessId: number, userId: number, conn = null,  query = null): Promise<UserReview[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserReview[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<UserReview[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
