import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOfferLink } from "../model/JobOfferLink";

export class JobOfferLinkRepository extends Repository<JobOfferLink> {
    public table = "job_offers_links";
    // ${mysql2.escape(stripeId)}

    public async findByUUID(uuid: string, conn,  query = null): Promise<JobOfferLink> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where uuid = ${mysql2.escape(uuid)} and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }

    public async findByJobOfferId(jobOfferId: string, conn,  query = null): Promise<JobOfferLink> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where job_offer_id = ${mysql2.escape(jobOfferId)} and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }
}
