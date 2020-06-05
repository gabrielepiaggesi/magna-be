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
const Logger_1 = require("../../utils/Logger");
const MenuCategoryRepository_1 = require("../../repositories/menu/MenuCategoryRepository");
const MenuCategory_1 = require("../../models/menu/MenuCategory");
const LOG = new Logger_1.Logger("MenuCategoryService.class");
const menuCategoryRepository = new MenuCategoryRepository_1.MenuCategoryRepository();
const db = require("../../database");
class MenuCategoryService {
    getMenusCategories(res, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield menuCategoryRepository.findByMenuId(menuId);
            return res.status(200).send(plans);
        });
    }
    getMenuCategory(res, catId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield menuCategoryRepository.findById(catId);
            return res.status(200).send(plan);
        });
    }
    updateMenuCategory(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                let menu = new MenuCategory_1.MenuCategory();
                menu.menu_id = obj.menu_id;
                if (obj.id) {
                    menu = yield menuCategoryRepository.findById(obj.id);
                }
                menu.name = obj.name;
                if (!obj.delete) {
                    if (obj.id) {
                        yield menuCategoryRepository.update(menu);
                    }
                    else {
                        const id = yield menuCategoryRepository.save(menu);
                        menu.id = id;
                    }
                }
                else if (obj.id) {
                    yield menuCategoryRepository.delete(menu);
                }
                yield db.commit();
                return res.status(200).send(menu);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("new creator plan error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.MenuCategoryService = MenuCategoryService;
//# sourceMappingURL=MenuCategoryService.js.map