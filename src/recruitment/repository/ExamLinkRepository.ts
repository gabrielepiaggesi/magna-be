import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { ExamLink } from "../model/ExamLink";

export class ExamLinkRepository extends Repository<ExamLink> {
    public table = "exams_links";
    // ${mysql2.escape(stripeId)}

    public async findByUUID(uuid: string, conn,  query = null): Promise<ExamLink> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where uuid = ${mysql2.escape(uuid)} and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }

    public async findByExamId(examId: string, conn,  query = null): Promise<ExamLink> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where exam_id = ${mysql2.escape(examId)} and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }
}
