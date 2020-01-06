import { Database } from "../database";
import { User } from "../models/User";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
import { Story } from "../models/Story";
import { QueryBuilder } from "../utils/QueryBuilder";
import { FullStory } from "../models/FullStory";
import { StoryLike } from "../models/StoryLike";
const LOG = new Logger("StoryLikeRepository.class");
const queryBuilder = new QueryBuilder();

export class StorySaveRepository extends Repository<StoryLike> {
    public table = "stories_saved";

    public async findByUserIdAndFullStoryId(userId: number, fullStoryId: number, query = null) {
        // tslint:disable-next-line:max-line-length
        return await this.db.query(query || `select * from ${this.table} where user_id = ${userId} and full_story_id = ${fullStoryId} and deleted_at is null limit 1`).then((results) => results[0]);
    }
}
