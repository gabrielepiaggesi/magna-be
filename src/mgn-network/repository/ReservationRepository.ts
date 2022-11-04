import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Reservation } from "../model/Reservation";

export class ReservationRepository extends Repository<Reservation> {
    public table = "reservations";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserIdJoinBusiness(userId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select r.*, b.name as business_name from ${this.table} r join businesses b on b.id = r.business_id and b.deleted_at is null 
        where r.user_id = ${mysql2.escape(userId)} and r.type = 'auto' and r.deleted_at is null order by r.id desc`).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessIdAndUserDateGreaterThan(businessId: number, userDate: string, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and user_date >= ${mysql2.escape(userDate)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findPendingByUserIdAndBusinessIdAndUserDateGreaterThan(userid: number, businessId: number, userDate: string, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select * 
            from ${this.table} 
            where business_id = ${mysql2.escape(businessId)} 
            and user_id = ${mysql2.escape(userid)} 
            and user_date >= ${mysql2.escape(userDate)} 
            and status = 'pending' 
            and deleted_at is null 
            order by id desc
        `).then((results) => results);
    }
}
