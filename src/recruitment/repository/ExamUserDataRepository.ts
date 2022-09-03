import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { ExamUserData } from "../model/ExamUserData";

export class ExamUserDataRepository extends Repository<ExamUserData> {
    public table = "exams_users_data";
    // ${mysql2.escape(stripeId)}

    public async findByExamId(examId: number, conn,  query = null): Promise<ExamUserData[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where deleted_at is null and exam_id = ${mysql2.escape(examId)}`)
            .then((results) => results);
    }

    public async findByExamIdAndOptionId(examId: number, optionId: number, conn,  query = null): Promise<ExamUserData> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where deleted_at is null and exam_id = ${mysql2.escape(examId)} and option_id = ${mysql2.escape(optionId)} limit 1`)
            .then((results) => results[0]);
    }
}
