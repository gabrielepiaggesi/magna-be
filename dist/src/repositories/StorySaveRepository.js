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
const LOG = new Logger_1.Logger("StoryLikeRepository.class");
const queryBuilder = new QueryBuilder_1.QueryBuilder();
class StorySaveRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "stories_saved";
    }
    findByUserIdAndFullStoryId(userId, fullStoryId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            return yield this.db.query(query || `select * from ${this.table} where user_id = ${userId} and full_story_id = ${fullStoryId} and deleted_at is null limit 1`).then((results) => results[0]);
        });
    }
}
exports.StorySaveRepository = StorySaveRepository;
//# sourceMappingURL=StorySaveRepository.js.map