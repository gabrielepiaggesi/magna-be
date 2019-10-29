"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../utils/Logger");
const QueryBuilder_1 = require("../utils/QueryBuilder");
const Repository_1 = require("./Repository");
const LOG = new Logger_1.Logger("StockRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
class StockRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "stocks";
    }
    findByCreatorIdAndStatus(creatorId, status, limit, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            const whereIn = queryBuilder.getWhereIn(status);
            query = query ||
                `select * \
            from ${this.table} \
            where creator_id = ${creatorId} and \
            status in (${whereIn}) and \
            deleted_at is null \
            limit ${limit}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    // tslint:disable-next-line:max-line-length
    updateByIdsWithStatusAndWithBuyerIdWithParentPaymentId(stocksIds, status, buyerId, parentId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereIn = queryBuilder.getWhereIn(stocksIds);
            query = query ||
                `update ${this.table} \
        set status = "${status}", buyer_id = ${buyerId}, parent_payment_id = ${parentId} \
        where id in (${whereIn})`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    // tslint:disable-next-line:max-line-length
    updateByPaymentIdWithStatusWithDeletedAt(piId, status, deletedAt, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query ||
                `update ${this.table} set status = "${status}", deleted_at = ${deletedAt ? `"${deletedAt}"` : null} where payment_id = ${piId}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    // tslint:disable-next-line:max-line-length
    updateByParentPaymentIdWithStatusWithParentPaymentId(piId, status, parentPiId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query ||
                `update ${this.table} set status = "${status}", parent_payment_id = ${parentPiId} where parent_payment_id = ${piId}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    // tslint:disable-next-line:max-line-length
    updateByCreatorIdAndByUserIdWithStatusWithLimit(creatorId, userId, status, limit, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query ||
                `update ${this.table} \
        set status = "${status}" \
        where creator_id = ${creatorId} \
        and user_id = ${userId} \
        order by updated_at \
        limit ${limit}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
}
exports.StockRepository = StockRepository;
//# sourceMappingURL=StockRepository.js.map