"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../mgn-framework/repositories/Repository");
const Logger_1 = require("../../utils/Logger");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const LOG = new Logger_1.Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
const db = require("../../connection");
class MenuRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "menus";
    }
    findByBusinessId(businessId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            const c = conn || (yield db.connection());
            return c.query(query ||
                `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null`).then((results) => results);
        });
    }
    getMenu(menuId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            const c = conn || (yield db.connection());
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
            and mc.deleted_at is null`).then((results) => results);
        });
    }
}
exports.MenuRepository = MenuRepository;
//# sourceMappingURL=MenuRepository.js.map