import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOffer } from "../model/JobOffer";
import { JobOfferSkill } from "../model/JobOfferSkill";

export class JobOfferSkillRepository extends Repository<JobOfferSkill> {
    public table = "job_offers_skills";
    // ${mysql2.escape(stripeId)}
    
    public async findByJobOfferId(jobOfferId: number, conn,  query = null): Promise<JobOfferSkill[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where job_offer_id = ${mysql2.escape(jobOfferId)} and deleted_at is null`)
            .then((results) => results);
    }
}
