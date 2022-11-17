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
const Menu_1 = require("../model/Menu");
const MenuCategoryRepository_1 = require("../repository/MenuCategoryRepository");
const MenuItemRepository_1 = require("../repository/MenuItemRepository");
const MenuRepository_1 = require("../repository/MenuRepository");
const LOG = new Logger_1.Logger("MenuService.class");
const menuRepository = new MenuRepository_1.MenuRepository();
const catRepo = new MenuCategoryRepository_1.MenuCategoryRepository();
// const comRepository = new CommentRepository();
const itemRepo = new MenuItemRepository_1.MenuItemRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const db = require("../../connection");
class MenuService {
    getMenus(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield menuRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return plans;
        });
    }
    // public async getComments(res: Response, creatorId: number) {
    //     const connection = await db.connection();
    //     const plans = await comRepository.findByBusinessId(creatorId, connection);
    //     await connection.release();
    //     return res.status(200).send(plans);
    // }
    getMenu(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            let arra = [];
            const connection = yield db.connection();
            let cats = yield catRepo.findByMenuId(menuId, connection);
            // assign postition = position || id
            cats = cats.map((i) => { i.cat_position = (i.cat_position) ? i.cat_position : i.id; return i; });
            // order sort array based on position
            cats = cats.sort((a, b) => a.cat_position - b.cat_position);
            // LOG.debug('array cat', cats);
            for (let cat of cats) {
                let items = yield itemRepo.findByCategoryId(cat.id, connection);
                // foreach item
                // assign postition = position || id
                items = items.map((i) => { i.item_position = (i.item_position) ? i.item_position : i.id; return i; });
                // order sort array based on position
                items = items.sort((a, b) => a.item_position - b.item_position);
                const categ = {
                    name: cat.name,
                    id: cat.id,
                    cat_position: cat.cat_position,
                    message: cat.message,
                    items
                };
                arra.push(categ);
            }
            arra = arra.sort((a, b) => a.cat_position - b.cat_position);
            yield connection.release();
            return arra;
        });
    }
    updateMenu(dto, businessId, menuId = 0, loggedUserId) {
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
                let menu = !menuId ? new Menu_1.Menu() : yield menuRepository.findById(dto.id, connection);
                menu.business_id = businessId;
                menu.name = dto.name;
                menu.status = 'active';
                if (!dto.delete) {
                    const res = menuId ? yield menuRepository.update(menu, connection) : yield menuRepository.save(menu, connection);
                    menu.id = menuId ? menuId : res.insertId;
                }
                else if (menuId) {
                    yield menuRepository.delete(menu, connection);
                }
                const menus = yield menuRepository.findByBusinessId(businessId, connection);
                yield connection.commit();
                yield connection.release();
                return menus;
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator plan error", e);
                throw new IndroError_1.IndroError("Cannot updateMenu", 500, null, e);
            }
        });
    }
}
exports.MenuService = MenuService;
//# sourceMappingURL=MenuService.js.map