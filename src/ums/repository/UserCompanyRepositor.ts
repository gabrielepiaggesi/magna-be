import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserCompany } from "../model/UserCompany";

export class UserCompanyRepository extends Repository<UserCompany> {
    public table = "users_companies";
    // ${mysql2.escape(stripeId)}

    public async findByUserId(userId: number, conn = null, query = null): Promise<UserCompany[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where user_id = ${mysql2.escape(userId)}`).then((results) => results);
    }

    public async findByUserIdAndCompanyId(userId: number, companyId: number, conn = null,  query = null): Promise<UserCompany> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * from ${this.table} where user_id = ${mysql2.escape(userId)} and company_id = ${mysql2.escape(companyId)} limit 1`)
            .then((results) => results[0]);
    }
    public async findUserCompanies(userId: number, conn = null,  query = null): Promise<UserCompany[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || 
            `select * 
            from ${this.table} uc 
            join companies c on c.id = uc.company_id and c.deleted_at is null 
            where uc.user_id = ${mysql2.escape(userId)} 
            and uc.deleted_at is null`)
            .then((results) => results);
    }
}
