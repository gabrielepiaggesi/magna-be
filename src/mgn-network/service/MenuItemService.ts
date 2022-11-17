import { UserBusinessRepository } from "../../mgn-entity/repository/UserBusinessRepository";
import { IndroError } from "../../utils/IndroError";
import { Logger } from "../../utils/Logger";
import { MenuItem } from "../model/MenuItem";
import { MenuItemRepository } from "../repository/MenuItemRepository";

const LOG = new Logger("MenuItemService.class");
const menuItemRepository = new MenuItemRepository();
const userBusinessRepository = new UserBusinessRepository();
const db = require("../../connection");

export class MenuItemService {

    public async getMenusItems(categoryId: number) {
        const connection = await db.connection();
        const plans = await menuItemRepository.findByCategoryId(categoryId, connection);
        await connection.release();
        return plans;
    }

    public async getMenuItem(itemId: number) {
        const connection = await db.connection();
        const plan = await menuItemRepository.findById(itemId, connection);
        await connection.release();
        return plan;
    }

    public async updateMenuItem(dto: any, businessId: number, menuItemId: number = 0, loggedUserId: number) {
        const connection = await db.connection();
        const userBusinesses = await userBusinessRepository.findByUserId(loggedUserId, connection);
        const businessesIds = userBusinesses.map(uB => uB.business_id);
        if (!businessesIds.includes(businessId)) {
            await connection.release();
            return [];
        }

        await connection.newTransaction();
        try {
            let menu = !menuItemId ? new MenuItem() : await menuItemRepository.findById(dto.id, connection);
            menu.category_id = dto.category_id;
            dto.name = dto.name.replace(/"/g, "'");
            dto.bio = (dto.bio) ? dto.bio.replace(/"/g, "'") : null;
            dto.price = dto.price.replace(/"/g, "'");

            menu.name = dto.name;
            menu.status = (dto.status && dto.status != ' ' && dto.status != '') ? dto.status : 'active';
            menu.bio = dto.bio;
            menu.item_position = dto.item_position;
            menu.price = dto.price;
            if (dto.is_freezed === false || dto.is_freezed === true || dto.is_freezed === 1 || dto.is_freezed === 0) menu.is_freezed = dto.is_freezed ? 1 : 0;
            if (dto.allergic_note) menu.allergic_note = dto.allergic_note;

            if (!dto.delete) {
                const res = menuItemId ? await menuItemRepository.update(menu, connection) : await menuItemRepository.save(menu, connection);
                menu.id = menuItemId ? menuItemId : res.insertId;
            } else if (menuItemId) {
                await menuItemRepository.delete(menu, connection);
            }

            await connection.commit();
            await connection.release();
            return menu;
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator plan error", e);
            throw new IndroError("Cannot updateMenuItem", 500, null, e);
        }
    }

}
