import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserReferral } from "../model/UserReferral";

export class UserReferralRepository extends Repository<UserReferral> {
    public table = "users_referrals";
    // ${mysql2.escape(stripeId)}

    public async findActiveByUserId(userId: number, conn = null,  query = null): Promise<UserReferral[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByUserIdJoinBusiness(userId: number, conn = null,  query = null): Promise<UserReferral[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select ud.*, b.name as business_name, bd.amount as discount_amount, bd.monthly_limit as discount_monthly_limit, bd.minimum_expense as discount_minimum_expense, bd.type as discount_type 
            from ${this.table} ud 
            join businesses b on b.id = ud.business_id and b.deleted_at is null 
            join businesses_discounts bd on bd.id = ud.discount_id and bd.deleted_at is null and bd.status = 'ACTIVE' 
            where ud.user_id = ${mysql2.escape(userId)} 
            and ud.status = 'ACTIVE' 
            and ud.deleted_at is null 
            order by ud.id desc`
        ).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserReferral[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserReferral> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc limit 1`).then((results) => results[0] || null);
    }

    public async findByUUID(uuid: string, conn = null,  query = null): Promise<UserReferral> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where uuid = ${mysql2.escape(uuid)} and deleted_at is null order by id desc limit 1`).then((results) => results[0] || null);
    }

    public async findActiveByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserReferral[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }
}
