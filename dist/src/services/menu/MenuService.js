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
const middleware_1 = require("../../integration/middleware");
const MenuRepository_1 = require("../../repositories/menu/MenuRepository");
const Menu_1 = require("../../models/menu/Menu");
const MenuCategoryRepository_1 = require("../../repositories/menu/MenuCategoryRepository");
const MenuItemRepository_1 = require("../../repositories/menu/MenuItemRepository");
const Comment_1 = require("../../models/menu/Comment");
const CommentRepository_1 = require("../../repositories/menu/CommentRepository");
const LOG = new Logger_1.Logger("MenuService.class");
const menuRepository = new MenuRepository_1.MenuRepository();
const catRepo = new MenuCategoryRepository_1.MenuCategoryRepository();
const comRepository = new CommentRepository_1.CommentRepository();
const itemRepo = new MenuItemRepository_1.MenuItemRepository();
const db = require("../../connection");
class MenuService {
    getMenus(res, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield menuRepository.findByBusinessId(creatorId, connection);
            yield connection.release();
            return res.status(200).send(plans);
        });
    }
    getComments(res, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const plans = yield comRepository.findByBusinessId(creatorId, connection);
            yield connection.release();
            return res.status(200).send(plans);
        });
    }
    getMenu(res, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            let arra = [];
            const connection = yield db.connection();
            let cats = yield catRepo.findByMenuId(menuId, connection);
            // assign postition = position || id
            cats = cats.map((i) => { i.position = (i.position) ? i.position : i.id; return i; });
            // order sort array based on position
            cats = cats.sort((a, b) => a.position - b.position);
            LOG.debug('array cat', cats);
            for (let cat of cats) {
                let items = yield itemRepo.findByCategoryId(cat.id, connection);
                // foreach item
                // assign postition = position || id
                items = items.map((i) => { i.position = (i.position) ? i.position : i.id; return i; });
                // order sort array based on position
                items = items.sort((a, b) => a.position - b.position);
                const categ = {
                    name: cat.name,
                    id: cat.id,
                    position: cat.position,
                    items
                };
                arra.push(categ);
            }
            arra = arra.sort((a, b) => a.position - b.position);
            yield connection.release();
            return res.status(200).send(arra);
        });
    }
    updateMenu(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.loggedId;
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let menu = new Menu_1.Menu();
                if (obj.id) {
                    menu = yield menuRepository.findById(obj.id, connection);
                }
                menu.business_id = loggedId;
                menu.name = obj.name;
                menu.status = 'active';
                if (!obj.delete) {
                    if (obj.id) {
                        yield menuRepository.update(menu, connection);
                    }
                    else {
                        const id = yield menuRepository.save(menu, connection);
                        menu.id = id.insertId;
                    }
                }
                else if (obj.id) {
                    yield menuRepository.delete(menu, connection);
                }
                const menus = yield menuRepository.findByBusinessId(loggedId, connection);
                yield connection.commit();
                yield connection.release();
                return res.status(200).send(menus);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator plan error", e);
                return res.status(500).send(e);
            }
        });
    }
    commentMenu(res, businessId, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let menu = new Comment_1.Comment();
                menu.business_id = businessId;
                menu.text = obj.comment;
                yield comRepository.save(menu, connection);
                yield connection.commit();
                yield connection.release();
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new comment error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.MenuService = MenuService;
//# sourceMappingURL=MenuService.js.map