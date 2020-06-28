import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { auth } from "../../integration/middleware";
import { MenuRepository } from "../../repositories/menu/MenuRepository";
import { Menu } from "../../models/menu/Menu";
import { MenuCategoryRepository } from "../../repositories/menu/MenuCategoryRepository";
import { MenuItemRepository } from "../../repositories/menu/MenuItemRepository";

const LOG = new Logger("MenuService.class");
const menuRepository = new MenuRepository();
const catRepo = new MenuCategoryRepository();
const itemRepo = new MenuItemRepository();
const db = require("../../database");

export class MenuService {

    public async getMenus(res: Response, creatorId: number) {
        const plans = await menuRepository.findByBusinessId(creatorId);
        return res.status(200).send(plans);
    }

    public async getMenu(res: Response, menuId: number) {
        let arra = [];
        let cats = await catRepo.findByMenuId(menuId);
        // assign postition = position || id
        cats = cats.map((i) => { i.position = (i.position) ? i.position : i.id; return i; });
        // order sort array based on position
        cats = cats.sort((a,b) => a.position - b.position);
        LOG.debug('array cat', cats);
        for(let cat of cats) {
            let items = await itemRepo.findByCategoryId(cat.id);
            // foreach item
            // assign postition = position || id
            items = items.map((i) => { i.position = (i.position) ? i.position : i.id; return i; });
            // order sort array based on position
            items = items.sort((a,b) => a.position - b.position);
            const categ = {
                name: cat.name,
                id: cat.id,
                position: cat.position,
                items
            };
            arra.push(categ);
        }
        arra = arra.sort((a,b) => a.position - b.position);
        return res.status(200).send(arra);
    }

    public async updateMenu(res: Response, obj) {
        const loggedId = auth.loggedId;
        await db.newTransaction();
        try {
            let menu = new Menu();
            if (obj.id) {
                menu = await menuRepository.findById(obj.id);
            }

            menu.business_id = loggedId;
            menu.name = obj.name;
            menu.status = 'active';

            if (!obj.delete) {
                if (obj.id) {
                    await menuRepository.update(menu);
                } else {
                    const id = await menuRepository.save(menu);
                    menu.id = id.insertId;
                }
            } else if (obj.id) {
                await menuRepository.delete(menu);
            }

            await db.commit();
            const menus = await menuRepository.findByBusinessId(loggedId);
            return res.status(200).send(menus);
        } catch (e) {
            await db.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

}
