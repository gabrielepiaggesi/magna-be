import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserApplication } from "../model/UserApplication";

export class UserApplicationRepository extends Repository<UserApplication> {
    public table = "users_applications";
    // ${mysql2.escape(stripeId)}

    public async findByJobOfferId(jobOfferId: number, conn,  query = null): Promise<UserApplication[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where job_offer_id = ${mysql2.escape(jobOfferId)} 
            and deleted_at is null 
            order by user_id asc`)
            .then((results) => (results));
    }

    public async findByUserIdAndJobOfferId(userId: number, jobOfferId: number, conn,  query = null): Promise<UserApplication> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and job_offer_id = ${mysql2.escape(jobOfferId)} 
            and deleted_at is null 
            ORDER BY id DESC 
            limit 1`)
            .then((results) => (results[0] || null));
    }

    public async findByExamId(examId: number, conn,  query = null): Promise<UserApplication[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where exam_id = ${mysql2.escape(examId)} 
            and deleted_at is null 
            order by user_id asc`)
            .then((results) => (results));
    }

    public async findByExamIdIn(examIds: number[], conn,  query = null): Promise<UserApplication[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where exam_id in (?) 
            and deleted_at is null 
            order by user_id asc`, [examIds])
            .then((results) => (results));
    }

    public async findByUserIdAndExamId(userId: number, examId: number, conn,  query = null): Promise<UserApplication> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} 
            where user_id = ${mysql2.escape(userId)} 
            and exam_id = ${mysql2.escape(examId)} 
            and deleted_at is null 
            ORDER BY id DESC 
            limit 1`)
            .then((results) => (results[0] || null));
    }
}
