import { Database } from "../database";
import { User } from "../models/User";
import { Logger } from "../utlis/Logger";
import { Repository } from "./Repository";
const LOG = new Logger("UserRepository.class");

export class UserRepository extends Repository<User> {
    public table = "users";

    public findByName(name: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
}
