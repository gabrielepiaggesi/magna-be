import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql from "mysql";
import { User } from "../model/User";

export class UserRepository extends Repository<User> {
    public table = "users";
    // ${mysql.escape(stripeId)}

    public async findByUserName(username: string, conn = null, query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where username = ${mysql.escape(username)} limit 1`).then((results) => results[0]);
    }

    public async findByEmailAndPassword(email: string, password: string, conn = null,  query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql.escape(email)} and password = ${mysql.escape(password)} limit 1`).then((results) => results[0]);
    }

    public async findByEmail(email: string, conn = null,  query = null): Promise<User> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql.escape(email)} limit 1`).then((results) => results[0]);
    }

    public async findTotalUsers( conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select count(*) as count from preorders`;
        return await c.query(query || q).then((results) => results[0]);
    }
}
