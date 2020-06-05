import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Menu } from "../../models/menu/Menu";
const LOG = new Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../database");

export class MenuRepository extends Repository<Menu> {
    public table = "menus";

    public findByBusinessId(businessId: number, query = null): Promise<Menu[]> {
        // tslint:disable-next-line:max-line-length
        return db.query(query || 
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null`
            ).then((results) => results);
    }
}
