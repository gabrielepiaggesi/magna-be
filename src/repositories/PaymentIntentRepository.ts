import { Database } from "../database";
import { PaymentIntent } from "../models/PaymentIntent";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
const LOG = new Logger("UserRepository.class");

export class PaymentIntentRepository extends Repository<PaymentIntent> {
    public table = "payments_intents";

    public findByName(name: string, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }

    // tslint:disable-next-line:max-line-length
    public async updateByIdWithStatusWithDeletedAt(piId, status, deletedAt, query = null) {
        query = query ||
        `update ${this.table} set status = "${status}", deleted_at = ${deletedAt ? `"${deletedAt}"` : null} where id = ${piId}`;
        return await this.db.query(query).then((results: any[]) => results);
    }
}
