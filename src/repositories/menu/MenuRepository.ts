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

    public getMenu(menuId: number, query = null): Promise<any> {
        // tslint:disable-next-line:max-line-length
        return db.query(query || 
            `select * 
            from ${this.table} m 
            inner join menus_categories mc on mc.menu_id = m.id and mc.deleted_at is null 
            inner join menus_items mi on mi.category_id = mc.id and mi.deleted_at is null 
            where m.id = ${menuId} 
            and m.deleted_at is null 
            limit 1`
            ).then((results) => results[0]);
    }
}
