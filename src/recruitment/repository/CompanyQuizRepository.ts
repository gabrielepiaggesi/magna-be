import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { CompanyQuiz } from "../model/CompanyQuiz";

export class CompanyQuizRepository extends Repository<CompanyQuiz> {
    public table = "companies_quizs";
    // ${mysql2.escape(stripeId)}

    public async findByCompanyId(companyId: number, conn,  query = null): Promise<CompanyQuiz[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where company_id = ${mysql2.escape(companyId)} and deleted_at is null order by id desc`)
            .then((results) => results);
    }

    public async findByCompanyIdAndQuizId(companyId: number, quizId: number, conn,  query = null): Promise<CompanyQuiz> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where company_id = ${mysql2.escape(companyId)} and quiz_id = ${mysql2.escape(quizId)} and deleted_at is null order by id desc limit 1`)
            .then((results) => results[0] || null);
    }
}
