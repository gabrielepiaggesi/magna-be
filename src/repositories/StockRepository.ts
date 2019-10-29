import { Stock } from "../models/Stock";
import { Logger } from "../utils/Logger";
import { QueryBuilder } from "../utils/QueryBuilder";
import { Repository } from "./Repository";
const LOG = new Logger("StockRepository.class");
const queryBuilder = new QueryBuilder();

export class StockRepository extends Repository<Stock> {
    public table = "stocks";

    public async findByCreatorIdAndStatus(creatorId: number, status: string[], limit, query = null) {
        // tslint:disable-next-line:max-line-length
        const whereIn = queryBuilder.getWhereIn(status);
        query = query ||
            `select * \
            from ${this.table} \
            where creator_id = ${creatorId} and \
            status in (${whereIn}) and \
            deleted_at is null \
            limit ${limit}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    // tslint:disable-next-line:max-line-length
    public async updateByIdsWithStatusAndWithBuyerIdWithParentPaymentId(stocksIds, status, buyerId, parentId, query = null) {
        const whereIn = queryBuilder.getWhereIn(stocksIds);
        query = query ||
        `update ${this.table} \
        set status = "${status}", buyer_id = ${buyerId}, parent_payment_id = ${parentId} \
        where id in (${whereIn})`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    // tslint:disable-next-line:max-line-length
    public async updateByPaymentIdWithStatusWithDeletedAt(piId, status, deletedAt, query = null) {
        query = query ||
        `update ${this.table} set status = "${status}", deleted_at = ${deletedAt ? `"${deletedAt}"` : null} where payment_id = ${piId}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    // tslint:disable-next-line:max-line-length
    public async updateByParentPaymentIdWithStatusWithParentPaymentId(piId, status, parentPiId, query = null) {
        query = query ||
        `update ${this.table} set status = "${status}", parent_payment_id = ${parentPiId} where parent_payment_id = ${piId}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    // tslint:disable-next-line:max-line-length
    public async updateByCreatorIdAndByUserIdWithStatusWithLimit(creatorId, userId, status, limit, query = null) {
        query = query ||
        `update ${this.table} \
        set status = "${status}" \
        where creator_id = ${creatorId} \
        and user_id = ${userId} \
        order by updated_at \
        limit ${limit}`;
        return await this.db.query(query).then((results: any[]) => results);
    }
}
