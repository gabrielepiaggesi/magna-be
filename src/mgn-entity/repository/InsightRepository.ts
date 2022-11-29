import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { AppVersion } from "../model/AppVersion";

export class InsightRepository extends Repository<number> {
    public table = "apps_versions";

    public async findTotalUsers(conn = null, query = null): Promise<number> {
        const c = conn;
        const q = `
            select count(u.id) 
            from users u 
            left join users_businesses ub on ub.user_id = u.id and ub.deleted_at is null 
            where u.deleted_at is null 
            and ub.id is null 
            and u.id >= 23
        `;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(u.id)'] || 0) : 0);
    }

    public async findTodayUsers(today: string, conn = null, query = null): Promise<number> {
        today = today + '%';
        const c = conn;
        const q = `
            select count(u.id) 
            from users u 
            left join users_businesses ub on ub.user_id = u.id and ub.deleted_at is null 
            where u.created_at like ${mysql2.escape(today)} 
            and u.deleted_at is null 
            and ub.id is null 
            and u.id >= 23
        `;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(u.id)'] || 0) : 0);
    }

    public async findTotalFidelitiesCards(conn = null, query = null): Promise<any[]> {
        const c = conn;
        const q = `select business_id from users_fidelities_cards where deleted_at is null and user_id >= 23`;
        return await c.query(query || q).then((results) => results);
    }

    public async findTotalBusinesses(conn = null, query = null): Promise<number> {
        const c = conn;
        const q = `select count(*) from businesses where deleted_at is null`;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
    }

    public async findTotalReservations(conn = null, query = null): Promise<number> {
        const c = conn;
        const q = `select count(*) from reservations where deleted_at is null and user_id != 1`;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
    }

    public async findTotalReservationsToday(today: string, conn = null, query = null): Promise<number> {
        today = today + '%';
        const c = conn;
        const q = `select count(*) from reservations where created_at like ${mysql2.escape(today)} and deleted_at is null and user_id != 1`;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
    }

    public async findTotalReviews(conn = null, query = null): Promise<number> {
        const c = conn;
        const q = `select count(*) from users_reviews where deleted_at is null and user_id != 1`;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
    }

    public async findTotalReviewsToday(today: string, conn = null, query = null): Promise<number> {
        today = today + '%';
        const c = conn;
        const q = `select count(*) from users_reviews where created_at like ${mysql2.escape(today)} and deleted_at is null and user_id != 1`;
        return await c.query(query || q).then((results) => results && results.length ? (results[0]['count(*)'] || 0) : 0);
    }
}
