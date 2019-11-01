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

    // tslint:disable-next-line:max-line-length
    public async addAvailableStocks(creatorId, qt, query = null) {
        query = query ||
        `update ${this.table} set available_stocks = available_stocks + ${qt} where id = ${creatorId}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async takeAvailableStocks(creatorId, qt, query = null) {
        query = query ||
        `update ${this.table} set available_stocks = available_stocks - ${qt} where id = ${creatorId}`;
        return await this.db.query(query).then((results: any[]) => results);
    }
}
