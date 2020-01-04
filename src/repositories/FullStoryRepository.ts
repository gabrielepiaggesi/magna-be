import { Database } from "../database";
import { User } from "../models/User";
import { Logger } from "../utils/Logger";
import { Repository } from "./Repository";
import { Story } from "../models/Story";
import { QueryBuilder } from "../utils/QueryBuilder";
import { FullStory } from "../models/FullStory";
const LOG = new Logger("FullStoryRepository.class");
const queryBuilder = new QueryBuilder();

export class FullStoryRepository extends Repository<FullStory> {
    public table = "full_stories";

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
}
