import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { Notification } from '../model/Notification';

export class NotificationRepository extends Repository<Notification> {
    public table = "notifications";
    // ${mysql2.escape(stripeId)}

    public async whereBusinessesIdsIn(businessIds: number[], conn = null, query = null): Promise<Notification[]> {
        if (!businessIds.length) return [];
        const c = conn;
        return c.query(query || 
            `select n.*, b.name as business_name  
            from ${this.table} n 
            join businesses b on b.id = n.business_id and b.deleted_at is null 
            where n.business_id in (?) and n.deleted_at is null order by n.id desc`, [businessIds]
        ).then((results) => results);
    }

    public async findByBusinessId(businessId: number, conn = null,  query = null): Promise<Notification[]> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return c.query(query || `
        select * from ${this.table} where business_id = ${mysql2.escape(businessId)} and deleted_at is null order by id desc`).then((results) => results);
    }
}
