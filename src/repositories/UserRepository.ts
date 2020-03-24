import { Database } from "../database";
import { User } from "../models/User";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
const LOG = new Logger("UserRepository.class");

export class UserRepository extends Repository<User> {
    public table = "users";

    public findByName(name: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }

    public findByEmailAndPassword(email: string, password: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where email = "${email}" and password = "${password}" limit 1`).then((results) => results[0]);
    }

    public findByEmail(email: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where email = "${email}" limit 1`).then((results) => results[0]);
    }

    public async findTodayUsers(query = null) {
        const datetime = new Date();
        const from = datetime.toISOString().slice(0,10) + ' 00:00:00';
        const to = datetime.toISOString().slice(0,10) + ' 23:59:59';
        const q = `select count(*) as count from users where created_at between '${from}' and '${to}'`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async findTotalUsers(query = null) {
        const q = `select count(*) as count from users`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}
