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

    public async findActiveByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }
}
