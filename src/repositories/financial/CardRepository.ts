import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";
const db = require("../../connection");
import mysql from "mysql";

export class CardRepository extends Repository<Card> {
    public table = "cards";

    public async findByUserId(userId: number, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from cards where user_id = ${userId} and deleted_at is null order by created_at desc`;
        return await c.query(query || q).then((results) => results);
    }

    public async findByUserIdAndFingerprint(userId: number, fingerprint, conn = null, query = null) {
        const c = conn || await db.connection();
        const q = `select * from cards where user_id = ${userId} and fingerprint = ${mysql.escape(fingerprint)} and deleted_at is null`;
        return await c.query(query || q).then((results) => results[0]);
    }

    public async resetNotPrincipalCard(userId: number, conn = null) {
        const c = conn || await db.connection();
        const q = `
        update cards set principal = false where user_id = ${userId}`;
        return await c.query(q).then((results) => results[0]);
    }
}
