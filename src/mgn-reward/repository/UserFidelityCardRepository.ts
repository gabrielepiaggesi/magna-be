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

    public async findByUserId(userId: number, conn = null,  query = null): Promise<UserFidelityCard[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where user_id = ${mysql2.escape(userId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
