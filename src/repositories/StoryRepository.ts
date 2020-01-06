import { Database } from "../database";
import { User } from "../models/User";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
import { Story } from "../models/Story";
import { QueryBuilder } from "../utils/QueryBuilder";
const LOG = new Logger("StoryRepository.class");
const queryBuilder = new QueryBuilder();

export class StoryRepository extends Repository<Story> {
    public table = "stories";

    public async findStoriesToShow(storiesId: number[], limit = 20, query = null) {
        const whereIn = queryBuilder.getWhereIn(storiesId);
        query = query ||
            `select * 
            from stories 
            where id not in (${whereIn}) and 
            deleted_at is null 
            limit ${limit}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async showStories(userId, lastStoryId: number = 0, limit = 20, query = null) {
        if (lastStoryId == 0) {
            query = query ||
            `select story.*, liked.id as liked_id, save.id as saved_id 
            from stories story 
            left join stories_liked liked on liked.full_story_id = story.full_story_id and liked.user_id = ${userId} and liked.deleted_at is null 
            left join stories_saved save on save.full_story_id = story.full_story_id and save.user_id = ${userId} and save.deleted_at is null 
            where story.deleted_at is null 
            order by story.id desc 
            limit ${limit}`;
        } else {
            query = query ||
            `select story.*, liked.id as liked_id, save.id as saved_id 
            from stories story 
            left join stories_liked liked on liked.full_story_id = story.full_story_id and liked.user_id = ${userId} and liked.deleted_at is null 
            left join stories_saved save on save.full_story_id = story.full_story_id and save.user_id = ${userId} and save.deleted_at is null 
            where story.deleted_at is null and 
            story.id < ${lastStoryId} 
            order by story.id desc 
            limit ${limit}`;
        }
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async findStoriesByUserId(userId, lastStoryId: number = 0, limit = 20, query = null) {
        if (lastStoryId == 0) {
            query = query ||
            `select * 
            from stories 
            where deleted_at is null and 
            user_id = ${userId} 
            order by id desc 
            limit ${limit}`;
        } else {
            query = query ||
            `select * 
            from stories 
            where id < ${lastStoryId} and 
            deleted_at is null and 
            user_id = ${userId} 
            order by id desc 
            limit ${limit}`;
        }
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async findStoriesSavedByUserId(userId, lastStoryId: number = 0, limit = 20, query = null) {
        if (lastStoryId == 0) {
            query = query ||
            `select story.* 
            from stories_saved saved 
            inner join stories story on story.full_story_id = saved.full_story_id 
            where story.deleted_at is null and 
            saved.deleted_at is null and 
            saved.user_id = ${userId} 
            order by saved.id desc 
            limit ${limit}`;
        } else {
            query = query ||
            `select story.*  
            from stories_saved saved 
            inner join stories story on story.full_story_id = saved.full_story_id 
            where story.deleted_at is null and 
            saved.deleted_at is null and 
            saved.user_id = ${userId} and 
            saved.id < ${lastStoryId} 
            order by saved.id desc 
            limit ${limit}`;
        }
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async findStoriesLikedByUserId(userId, lastStoryId: number = 0, limit = 20, query = null) {
        if (lastStoryId == 0) {
            query = query ||
            `select story.*, liked.id as liked_id  
            from stories_liked liked 
            inner join stories story on story.full_story_id = liked.full_story_id 
            where story.deleted_at is null and 
            liked.deleted_at is null and 
            liked.user_id = ${userId} 
            order by liked.id desc 
            limit ${limit}`;
        } else {
            query = query ||
            `select story.*, liked.id as liked_id  
            from stories_saved liked 
            inner join stories story on story.full_story_id = liked.full_story_id 
            where story.deleted_at is null and 
            liked.deleted_at is null and 
            liked.user_id = ${userId} and 
            liked.id < ${lastStoryId} 
            order by liked.id desc 
            limit ${limit}`;
        }
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async findByFullStoryId(id: number, query = null) {
        // tslint:disable-next-line:max-line-length
        return await this.db.query(query || `select * from ${this.table} where full_story_id = ${id} and deleted_at is null limit 1`).then((results) => results[0]);
    }
}
