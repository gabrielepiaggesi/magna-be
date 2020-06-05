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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../middleware/index");
const MenuService_1 = require("../../services/menu/MenuService");
const MenuCategoryService_1 = require("../../services/menu/MenuCategoryService");
const MenuItemService_1 = require("../../services/menu/MenuItemService");
const menuRoutes = express_1.default.Router();
// services
const menuService = new MenuService_1.MenuService();
const menuCatService = new MenuCategoryService_1.MenuCategoryService();
const menuItemService = new MenuItemService_1.MenuItemService();
// routes
menuRoutes.get("/:businessId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield menuService.getMenu(res, parseInt(req.params.businessId, 10)); }));
menuRoutes.get("/item/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield menuItemService.getMenuItem(res, parseInt(req.params.itemId, 10)); }));
menuRoutes.post("/menu", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield menuService.updateMenu(res, req.body); }));
menuRoutes.post("/category", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield menuCatService.updateMenuCategory(res, req.body); }));
menuRoutes.post("/item", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield menuItemService.updateMenuItem(res, req.body); }));
exports.default = menuRoutes;
//# sourceMappingURL=MenuApi.js.map