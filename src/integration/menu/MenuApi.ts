import express from "express";
import { auth } from "../middleware/index";
import { BusinessService } from "../../services/business/BusinessService";
import { MenuService } from "../../services/menu/MenuService";
import { MenuCategoryService } from "../../services/menu/MenuCategoryService";
import { MenuItemService } from "../../services/menu/MenuItemService";
const menuRoutes = express.Router();

// services
const menuService = new MenuService();
const menuCatService = new MenuCategoryService();
const menuItemService = new MenuItemService();

// routes
menuRoutes.get("/:businessId", async (req, res) => await menuService.getMenu(res, parseInt(req.params.businessId, 10)));
menuRoutes.get("/item/:itemId", async (req, res) => await menuItemService.getMenuItem(res, parseInt(req.params.itemId, 10)));

menuRoutes.post("/menu", auth.isUser, async (req, res) => await menuService.updateMenu(res, req.body));
menuRoutes.post("/category", auth.isUser, async (req, res) => await menuCatService.updateMenuCategory(res, req.body));
menuRoutes.post("/item", auth.isUser, async (req, res) => await menuItemService.updateMenuItem(res, req.body));

export default menuRoutes;
