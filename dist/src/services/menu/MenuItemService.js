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
const db = require("../../connection");
class MenuItemService {
    getMenusItems(res, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield menuItemRepository.findByCategoryId(categoryId, connection);
            yield connection.release();
            return res.status(200).send(plans);
        });
    }
    getMenuItem(res, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plan = yield menuItemRepository.findById(itemId, connection);
            yield connection.release();
            return res.status(200).send(plan);
        });
    }
    updateMenuItem(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let menu = new MenuItem_1.MenuItem();
                menu.category_id = obj.category_id;
                if (obj.id) {
                    menu = yield menuItemRepository.findById(obj.id, connection);
                }
                obj.name = obj.name.replace(/"/g, "'");
                obj.bio = (obj.bio) ? obj.bio.replace(/"/g, "'") : null;
                obj.price = obj.price.replace(/"/g, "'");
                menu.name = obj.name;
                menu.status = (obj.status && obj.status != ' ' && obj.status != '') ? obj.status : 'active';
                menu.bio = obj.bio;
                menu.position = obj.position;
                menu.price = obj.price;
                if (!obj.delete) {
                    if (obj.id) {
                        yield menuItemRepository.update(menu, connection);
                    }
                    else {
                        const id = yield menuItemRepository.save(menu, connection);
                        menu.id = id.insertId;
                    }
                }
                else if (obj.id) {
                    yield menuItemRepository.delete(menu, connection);
                }
                yield connection.commit();
                yield connection.release();
                return res.status(200).send(menu);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator plan error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.MenuItemService = MenuItemService;
//# sourceMappingURL=MenuItemService.js.map