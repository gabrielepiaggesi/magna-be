import { Repository } from "../../mgn-framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { AppVersion } from "../model/AppVersion";

export class AppVersionRepository extends Repository<AppVersion> {
    public table = "apps_versions";

    public async findLastActiveAppVersion(conn = null, query = null): Promise<AppVersion> {
        const c = conn;
        const q = `select * from ${this.table} where deleted_at is null order by id desc limit 1`;
        return await c.query(query || q).then((results) => results[0] || null);
    }
}
