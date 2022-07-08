import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { JobOfferQuiz } from "../model/JobOfferQuiz";
import { Quiz } from "../model/Quiz";

export class JobOfferQuizRepository extends Repository<JobOfferQuiz> {
    public table = "job_offers_quizs";
    // ${mysql2.escape(stripeId)}

    public async findByJobOfferId(jobOfferId: number, conn,  query = null): Promise<(JobOfferQuiz & Quiz)[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select *, q.id as q_id, jq.id as jq_id from ${this.table} jq 
            join quizs q on q.id  = jq.quiz_id and q.deleted_at is null 
            where jq.job_offer_id = ${mysql2.escape(jobOfferId)}
            and jq.deleted_at is null`)
            .then((results) => results);
    }
}
