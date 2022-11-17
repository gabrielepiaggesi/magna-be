import { Repository } from "../../mgn-framework/repositories/Repository";
import { Logger } from "../../utils/Logger";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { MenuItem } from "../model/MenuItem";
const LOG = new Logger("MenuItemRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../connection");

export class MenuItemRepository extends Repository<MenuItem> {
    public table = "menus_items";

    public async findByCategoryId(categoryId: number, conn = null, query = null): Promise<MenuItem[]> {
        // tslint:disable-next-line:max-line-length
        const c = conn || await db.connection();
        return c.query(query || 
            `select id, name, bio, price, category_id, status, item_position, is_freezed, allergic_note    
            from ${this.table} 
            where category_id = ${categoryId} 
            and deleted_at is null`
            ).then((results) => results);
    }
}
