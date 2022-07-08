import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Company } from "../model/Company";

export class CompanyRepository extends Repository<Company> {
    public table = "companies";
    // ${mysql2.escape(stripeId)}

    public async findByUserId(userId: number, conn = null, query = null): Promise<Company[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where author_user_id = ${mysql2.escape(userId)}`).then((results) => results);
    }

    public async findByEmailAndName(email: string, name: string, conn = null,  query = null): Promise<Company> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} and name = ${mysql2.escape(name)} limit 1`).then((results) => results[0]);
    }

    public async findByEmail(email: string, conn = null,  query = null): Promise<Company> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} limit 1`).then((results) => results[0]);
    }
}
