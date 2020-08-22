import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Menu } from "../../models/menu/Menu";
import { Comment } from "../../models/menu/Comment";
const LOG = new Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../database");

export class CommentRepository extends Repository<Comment> {
    public table = "comments";

    public findByBusinessId(businessId: number, query = null): Promise<Comment[]> {
        // tslint:disable-next-line:max-line-length
        return db.query(query || 
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null 
            order by id desc `
            ).then((results) => results);
    }
}
