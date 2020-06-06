import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { MenuCategoryRepository } from "../../repositories/menu/MenuCategoryRepository";
import { MenuCategory } from "../../models/menu/MenuCategory";

const LOG = new Logger("MenuCategoryService.class");
const menuCategoryRepository = new MenuCategoryRepository();
const db = require("../../database");

export class MenuCategoryService {

    public async getMenusCategories(res: Response, menuId: number) {
        const plans = await menuCategoryRepository.findByMenuId(menuId);
        return res.status(200).send(plans);
    }

    public async getMenuCategory(res: Response, catId: number) {
        const plan = await menuCategoryRepository.findById(catId);
        return res.status(200).send(plan);
    }

    public async updateMenuCategory(res: Response, obj) {
        await db.newTransaction();
        try {
            let menu = new MenuCategory();
            menu.menu_id = obj.menu_id;
            if (obj.id) {
                menu = await menuCategoryRepository.findById(obj.id);
            }

            menu.name = obj.name;

            if (!obj.delete) {
                if (obj.id) {
                    await menuCategoryRepository.update(menu);
                } else {
                    const id = await menuCategoryRepository.save(menu);
                    menu.id = id.insertId;
                }
            } else if (obj.id) {
                await menuCategoryRepository.delete(menu);
            }

            await db.commit();
            return res.status(200).send(menu);
        } catch (e) {
            await db.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

}
