import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserSocialPost } from "../model/UserSocialPost";

export class UserSocialPostRepository extends Repository<UserSocialPost> {
    public table = "users_socials_posts";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndBusinessId(businessId: number, userId: number, conn = null,  query = null): Promise<UserSocialPost[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserSocialPost[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<UserSocialPost[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findPendingByBusinessId(businessId: number, conn = null,  query = null): Promise<UserSocialPost[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and status = 'PENDING' and deleted_at is null order by id desc`).then((results) => results);
    }
}
