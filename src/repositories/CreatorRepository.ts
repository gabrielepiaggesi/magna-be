import { Creator } from "../models/Creator";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
const LOG = new Logger("UserRepository.class");

export class CreatorRepository extends Repository<Creator> {
    public table = "creators";

    public findByName(name: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
}
