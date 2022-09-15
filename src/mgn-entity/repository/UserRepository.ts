import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { User } from "../model/User";

export class UserRepository extends Repository<User> {
    public table = "users";
    // ${mysql2.escape(stripeId)}

    public async whereUserIdIn(userIds: number[], conn = null, query = null): Promise<User[]> {
        if (!userIds.length) return [];
        const c = conn;
        return c.query(query || 
            `select * 
            from ${this.table} 
            where id in (?) order by id asc`, [userIds]
        ).then((results) => results);
    }

    public async findByUserName(username: string, conn = null, query = null): Promise<User> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where instagram_username = ${mysql2.escape(username)} limit 1`).then((results) => results[0]);
    }

    public async findByEmailAndPassword(email: string, password: string, conn = null,  query = null): Promise<User> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} and password = ${mysql2.escape(password)} limit 1`).then((results) => results[0]);
    }

    public async findByEmail(email: string, conn = null,  query = null): Promise<User> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql2.escape(email)} limit 1`).then((results) => results[0]);
    }

    public async findTotalUsers( conn = null, query = null) {
        const c = conn;
        const q = `select * from ${this.table}`;
        return await c.query(query || q).then((results) => results);
    }
}
