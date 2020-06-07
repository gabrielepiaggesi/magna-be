"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../database");
class MenuRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "menus";
    }
    findByBusinessId(businessId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null`).then((results) => results);
    }
    getMenu(menuId, query = null) {
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
            and mc.deleted_at is null`).then((results) => results);
    }
}
exports.MenuRepository = MenuRepository;
//# sourceMappingURL=MenuRepository.js.map