import { Repository } from "../../framework/repositories/Repository";
import { BlackList } from "../model/BlackList";
const db = require("../../connection");
import mysql from "mysql";

export class BlackListRepository extends Repository<BlackList> {
    public table = "black_lists";

    public async countByUserId(userId, statusNotIn: any[] = null, conn = null, query = null) {
        const c = conn || await db.connection();
        const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
        return c.query(query || 
            `select count(*) 
            from ${this.table} rep 
            where rep.user_id = ${userId} ${whereIn} 
            and rep.deleted_at is null 
            and rep.created_at >= ${mysql.escape(this.getWeekAgo())}`
        ).then((results) => results[0]);
    }

    public async countByReporterId(userId, statusNotIn: any[] = null, conn = null, query = null) {
        const c = conn || await db.connection();
        const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
        return c.query(query || 
            `select count(*) 
            from ${this.table} rep 
            where rep.reporter_id = ${userId} ${whereIn} 
            and rep.deleted_at is null 
            group by user_id 
            and rep.created_at >= ${mysql.escape(this.getWeekAgo())}`
        ).then((results) => results[0]);
    }

    public async countByReporterIdAndUserId(reporterId, userId, statusNotIn: any[] = null, conn = null, query = null) {
        const c = conn || await db.connection();
        const whereIn = (statusNotIn) ? ` and rep.reason not in (${this.queryBuilder.getWhereIn(statusNotIn)}) ` : ` `;
        return c.query(query || 
            `select count(*) 
            from ${this.table} rep 
            where rep.reporter_id = ${reporterId} ${whereIn} 
            and rep.user_id = ${userId} 
            and rep.deleted_at is null 
            and rep.created_at >= ${mysql.escape(this.getWeekAgo())}`
        ).then((results) => results[0]);
    }

    private getWeekAgo() {
        let d = new Date(Date.now());
        const dd = d.getDate() - 7;
        d.setDate(dd);
        const weekAgo = d.toISOString().substring(0, 19).replace("T", " ");
        return weekAgo;
    }
}
