"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuItemRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../database");
class MenuItemRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "menus_items";
    }
    findByCategoryId(categoryId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select id, name, bio, price, category_id, status 
            from ${this.table} 
            where category_id = ${categoryId} 
            and deleted_at is null`).then((results) => results);
    }
}
exports.MenuItemRepository = MenuItemRepository;
//# sourceMappingURL=MenuItemRepository.js.map