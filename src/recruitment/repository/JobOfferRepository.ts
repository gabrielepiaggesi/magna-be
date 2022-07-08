import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOffer } from "../model/JobOffer";

export class JobOfferRepository extends Repository<JobOffer> {
    public table = "job_offers";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndCompanyId(userId: number, companyId: number, conn,  query = null): Promise<JobOffer[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where author_user_id = ${mysql2.escape(userId)} and company_id = ${mysql2.escape(companyId)}`)
            .then((results) => results);
    }

    public async findByCompanyId(companyId: number, conn,  query = null): Promise<JobOffer[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where company_id = ${mysql2.escape(companyId)}`)
            .then((results) => results);
    }
}
