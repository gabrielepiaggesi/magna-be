import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { MenuItemRepository } from "../../repositories/menu/MenuItemRepository";
import { MenuItem } from "../../models/menu/MenuItem";

const LOG = new Logger("MenuItemService.class");
const menuItemRepository = new MenuItemRepository();
const db = require("../../database");

export class MenuItemService {

    public async getMenusItems(res: Response, categoryId: number) {
        const plans = await menuItemRepository.findByCategoryId(categoryId);
        return res.status(200).send(plans);
    }

    public async getMenuItem(res: Response, itemId: number) {
        const plan = await menuItemRepository.findById(itemId);
        return res.status(200).send(plan);
    }

    public async updateMenuItem(res: Response, obj) {
        await db.newTransaction();
        try {
            let menu = new MenuItem();
            menu.category_id = obj.category_id;
            if (obj.item_id) {
                menu = await menuItemRepository.findById(obj.item_id);
            }

            menu.name = obj.name;
            menu.bio = obj.bio;
            menu.price = obj.price;

            if (!obj.delete) {
                if (obj.item_id) {
                    await menuItemRepository.update(menu);
                } else {
                    await menuItemRepository.save(menu);
                }
            } else if (obj.item_id) {
                await menuItemRepository.delete(menu);
            }

            await db.commit();
            return res.status(200).send({ status: "success" });
        } catch (e) {
            await db.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

}
