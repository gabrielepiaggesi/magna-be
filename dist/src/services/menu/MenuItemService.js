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
const MenuItemRepository_1 = require("../../repositories/menu/MenuItemRepository");
const MenuItem_1 = require("../../models/menu/MenuItem");
const LOG = new Logger_1.Logger("MenuItemService.class");
const menuItemRepository = new MenuItemRepository_1.MenuItemRepository();
const db = require("../../database");
class MenuItemService {
    getMenusItems(res, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield menuItemRepository.findByCategoryId(categoryId);
            return res.status(200).send(plans);
        });
    }
    getMenuItem(res, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield menuItemRepository.findById(itemId);
            return res.status(200).send(plan);
        });
    }
    updateMenuItem(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                let menu = new MenuItem_1.MenuItem();
                menu.category_id = obj.category_id;
                if (obj.item_id) {
                    menu = yield menuItemRepository.findById(obj.item_id);
                }
                menu.name = obj.name;
                menu.bio = obj.bio;
                menu.price = obj.price;
                if (!obj.delete) {
                    if (obj.item_id) {
                        yield menuItemRepository.update(menu);
                    }
                    else {
                        yield menuItemRepository.save(menu);
                    }
                }
                else if (obj.item_id) {
                    yield menuItemRepository.delete(menu);
                }
                yield db.commit();
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield db.rollback();
                LOG.error("new creator plan error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.MenuItemService = MenuItemService;
//# sourceMappingURL=MenuItemService.js.map