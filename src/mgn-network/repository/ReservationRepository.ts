import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Reservation } from "../model/Reservation";

export class ReservationRepository extends Repository<Reservation> {
    public table = "reservations";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndBusinessId(businessId: number, userId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<Reservation[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
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
}
