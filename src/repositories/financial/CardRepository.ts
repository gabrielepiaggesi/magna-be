import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";

export class CardRepository extends Repository<Card> {
    public table = "cards";

    public async findByUserId(userId, query = null) {
        const q = `select * from cards where user_id = ${userId} and deleted_at is null`;
        return await this.db.query(query || q).then((results) => results);
    }

    public async findByUserIdAndFingerprint(userId, fingerprint, query = null) {
        const q = `select * from cards where user_id = ${userId} and fingerprint = "${fingerprint}" and deleted_at is null`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async resetNotPrincipalCard(userId) {
        const q = `
        update cards set principal = false where user_id = ${userId}`;
        return await this.db.query(q).then((results) => results[0]);
    }
}
