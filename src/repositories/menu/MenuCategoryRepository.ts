import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { MenuCategory } from "../../models/menu/MenuCategory";
const LOG = new Logger("MenuCategoryRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../database");

export class MenuCategoryRepository extends Repository<MenuCategory> {
    public table = "menus_categories";

    public findByMenuId(menuId: number, query = null): Promise<MenuCategory[]> {
        // tslint:disable-next-line:max-line-length
        return db.query(query || 
            `select * 
            from ${this.table} 
            where menu_id = ${menuId} 
            and deleted_at is null`
            ).then((results) => results);
    }
}
