import { Database } from "../../database";
import { User } from "../../models/user/User";
import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Media } from "../../models/media/Media";
const LOG = new Logger("MediaRepository.class");
const queryBuilder = new QueryBuilder();

export class MediaRepository extends Repository<Media> {
    public table = "medias";
}
