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

export class StoryLikeRepository extends Repository<StoryLike> {
    public table = "stories_liked";
}
