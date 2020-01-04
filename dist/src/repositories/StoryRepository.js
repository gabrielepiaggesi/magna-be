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
const Repository_1 = require("./Repository");
const QueryBuilder_1 = require("../utils/QueryBuilder");
const LOG = new Logger_1.Logger("StoryRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
class StoryRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "stories";
    }
    findStoriesToShow(storiesId, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereIn = queryBuilder.getWhereIn(storiesId);
            query = query ||
                `select * \
            from ${this.table} \
            where id not in (${whereIn}) and \
            deleted_at is null \
            limit ${limit}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    showStories(lastStoryId = 0, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastStoryId == 0) {
                query = query ||
                    `select * \
            from ${this.table} \
            where deleted_at is null \
            order by id desc \
            limit ${limit}`;
            }
            else {
                query = query ||
                    `select * \
            from ${this.table} \
            where id < ${lastStoryId} and \
            deleted_at is null \
            order by id desc \
            limit ${limit}`;
            }
            return yield this.db.query(query).then((results) => results);
        });
    }
}
exports.StoryRepository = StoryRepository;
//# sourceMappingURL=StoryRepository.js.map