import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { Business } from "../../models/business/Business";
const LOG = new Logger("UserRepository.class");
const db = require("../../connection");
import mysql from "mysql";

export class BusinessRepository extends Repository<Business> {
    public table = "business";

    public async findByUserName(username: string, conn = null, query = null) {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where username = ${mysql.escape(username)} limit 1`).then((results) => results[0]);
    }

    public async findByEmailAndPassword(email: string, password: string, conn = null, query = null) {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql.escape(email)} and password = ${mysql.escape(password)} limit 1`).then((results) => results[0]);
    }

    public async findByEmail(email: string, conn = null, query = null) {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return c.query(query || `select * from ${this.table} where email = ${mysql.escape(email)} limit 1`).then((results) => results[0]);
    }

    public async findTodayUsers(conn = null, query = null) {
        const c = conn || await db.connection();
        const datetime = new Date();
        const from = datetime.toISOString().slice(0,10) + ' 00:00:00';
        const to = datetime.toISOString().slice(0,10) + ' 23:59:59';
        const q = `select count(*) as count from business where created_at between '${from}' and '${to}'`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async findTotalUsers(conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select count(*) as count from users`;
        return await c.query(query || q).then((results) => results[0]);
    }
}
