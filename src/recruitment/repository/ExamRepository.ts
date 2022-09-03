import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Exam } from "../model/Exam";

export class ExamRepository extends Repository<Exam> {
    public table = "exams";
    // ${mysql2.escape(stripeId)}

    public async findByUserIdAndCompanyId(userId: number, companyId: number, conn,  query = null): Promise<Exam[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where author_user_id = ${mysql2.escape(userId)} and company_id = ${mysql2.escape(companyId)} and deleted_at is null`)
            .then((results) => results);
    }

    public async findByCompanyId(companyId: number, conn,  query = null): Promise<Exam[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where company_id = ${mysql2.escape(companyId)} and deleted_at is null`)
            .then((results) => results);
    }

    public async findByIdInAndActive(ids: number[], conn,  query = null): Promise<Exam[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where id in (?) and status = 'ACTIVE' and deleted_at is null`, [ids])
            .then((results) => results);
    }

    public async findByCompanyIdAndStatus(companyId: number, status: string, conn,  query = null): Promise<Exam[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where company_id = ${mysql2.escape(companyId)} and status = ${mysql2.escape(status)} and deleted_at is null`)
            .then((results) => results);
    }
}
