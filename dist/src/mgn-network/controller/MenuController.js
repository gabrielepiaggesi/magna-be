"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const __1 = require("../..");
const Logger_1 = require("../../mgn-framework/services/Logger");
const Decorator_1 = require("../../utils/Decorator");
const MenuCategoryService_1 = require("../service/MenuCategoryService");
const MenuItemService_1 = require("../service/MenuItemService");
const MenuService_1 = require("../service/MenuService");
// services
const LOG = new Logger_1.Logger("MenuController.class");
const menuService = new MenuService_1.MenuService();
const menuCatService = new MenuCategoryService_1.MenuCategoryService();
const menuItemService = new MenuItemService_1.MenuItemService();
// routes
// menuRoutes.get("/comment/:businessId", auth.isUser, async (req, res) => await menuService.getComments(res, parseInt(req.params.businessId, 10)));
// menuRoutes.post("/comment/:businessId", async (req, res) => await menuService.commentMenu(res, parseInt(req.params.businessId, 10), req.body));
class MenuController {
    getMenus(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield menuService.getMenus(parseInt(req.params.businessId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.getMenus.Error' }));
            }
        });
    }
    getMenu(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield menuService.getMenu(parseInt(req.params.menuId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.getMenu.Error' }));
            }
        });
    }
    getMenuItem(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield menuItemService.getMenuItem(parseInt(req.params.itemId, 10));
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.getMenuItem.Error' }));
            }
        });
    }
    updateMenu(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield menuService.updateMenu(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.updateMenu.Error' }));
            }
        });
    }
    updateMenuCategory(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield menuCatService.updateMenuCategory(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuCategoryId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.updateMenuCategory.Error' }));
            }
        });
    }
    updateMenuItem(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loggedUserId = __1.auth.getLoggedUserId(req);
                const response = yield menuItemService.updateMenuItem(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuItemId, 10), loggedUserId);
                return res.status(200).json(response);
            }
            catch (e) {
                LOG.debug(e);
                return res.status(e.status || 500).json(Object.assign(Object.assign({}, e), { message: e.message, code: e.code || 'Menu.updateMenuItem.Error' }));
            }
        });
    }
}
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getMenus/:businessId")
], MenuController.prototype, "getMenus", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getMenu/:menuId")
], MenuController.prototype, "getMenu", null);
__decorate([
    Decorator_1.Get(),
    Decorator_1.Path("/getMenuItem/:itemId")
], MenuController.prototype, "getMenuItem", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateMenu/:businessId/:menuId")
], MenuController.prototype, "updateMenu", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateMenuCategory/:businessId/:menuCategoryId")
], MenuController.prototype, "updateMenuCategory", null);
__decorate([
    Decorator_1.Post(),
    Decorator_1.Path("/updateMenuItem/:businessId/:menuItemId")
], MenuController.prototype, "updateMenuItem", null);
exports.MenuController = MenuController;
//# sourceMappingURL=MenuController.js.map