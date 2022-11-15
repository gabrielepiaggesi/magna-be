import { Repository } from "../../mgn-framework/repositories/Repository";
import { Logger } from "../../utils/Logger";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Menu } from "../model/Menu";
const LOG = new Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../connection");

export class MenuRepository extends Repository<Menu> {
    public table = "menus";

    public async findByBusinessId(businessId: number, conn = null, query = null): Promise<Menu[]> {
        // tslint:disable-next-line:max-line-length
        const c = conn || await db.connection();
        return c.query(query || 
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null`
            ).then((results) => results);
    }

    public async getMenu(menuId: number, conn = null, query = null): Promise<any[]> {
        // tslint:disable-next-line:max-line-length
        const c = conn || await db.connection();
        return c.query(query || 
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
