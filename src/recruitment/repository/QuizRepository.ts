import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Quiz } from "../model/Quiz";

export class QuizRepository extends Repository<Quiz> {
    public table = "quizs";
    // ${mysql2.escape(stripeId)}

    public async findWhereIdIn(quizIds: number[], conn = null, query = null): Promise<Quiz[]> {
        if (!quizIds.length) return [];
        const c = conn || await db.connection();
        return c.query(query || 
            `select * 
            from ${this.table} 
            where deleted_at is null and id in (?) order by id desc`, [quizIds]
        ).then((results) => results);
    }
}
