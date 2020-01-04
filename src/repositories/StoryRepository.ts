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
            `select * \
            from ${this.table} \
            where id not in (${whereIn}) and \
            deleted_at is null \
            limit ${limit}`;
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async showStories(lastStoryId: number = 0, limit = 20, query = null) {
        if (lastStoryId == 0) {
            query = query ||
            `select * \
            from ${this.table} \
            where deleted_at is null \
            order by id desc \
            limit ${limit}`;
        } else {
            query = query ||
            `select * \
            from ${this.table} \
            where id < ${lastStoryId} and \
            deleted_at is null \
            order by id desc \
            limit ${limit}`;
        }
        return await this.db.query(query).then((results: any[]) => results);
    }

    public async findByFullStoryId(id: number, query = null) {
        // tslint:disable-next-line:max-line-length
        return await this.db.query(query || `select * from ${this.table} where full_story_id = ${id} and deleted_at is null limit 1`).then((results) => results[0]);
    }
}
