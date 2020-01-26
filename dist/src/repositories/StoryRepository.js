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
                `select * 
            from stories 
            where id not in (${whereIn}) and 
            deleted_at is null 
            limit ${limit}`;
            return yield this.db.query(query).then((results) => results);
        });
    }
    showStories(userId, lastStoryId = 0, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastStoryId == 0) {
                query = query ||
                    `select story.*, liked.id as liked_id, save.id as saved_id 
            from stories story 
            left join stories_liked liked on liked.full_story_id = story.full_story_id and liked.user_id = ${userId} and liked.deleted_at is null 
            left join stories_saved save on save.full_story_id = story.full_story_id and save.user_id = ${userId} and save.deleted_at is null 
            where story.deleted_at is null 
            group by story.id 
            order by story.id desc 
            limit ${limit}`;
            }
            else {
                query = query ||
                    `select story.*, liked.id as liked_id, save.id as saved_id 
            from stories story 
            left join stories_liked liked on liked.full_story_id = story.full_story_id and liked.user_id = ${userId} and liked.deleted_at is null 
            left join stories_saved save on save.full_story_id = story.full_story_id and save.user_id = ${userId} and save.deleted_at is null 
            where story.deleted_at is null and 
            story.id < ${lastStoryId} 
            group by story.id 
            order by story.id desc 
            limit ${limit}`;
            }
            return yield this.db.query(query).then((results) => results);
        });
    }
    findStoriesByUserId(userId, lastStoryId = 0, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastStoryId == 0) {
                query = query ||
                    `select * 
            from stories 
            where deleted_at is null and 
            user_id = ${userId} 
            order by id desc 
            limit ${limit}`;
            }
            else {
                query = query ||
                    `select * 
            from stories 
            where id < ${lastStoryId} and 
            deleted_at is null and 
            user_id = ${userId} 
            order by id desc 
            limit ${limit}`;
            }
            return yield this.db.query(query).then((results) => results);
        });
    }
    findStoriesSavedByUserId(userId, lastStoryId = 0, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastStoryId == 0) {
                query = query ||
                    `select story.* 
            from stories_saved saved 
            inner join stories story on story.full_story_id = saved.full_story_id 
            where story.deleted_at is null and 
            saved.deleted_at is null and 
            saved.user_id = ${userId} 
            group by story.id 
            order by saved.id desc 
            limit ${limit}`;
            }
            else {
                query = query ||
                    `select story.*  
            from stories_saved saved 
            inner join stories story on story.full_story_id = saved.full_story_id 
            where story.deleted_at is null and 
            saved.deleted_at is null and 
            saved.user_id = ${userId} and 
            saved.id < ${lastStoryId} 
            group by story.id 
            order by saved.id desc 
            limit ${limit}`;
            }
            return yield this.db.query(query).then((results) => results);
        });
    }
    findStoriesLikedByUserId(userId, lastStoryId = 0, limit = 20, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lastStoryId == 0) {
                query = query ||
                    `select story.*, liked.id as liked_id  
            from stories_liked liked 
            inner join stories story on story.full_story_id = liked.full_story_id 
            where story.deleted_at is null and 
            liked.deleted_at is null and 
            liked.user_id = ${userId} 
            group by story.id 
            order by liked.id desc 
            limit ${limit}`;
            }
            else {
                query = query ||
                    `select story.*, liked.id as liked_id  
            from stories_saved liked 
            inner join stories story on story.full_story_id = liked.full_story_id 
            where story.deleted_at is null and 
            liked.deleted_at is null and 
            liked.user_id = ${userId} and 
            liked.id < ${lastStoryId} 
            group by story.id 
            order by liked.id desc 
            limit ${limit}`;
            }
            return yield this.db.query(query).then((results) => results);
        });
    }
    findByFullStoryId(id, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:max-line-length
            return yield this.db.query(query || `select * from ${this.table} where full_story_id = ${id} and deleted_at is null limit 1`).then((results) => results[0]);
        });
    }
}
exports.StoryRepository = StoryRepository;
//# sourceMappingURL=StoryRepository.js.map