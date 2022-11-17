import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { IndroError } from "../../utils/IndroError";
import { Logger } from "../../utils/Logger";
import { MenuCategory } from "../model/MenuCategory";
import { MenuCategoryRepository } from "../repository/MenuCategoryRepository";

const LOG = new Logger("MenuCategoryService.class");
const menuCategoryRepository = new MenuCategoryRepository();
const userBusinessRepository = new UserBusinessRepository();
const db = require("../../connection");

export class MenuCategoryService {

    public async getMenusCategories(menuId: number) {
        const connection = await db.connection();
        const plans = await menuCategoryRepository.findByMenuId(menuId, connection);
        await connection.release();
        return plans;
    }

    public async getMenuCategory(catId: number) {
        const connection = await db.connection();
        const plan = await menuCategoryRepository.findById(catId, connection);
        await connection.release();
        return plan;
    }

    public async updateMenuCategory(dto: any, businessId: number, menuCategoryId: number = 0, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);
        if (!businessesIds.includes(businessId)) {
            await connection.release();
            return [];
        }

        await connection.newTransaction();
        try {
            let menu = !menuCategoryId ? new MenuCategory() : await menuCategoryRepository.findById(dto.id, connection);
            menu.menu_id = dto.menu_id;
            menu.name = dto.name;
            if (dto.cat_position) menu.cat_position = dto.cat_position;
            if (dto.message) menu.message = dto.message;

            if (!dto.delete) {
                const res = menuCategoryId ? await menuCategoryRepository.update(menu, connection) : await menuCategoryRepository.save(menu, connection);
                menu.id = menuCategoryId ? menuCategoryId : res.insertId;
            } else if (menuCategoryId) {
                await menuCategoryRepository.delete(menu, connection);
            }

            await connection.commit();
            await connection.release();
            return menu;
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator plan error", e);
            throw new IndroError("Cannot updateMenuCategory", 500, null, e);
        }
    }

}
