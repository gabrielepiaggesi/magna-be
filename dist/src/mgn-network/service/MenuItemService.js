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
const MenuItem_1 = require("../model/MenuItem");
const MenuItemRepository_1 = require("../repository/MenuItemRepository");
const LOG = new Logger_1.Logger("MenuItemService.class");
const menuItemRepository = new MenuItemRepository_1.MenuItemRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const db = require("../../connection");
class MenuItemService {
    getMenusItems(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield menuItemRepository.findByCategoryId(categoryId, connection);
            yield connection.release();
            return plans;
        });
    }
    getMenuItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plan = yield menuItemRepository.findById(itemId, connection);
            yield connection.release();
            return plan;
        });
    }
    updateMenuItem(dto, businessId, menuItemId = 0, loggedUserId) {
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
                let menu = !menuItemId ? new MenuItem_1.MenuItem() : yield menuItemRepository.findById(dto.id, connection);
                menu.category_id = dto.category_id;
                dto.name = dto.name.replace(/"/g, "'");
                dto.bio = (dto.bio) ? dto.bio.replace(/"/g, "'") : null;
                dto.price = dto.price.replace(/"/g, "'");
                menu.name = dto.name;
                menu.status = (dto.status && dto.status != ' ' && dto.status != '') ? dto.status : 'active';
                menu.bio = dto.bio;
                menu.item_position = dto.item_position;
                menu.price = dto.price;
                if (dto.is_freezed === false || dto.is_freezed === true || dto.is_freezed === 1 || dto.is_freezed === 0)
                    menu.is_freezed = dto.is_freezed ? 1 : 0;
                if (dto.allergic_note)
                    menu.allergic_note = dto.allergic_note;
                if (!dto.delete) {
                    const res = menuItemId ? yield menuItemRepository.update(menu, connection) : yield menuItemRepository.save(menu, connection);
                    menu.id = menuItemId ? menuItemId : res.insertId;
                }
                else if (menuItemId) {
                    yield menuItemRepository.delete(menu, connection);
                }
                yield connection.commit();
                yield connection.release();
                return menu;
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator plan error", e);
                throw new IndroError_1.IndroError("Cannot updateMenuItem", 500, null, e);
            }
        });
    }
}
exports.MenuItemService = MenuItemService;
//# sourceMappingURL=MenuItemService.js.map