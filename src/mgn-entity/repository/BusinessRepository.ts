import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Business } from "../model/Business";

export class BusinessRepository extends Repository<Business> {
    public table = "businesses";
    // ${mysql2.escape(stripeId)}

    public async whereBusinessesIdsIn(businessIds: number[], conn = null, query = null): Promise<Business[]> {
        if (!businessIds.length) return [];
        const c = conn;
        return c.query(query || 
            `select * 
            from ${this.table} 
            where id in (?) and deleted_at is null order by id asc`, [businessIds]
        ).then((results) => results);
    }

    public async findByUserIdAndBusinessId(businessId: number, userId: number, conn = null,  query = null): Promise<Business> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(businessId)} and deleted_at is null limit 1`).then((results) => results[0]);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<Business[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByCap(cap: string, conn = null,  query = null): Promise<Business[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where cap = ${mysql2.escape(cap)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findTotalBusinesses( conn = null, query = null) {
        const c = conn;
        const q = `select * from ${this.table} and deleted_at is null`;
        return await c.query(query || q).then((results) => results);
    }
}
