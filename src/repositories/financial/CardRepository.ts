import { Repository } from "../Repository";
import { Card } from "../../models/financial/Card";

export class CardRepository extends Repository<Card> {
    public table = "cards";

    public async findByUserId(userId, query = null) {
        const q = `select * from cards where user_id = ${userId}`;
        return await this.db.query(query || q).then((results) => results[0]);
    }

    public async findByUserIdAndFingerprint(userId, fingerprint, query = null) {
        const q = `select * from cards where user_id = ${userId} and fingerprint = "${fingerprint}"`;
        return await this.db.query(query || q).then((results) => results[0]);
    }
}
