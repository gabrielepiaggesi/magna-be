import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { MenuItemRepository } from "../../repositories/menu/MenuItemRepository";
import { MenuItem } from "../../models/menu/MenuItem";

const LOG = new Logger("MenuItemService.class");
const menuItemRepository = new MenuItemRepository();
const db = require("../../connection");

export class MenuItemService {

    public async getMenusItems(res: Response, categoryId: number) {
        const connection = await db.connection();
        const plans = await menuItemRepository.findByCategoryId(categoryId, connection);
        await connection.release();
        return res.status(200).send(plans);
    }

    public async getMenuItem(res: Response, itemId: number) {
        const connection = await db.connection();
        const plan = await menuItemRepository.findById(itemId, connection);
        await connection.release();
        return res.status(200).send(plan);
    }

    public async updateMenuItem(res: Response, obj) {
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let menu = new MenuItem();
            menu.category_id = obj.category_id;
            if (obj.id) {
                menu = await menuItemRepository.findById(obj.id, connection);
            }

            obj.name = obj.name.replace(/"/g, "'");
            obj.bio = (obj.bio) ? obj.bio.replace(/"/g, "'") : null;
            obj.price = obj.price.replace(/"/g, "'");

            menu.name = obj.name;
            menu.status = (obj.status && obj.status != ' ' && obj.status != '') ? obj.status : 'active';
            menu.bio = obj.bio;
            menu.position = obj.position;
            menu.price = obj.price;

            if (!obj.delete) {
                if (obj.id) {
                    await menuItemRepository.update(menu, connection);
                } else {
                    const id = await menuItemRepository.save(menu, connection);
                    menu.id = id.insertId;
                }
            } else if (obj.id) {
                await menuItemRepository.delete(menu, connection);
            }

            await connection.commit();
            await connection.release();
            return res.status(200).send(menu);
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

}
