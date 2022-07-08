import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserQuiz } from "../model/UserQuiz";

export class UserQuizRepository extends Repository<UserQuiz> {
    public table = "users_quizs";
    // ${mysql2.escape(stripeId)}

    public async whereUserIdInAndJobOfferId(userIds: number[], jobOfferId: number, conn = null, query = null): Promise<UserQuiz[]> {
        if (!userIds.length) return [];
        const c = conn || await db.connection();
        return c.query(query || 
            `select * 
            from ${this.table} 
            where job_offer_id = ${mysql2.escape(jobOfferId)} and deleted_at is null and user_id in (?) order by user_id asc`, userIds
        ).then((results) => results);
    }

    public async findByQuizIdAndJobOfferIdAndUserId(quizId: number, jobOfferId: number, userId: number, conn,  query = null): Promise<UserQuiz> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and job_offer_id = ${mysql2.escape(jobOfferId)} 
            and quiz_id = ${mysql2.escape(quizId)} 
            and deleted_at is null 
            order by id desc 
            limit 1`)
            .then((results) => results[0] || null);
    }
}
