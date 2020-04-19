import { Database } from "../../database";
import { User } from "../../models/user/User";
import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { Detail } from "../../models/user/Detail";
const LOG = new Logger("UserRepository.class");

export class DetailRepository extends Repository<Detail> {
    public table = "details";

    public findByType(type: string, userId: number, query = null): Promise<Detail[]> {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where type = "${type}" and user_id = ${userId} and deleted_at is null order by start_date desc`).then((results) => results);
    }
}
