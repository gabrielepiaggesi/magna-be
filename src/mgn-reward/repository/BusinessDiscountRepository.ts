import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { BusinessDiscount } from "../model/BusinessDiscount";

export class BusinessDiscountRepository extends Repository<BusinessDiscount> {
    public table = "businesses_discounts";
    // ${mysql2.escape(stripeId)}

    public async findActiveByBusinessId(businessId: number, conn = null,  query = null): Promise<BusinessDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByBusinessIdAndOrigin(businessId: number, origin: 'FIDELITY_CARD'|'IG_POST', conn = null,  query = null): Promise<BusinessDiscount> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and origin = ${mysql2.escape(origin)} and status = 'ACTIVE' and deleted_at is null order by id desc limit 1`).then((results) => results[0] || null);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<BusinessDiscount[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
