import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserBusiness } from "../model/UserBusiness";

export class UserBusinessRepository extends Repository<UserBusiness> {
    public table = "users_businesses";
    // ${mysql2.escape(stripeId)}

    public async whereUserBusinessesIdsIn(UserBusinessIds: number[], conn = null, query = null): Promise<UserBusiness[]> {
        if (!UserBusinessIds.length) return [];
        const c = conn;
        return c.query(query || 
            `select * 
            from ${this.table} 
            where id in (?) and deleted_at is null order by id asc`, [UserBusinessIds]
        ).then((results) => results);
    }

    public async findByUserIdAndUserBusinessId(UserBusinessId: number, userId: number, conn = null,  query = null): Promise<UserBusiness> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(UserBusinessId)} and deleted_at is null limit 1`).then((results) => results[0]);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserBusiness[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<UserBusiness[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessIdJoinUserEmail(businessId: number, conn = null,  query = null): Promise<UserBusiness[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select uB.*, u.email as user_email from ${this.table} uB join users u on u.id = uB.user_id and u.deleted_at is null where uB.business_id = ${mysql2.escape(businessId)} and uB.deleted_at is null order by uB.id desc`).then((results) => results);
    }

    public async findTotalUserBusinesses( conn = null, query = null) {
        const c = conn;
        const q = `select * from ${this.table} and deleted_at is null`;
        return await c.query(query || q).then((results) => results);
    }
}
