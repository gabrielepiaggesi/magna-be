"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const Repository_1 = require("../Repository");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuCategoryRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../database");
class MenuCategoryRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "menus_categories";
    }
    findByMenuId(menuId, query = null) {
        // tslint:disable-next-line:max-line-length
        return db.query(query ||
            `select * 
            from ${this.table} 
            where menu_id = ${menuId} 
            and deleted_at is null`).then((results) => results);
    }
}
exports.MenuCategoryRepository = MenuCategoryRepository;
//# sourceMappingURL=MenuCategoryRepository.js.map