import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserDiscount } from "../model/UserDiscount";

export class UserDiscountRepository extends Repository<UserDiscount> {
    public table = "users_discounts";
    // ${mysql2.escape(stripeId)}

    public async findActiveByUserId(userId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByUserIdJoinBusiness(userId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select ud.*, b.name as business_name, bd.amount as discount_amount, bd.monthly_limit as discount_monthly_limit, bd.minimum_expense as discount_minimum_expense, bd.type as discount_type, bd.slogan as slogan  
            from ${this.table} ud 
            join businesses b on b.id = ud.business_id and b.deleted_at is null 
            join businesses_discounts bd on bd.id = ud.discount_id and bd.deleted_at is null and bd.status = 'ACTIVE' 
            where ud.user_id = ${mysql2.escape(userId)} 
            and ud.status = 'ACTIVE' 
            and ud.deleted_at is null 
            order by ud.id desc`
        ).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserIdAndDiscountId(userId: number, discountId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and discount_id = ${mysql2.escape(discountId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }
}
