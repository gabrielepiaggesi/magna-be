import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { auth } from "../../integration/middleware";
import { MenuRepository } from "../../repositories/menu/MenuRepository";
import { Menu } from "../../models/menu/Menu";

const LOG = new Logger("MenuService.class");
const menuRepository = new MenuRepository();
const db = require("../../database");

export class MenuService {

    public async getMenus(res: Response, creatorId: number) {
        const plans = await menuRepository.findByBusinessId(creatorId);
        return res.status(200).send(plans);
    }

    public async getMenu(res: Response, menuId: number) {
        const plan = await menuRepository.findById(menuId);
        return res.status(200).send(plan);
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
                    menu.id = id;
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
