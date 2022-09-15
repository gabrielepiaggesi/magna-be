import { Repository } from "./Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { User } from "../../mgn-entity/model/User";

export class GeneralRepository extends Repository<User> {
    public table = "users";
    // ${mysql2.escape(stripeId)}

    public async findByUserName(username: string, conn = null, query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where username = ${mysql2.escape(username)} limit 1`).then((results) => results[0]);
    }

    public async findByEmailAndPassword(email: string, password: string, conn = null,  query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} and password = ${mysql2.escape(password)} limit 1`).then((results) => results[0]);
    }

    public async findByEmail(email: string, conn = null,  query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} limit 1`).then((results) => results[0]);
    }

    public async findTotalUsers( conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select count(*) as count from preorders`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async findUsersToCall(date1, date2, conn = null, query = null): Promise<any[]> {
        const c = conn || await db.connection();
        const q = 
        `select u.id, u.email 
        from users u 
        where u.created_at between (CURRENT_DATE - interval ${date1} day) and (CURRENT_DATE - interval ${date2} day)  
        and u.deleted_at is null`;
        return await c.query(query || q).then((results) => results);
    }
}
