import { Response } from "express";
import { auth } from "../..";
import { Logger } from "../../mgn-framework/services/Logger";
import { Get, Path, Post } from "../../utils/Decorator";
import { MenuCategoryService } from "../service/MenuCategoryService";
import { MenuItemService } from "../service/MenuItemService";
import { MenuService } from "../service/MenuService";

// services
const LOG = new Logger("MenuController.class");
const menuService = new MenuService();
const menuCatService = new MenuCategoryService();
const menuItemService = new MenuItemService();


// routes
// menuRoutes.get("/comment/:businessId", auth.isUser, async (req, res) => await menuService.getComments(res, parseInt(req.params.businessId, 10)));
// menuRoutes.post("/comment/:businessId", async (req, res) => await menuService.commentMenu(res, parseInt(req.params.businessId, 10), req.body));

export class MenuController {

    @Get()
    @Path("/getMenus/:businessId")
    public async getMenus(res: Response, req) {
        try {
            const response = await menuService.getMenus(parseInt(req.params.businessId, 10))
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.getMenus.Error'});
        }
    }

    @Get()
    @Path("/getMenu/:menuId")
    public async getMenu(res: Response, req) {
        try {
            const response = await menuService.getMenu(parseInt(req.params.menuId, 10))
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.getMenu.Error'});
        }
    }

    @Get()
    @Path("/getMenuItem/:itemId")
    public async getMenuItem(res: Response, req) {
        try {
            const response = await menuItemService.getMenuItem(parseInt(req.params.itemId, 10))
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.getMenuItem.Error'});
        }
    }

    @Post()
    @Path("/updateMenu/:businessId/:menuId")
    public async updateMenu(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await menuService.updateMenu(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.updateMenu.Error'});
        }
    }

    @Post()
    @Path("/updateMenuCategory/:businessId/:menuCategoryId")
    public async updateMenuCategory(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await menuCatService.updateMenuCategory(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuCategoryId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.updateMenuCategory.Error'});
        }
    }

    @Post()
    @Path("/updateMenuItem/:businessId/:menuItemId")
    public async updateMenuItem(res: Response, req) {
        try {
            const loggedUserId = auth.getLoggedUserId(req);
            const response = await menuItemService.updateMenuItem(req.body, parseInt(req.params.businessId, 10), parseInt(req.params.menuItemId, 10), loggedUserId);
            return res.status(200).json(response);
        } catch(e) {
            LOG.debug(e);
            return res.status(e.status || 500).json({ ...e, message: e.message, code: e.code || 'Menu.updateMenuItem.Error'});
        }
    }

}