import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOfferUserData } from "../model/JobOfferUserData";

export class JobOfferUserDataRepository extends Repository<JobOfferUserData> {
    public table = "job_offers_users_data";
    // ${mysql2.escape(stripeId)}

    public async findByJobOfferId(jobOfferId: number, conn,  query = null): Promise<JobOfferUserData[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where deleted_at is null and job_offer_id = ${mysql2.escape(jobOfferId)}`)
            .then((results) => results);
    }

    public async findByJobOfferIdAndOptionId(jobOfferId: number, optionId: number, conn,  query = null): Promise<JobOfferUserData> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where deleted_at is null and job_offer_id = ${mysql2.escape(jobOfferId)} and option_id = ${mysql2.escape(optionId)} limit 1`)
            .then((results) => results[0]);
    }
}
