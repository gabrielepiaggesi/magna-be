import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { MenuCategoryRepository } from "../../repositories/menu/MenuCategoryRepository";
import { MenuCategory } from "../../models/menu/MenuCategory";

const LOG = new Logger("MenuCategoryService.class");
const menuCategoryRepository = new MenuCategoryRepository();
const db = require("../../connection");

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
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let menu = new MenuCategory();
            menu.menu_id = obj.menu_id;
            if (obj.id) {
                menu = await menuCategoryRepository.findById(obj.id, connection);
            }

            menu.name = obj.name;

            if (!obj.delete) {
                if (obj.id) {
                    await menuCategoryRepository.update(menu, connection);
                } else {
                    const id = await menuCategoryRepository.save(menu, connection);
                    menu.id = id.insertId;
                }
            } else if (obj.id) {
                await menuCategoryRepository.delete(menu, connection);
            }

            await connection.commit();
            return res.status(200).send(menu);
        } catch (e) {
            await connection.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

}
