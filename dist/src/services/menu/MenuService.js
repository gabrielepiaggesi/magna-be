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
const LOG = new Logger_1.Logger("MenuService.class");
const menuRepository = new MenuRepository_1.MenuRepository();
const db = require("../../database");
class MenuService {
    getMenus(res, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plans = yield menuRepository.findByBusinessId(creatorId);
            return res.status(200).send(plans);
        });
    }
    getMenu(res, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const plan = yield menuRepository.findById(menuId);
            return res.status(200).send(plan);
        });
    }
    updateMenu(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.loggedId;
            yield db.newTransaction();
            try {
                let menu = new Menu_1.Menu();
                if (obj.menu_id) {
                    menu = yield menuRepository.findById(obj.menu_id);
                }
                menu.business_id = loggedId;
                menu.name = obj.name;
                menu.status = 'active';
                if (!obj.delete) {
                    if (obj.menu_id) {
                        yield menuRepository.update(menu);
                    }
                    else {
                        yield menuRepository.save(menu);
                    }
                }
                else if (obj.menu_id) {
                    yield menuRepository.delete(menu);
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
exports.MenuService = MenuService;
//# sourceMappingURL=MenuService.js.map