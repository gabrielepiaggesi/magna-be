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

    public getMenu(menuId: number, query = null): Promise<any[]> {
        // tslint:disable-next-line:max-line-length
        return db.query(query || 
            `select 
            mc.id as id,
            mc.name as catName,
            mc.menu_id as catMenuId,
            mi.name as itemName,
            mi.bio as itemBio,
            mi.price as itemPrice,
            mi.id as itemId,
            mi.category_id as catId 
            from menus_categories mc 
            left join menus_items mi on mi.category_id = mc.id and mi.deleted_at is null 
            where mc.menu_id = ${menuId} 
            and mc.deleted_at is null`
            ).then((results) => results);
    }
}
