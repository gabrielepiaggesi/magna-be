import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Quiz } from "../model/Quiz";
import { ExamQuiz } from "../model/ExamQuiz";

export class ExamQuizRepository extends Repository<ExamQuiz> {
    public table = "exams_quizs";
    // ${mysql2.escape(stripeId)}

    public async findByExamId(examId: number, conn,  query = null): Promise<(ExamQuiz & Quiz)[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select *, q.id as q_id, jq.id as jq_id from ${this.table} jq 
            join quizs q on q.id  = jq.quiz_id and q.deleted_at is null 
            where jq.exam_id = ${mysql2.escape(examId)} 
            and jq.deleted_at is null`)
            .then((results) => results);
    }

    public async findByExamIdAndQuizId(examId: number, quizId: number, conn,  query = null): Promise<ExamQuiz> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where exam_id = ${mysql2.escape(examId)} and quiz_id = ${mysql2.escape(quizId)} order by id desc limit 1`)
            .then((results) => results[0] || null);
    }

    public async findByQuizId(quizId: number, conn,  query = null): Promise<ExamQuiz[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where quiz_id = ${mysql2.escape(quizId)} and deleted_at is null order by id desc`)
            .then((results) => results);
    }
}
