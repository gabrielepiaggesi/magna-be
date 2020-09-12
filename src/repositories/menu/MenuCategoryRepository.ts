import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { MenuCategory } from "../../models/menu/MenuCategory";
const LOG = new Logger("MenuCategoryRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../connection");

export class MenuCategoryRepository extends Repository<MenuCategory> {
    public table = "menus_categories";

    public async findByMenuId(menuId: number, conn = null, query = null): Promise<MenuCategory[]> {
        // tslint:disable-next-line:max-line-length
        const c = conn || await db.connection();
        return c.query(query || 
            `select * 
            from ${this.table} 
            where menu_id = ${menuId} 
            and deleted_at is null`
            ).then((results) => results);
    }
}
