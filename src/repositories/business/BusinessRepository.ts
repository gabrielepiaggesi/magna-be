import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { Business } from "../../models/business/Business";
const LOG = new Logger("UserRepository.class");
const db = require("../../database");
import mysql from "mysql";

export class BusinessRepository extends Repository<Business> {
    public table = "business";

    public findByUserName(username: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${this.table} where username = ${mysql.escape(username)} limit 1`).then((results) => results[0]);
    }

    public findByEmailAndPassword(email: string, password: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${this.table} where email = ${mysql.escape(email)} and password = ${mysql.escape(password)} limit 1`).then((results) => results[0]);
    }

    public findByEmail(email: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query || `select * from ${mysql.escape(this.table)} where email = ${mysql.escape(email)} limit 1`).then((results) => results[0]);
    }

    public async findTodayUsers(query = null) {
        const datetime = new Date();
        const from = datetime.toISOString().slice(0,10) + ' 00:00:00';
        const to = datetime.toISOString().slice(0,10) + ' 23:59:59';
        const q = `select count(*) as count from business where created_at between '${from}' and '${to}'`;
        return await db.query(query || q).then((results) => results[0]);
    }

    public async findTotalUsers(query = null) {
        const q = `select count(*) as count from users`;
        return await db.query(query || q).then((results) => results[0]);
    }
}
