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
const UserBusinessRepository_1 = require("../../mgn-entity/repository/UserBusinessRepository");
const IndroError_1 = require("../../utils/IndroError");
const Logger_1 = require("../../utils/Logger");
const MenuCategory_1 = require("../model/MenuCategory");
const MenuCategoryRepository_1 = require("../repository/MenuCategoryRepository");
const LOG = new Logger_1.Logger("MenuCategoryService.class");
const menuCategoryRepository = new MenuCategoryRepository_1.MenuCategoryRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const db = require("../../connection");
class MenuCategoryService {
    getMenusCategories(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield menuCategoryRepository.findByMenuId(menuId, connection);
            yield connection.release();
            return plans;
        });
    }
    getMenuCategory(catId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plan = yield menuCategoryRepository.findById(catId, connection);
            yield connection.release();
            return plan;
        });
    }
    updateMenuCategory(dto, businessId, menuCategoryId = 0, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            if (!businessesIds.includes(businessId)) {
                yield connection.release();
                return [];
            }
            yield connection.newTransaction();
            try {
                let menu = !menuCategoryId ? new MenuCategory_1.MenuCategory() : yield menuCategoryRepository.findById(dto.id, connection);
                menu.menu_id = dto.menu_id;
                menu.name = dto.name;
                if (dto.cat_position)
                    menu.cat_position = dto.cat_position;
                if (!dto.delete) {
                    const res = menuCategoryId ? yield menuCategoryRepository.update(menu, connection) : yield menuCategoryRepository.save(menu, connection);
                    menu.id = menuCategoryId ? menuCategoryId : res.insertId;
                }
                else if (menuCategoryId) {
                    yield menuCategoryRepository.delete(menu, connection);
                }
                yield connection.commit();
                yield connection.release();
                return menu;
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator plan error", e);
                throw new IndroError_1.IndroError("Cannot updateMenuCategory", 500, null, e);
            }
        });
    }
}
exports.MenuCategoryService = MenuCategoryService;
//# sourceMappingURL=MenuCategoryService.js.map