import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserFidelityCard } from "../model/UserFidelityCard";

export class UserFidelityCardRepository extends Repository<UserFidelityCard> {
    public table = "users_fidelities_cards";
    // ${mysql2.escape(stripeId)}

    public async findActiveByUserId(userId: number, conn = null,  query = null): Promise<UserFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByUserIdAndBusinessId(userId: number, businessId: number, conn = null,  query = null): Promise<UserFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and business_id = ${mysql2.escape(businessId)} and status = 'ACTIVE' and deleted_at is null order by id desc`).then((results) => results);
    }

    public async findActiveByUserIdJoinBusiness(userId: number, conn = null,  query = null): Promise<UserFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
            select uf.*, b.name as business_name, bf.expenses_amount as business_expenses_amount, uf.expenses_amount as user_expenses_amount, b.phone_number as business_phone_number, 
            b.accept_reservations as accept_reservations, b.disable_reservation_today as disable_reservation_today, b.address as business_address, b.website as business_website 
            from ${this.table} uf 
            join businesses b on b.id = uf.business_id and b.deleted_at is null 
            join businesses_fidelities_cards bf on bf.id = uf.fidelity_card_id and bf.deleted_at is null and bf.status = 'ACTIVE' 
            where uf.user_id = ${mysql2.escape(userId)} 
            and uf.status = 'ACTIVE' 
            and uf.deleted_at is null 
            order by uf.id desc`
        ).then((results) => results);
    }

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
