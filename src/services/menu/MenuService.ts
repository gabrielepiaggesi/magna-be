import { Response } from "express";
import { Logger } from "../../utils/Logger";
import { auth } from "../../integration/middleware";
import { MenuRepository } from "../../repositories/menu/MenuRepository";
import { Menu } from "../../models/menu/Menu";
import { MenuCategoryRepository } from "../../repositories/menu/MenuCategoryRepository";
import { MenuItemRepository } from "../../repositories/menu/MenuItemRepository";
import { Comment } from "../../models/menu/Comment";
import { CommentRepository } from "../../repositories/menu/CommentRepository";

const LOG = new Logger("MenuService.class");
const menuRepository = new MenuRepository();
const catRepo = new MenuCategoryRepository();
const comRepository = new CommentRepository();
const itemRepo = new MenuItemRepository();
const db = require("../../connection");

export class MenuService {

    public async getMenus(res: Response, creatorId: number) {
        const plans = await menuRepository.findByBusinessId(creatorId);
        return res.status(200).send(plans);
    }

    public async getComments(res: Response, creatorId: number) {
        const plans = await comRepository.findByBusinessId(creatorId);
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
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let menu = new Menu();
            if (obj.id) {
                menu = await menuRepository.findById(obj.id, connection);
            }

            menu.business_id = loggedId;
            menu.name = obj.name;
            menu.status = 'active';

            if (!obj.delete) {
                if (obj.id) {
                    await menuRepository.update(menu, connection);
                } else {
                    const id = await menuRepository.save(menu, connection);
                    menu.id = id.insertId;
                }
            } else if (obj.id) {
                await menuRepository.delete(menu, connection);
            }

            const menus = await menuRepository.findByBusinessId(loggedId, connection);
            await connection.commit();
            return res.status(200).send(menus);
        } catch (e) {
            await connection.rollback();
            LOG.error("new creator plan error", e);
            return res.status(500).send(e);
        }
    }

    public async commentMenu(res: Response, businessId: number, obj) {
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let menu = new Comment()
            menu.business_id = businessId;
            menu.text = obj.comment;

            await comRepository.save(menu, connection);
            await connection.commit();
            return res.status(200).send({status: "success"});
        } catch (e) {
            await connection.rollback();
            LOG.error("new comment error", e);
            return res.status(500).send(e);
        }
    }

}
