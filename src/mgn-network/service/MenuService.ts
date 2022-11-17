import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { IndroError } from "../../utils/IndroError";
import { Logger } from "../../utils/Logger";
import { Menu } from "../model/Menu";
import { MenuCategoryRepository } from "../repository/MenuCategoryRepository";
import { MenuItemRepository } from "../repository/MenuItemRepository";
import { MenuRepository } from "../repository/MenuRepository";

const LOG = new Logger("MenuService.class");
const menuRepository = new MenuRepository();
const catRepo = new MenuCategoryRepository();
// const comRepository = new CommentRepository();
const itemRepo = new MenuItemRepository();
const userBusinessRepository = new UserBusinessRepository();
const db = require("../../connection");

export class MenuService {

    public async getMenus(businessId: number) {
        const connection = await db.connection();
        const plans = await menuRepository.findByBusinessId(businessId, connection);
        await connection.release();
        return plans;
    }

    // public async getComments(res: Response, creatorId: number) {
    //     const connection = await db.connection();
    //     const plans = await comRepository.findByBusinessId(creatorId, connection);
    //     await connection.release();
    //     return res.status(200).send(plans);
    // }

    public async getMenu(menuId: number) {
        let arra = [];
        const connection = await db.connection();
        let cats = await catRepo.findByMenuId(menuId, connection);
        // assign postition = position || id
        cats = cats.map((i) => { i.cat_position = (i.cat_position) ? i.cat_position : i.id; return i; });
        // order sort array based on position
        cats = cats.sort((a,b) => a.cat_position - b.cat_position);
        // LOG.debug('array cat', cats);
        for(let cat of cats) {
            let items = await itemRepo.findByCategoryId(cat.id, connection);
            // foreach item
            // assign postition = position || id
            items = items.map((i) => { i.item_position = (i.item_position) ? i.item_position : i.id; return i; });
            // order sort array based on position
            items = items.sort((a,b) => a.item_position - b.item_position);
            const categ = {
                name: cat.name,
                id: cat.id,
                cat_position: cat.cat_position,
                message: cat.message,
                items
            };
            arra.push(categ);
        }
        arra = arra.sort((a,b) => a.cat_position - b.cat_position);
        await connection.release();
        return arra;
    }

    public async updateMenu(dto: any, businessId: number, menuId: number = 0, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);
        if (!businessesIds.includes(businessId)) {
            await connection.release();
            return [];
        }

        await connection.newTransaction();
        try {
            let menu = !menuId ? new Menu() : await menuRepository.findById(dto.id, connection);
            menu.business_id = businessId;
            menu.name = dto.name;
            menu.status = 'active';

            if (!dto.delete) {
                const res = menuId ? await menuRepository.update(menu, connection) : await menuRepository.save(menu, connection);
                menu.id = menuId ? menuId : res.insertId;
            } else if (menuId) {
                await menuRepository.delete(menu, connection);
            }

            const menus = await menuRepository.findByBusinessId(businessId, connection);
            await connection.commit();
            await connection.release();
            return menus;
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator plan error", e);
            throw new IndroError("Cannot updateMenu", 500, null, e);
        }
    }

    // public async commentMenu(res: Response, businessId: number, obj) {
    //     const connection = await db.connection();
    //     await connection.newTransaction();
    //     try {
    //         let menu = new Comment()
    //         menu.business_id = businessId;
    //         menu.text = obj.comment;

    //         await comRepository.save(menu, connection);
    //         await connection.commit();
    //         await connection.release();
    //         return res.status(200).send({status: "success"});
    //     } catch (e) {
    //         await connection.rollback();
    //         await connection.release();
    //         LOG.error("new comment error", e);
    //         return res.status(500).send(e);
    //     }
    // }

}
