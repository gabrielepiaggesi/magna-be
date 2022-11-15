import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Business } from "../model/Business";

export class BusinessRepository extends Repository<Business> {
    public table = "businesses";
    // ${mysql2.escape(stripeId)}

    public async whereBusinessesIdsIn(businessIds: number[], conn = null, query = null): Promise<Business[]> {
        if (!businessIds.length) return [];
        const c = conn;
        return c.query(query || 
            `select * 
            from ${this.table} 
            where id in (?) and deleted_at is null order by id asc`, [businessIds]
        ).then((results) => results);
    }

    public async findByUserIdAndBusinessId(businessId: number, userId: number, conn = null,  query = null): Promise<Business> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and id = ${mysql2.escape(businessId)} and deleted_at is null limit 1`).then((results) => results[0]);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<Business[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findByCap(caps: string[], businessesIds: number[], conn = null,  query = null): Promise<Business[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select b.*,  
            b.id as business_id, 
            b.name as business_name, 
            b.phone_number as business_phone_number, 
            b.discount_on_first_reservation as business_discount_on_first_reservation, 
            b.second_phone_number as business_second_phone_number, 
            b.accept_reservations as accept_reservations, 
            b.disable_reservation_today as disable_reservation_today, 
            b.address as business_address, 
            b.description as business_description, 
            b.website as business_website, 
            b.menu_link as business_menu_link, 
            b.instagram_page as business_instagram_page, 
            bf.expenses_amount as business_expenses_amount, 
            bf.type as business_card_type, 
            bd.amount as discount_amount, 
            bd.monthly_limit as discount_monthly_limit, 
            bd.minimum_expense as discount_minimum_expense, 
            bd.type as discount_type, 
            bd.slogan as slogan,
            ba.amount as fa_discount_amount, 
            ba.monthly_limit as fa_discount_monthly_limit, 
            ba.minimum_expense as fa_discount_minimum_expense, 
            ba.type as fa_discount_type, 
            ba.slogan as fa_slogan  
            from ${this.table} b 
            left join businesses_fidelities_cards bf on bf.business_id = b.id and bf.deleted_at is null and bf.status = 'ACTIVE' 
            left join businesses_discounts bd on bd.business_id = b.id and bd.origin = 'FIDELITY_CARD' and bd.deleted_at is null and bd.status = 'ACTIVE' 
            left join businesses_discounts ba on ba.business_id = b.id and ba.origin = 'FIRST_ACTION' and ba.deleted_at is null and ba.status = 'ACTIVE' 
            where b.cap in (?) 
            and b.id not in (?) 
            and b.deleted_at is null 
            order by b.id desc`, [caps, businessesIds]
        ).then((results) => results);
    }

    public findInfoByBusinessId(businessId: number, conn = null,  query = null): Promise<Business> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select b.*,  
            b.id as business_id, 
            b.name as business_name, 
            b.phone_number as business_phone_number, 
            b.second_phone_number as business_second_phone_number, 
            b.accept_reservations as accept_reservations, 
            b.disable_reservation_today as disable_reservation_today, 
            b.address as business_address, 
            b.website as business_website, 
            b.menu_link as business_menu_link, 
            b.instagram_page as business_instagram_page, 
            bf.expenses_amount as business_expenses_amount, 
            bf.type as business_card_type, 
            bd.amount as discount_amount, 
            bd.monthly_limit as discount_monthly_limit, 
            bd.minimum_expense as discount_minimum_expense, 
            bd.type as discount_type, 
            bd.slogan as slogan  
            from ${this.table} b 
            left join businesses_fidelities_cards bf on bf.business_id = b.id and bf.deleted_at is null and bf.status = 'ACTIVE' 
            left join businesses_discounts bd on bd.business_id = b.id and bd.origin = 'FIDELITY_CARD' and bd.deleted_at is null and bd.status = 'ACTIVE' 
            where b.id = ${mysql2.escape(businessId)} 
            and b.deleted_at is null 
            limit 1`
        ).then((results) => results[0] || null);
    }

    public async findTotalBusinesses( conn = null, query = null) {
        const c = conn;
        const q = `select * from ${this.table} and deleted_at is null`;
        return await c.query(query || q).then((results) => results);
    }
}
