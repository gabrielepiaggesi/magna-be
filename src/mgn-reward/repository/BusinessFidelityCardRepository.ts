import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { BusinessFidelityCard } from "../model/BusinessFidelityCard";

export class BusinessFidelityCardRepository extends Repository<BusinessFidelityCard> {
    public table = "businesses_fidelities_cards";
    // ${mysql2.escape(stripeId)}

    public async findActiveByBusinessId(businessId: number, conn = null,  query = null): Promise<BusinessFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<BusinessFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
