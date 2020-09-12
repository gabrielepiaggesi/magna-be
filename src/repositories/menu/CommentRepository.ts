import { Logger } from "../../utils/Logger";
import { Repository } from "../Repository";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Menu } from "../../models/menu/Menu";
import { Comment } from "../../models/menu/Comment";
const LOG = new Logger("MenuRepository.class");
const queryBuilder = new QueryBuilder();
const db = require("../../connection");

export class CommentRepository extends Repository<Comment> {
    public table = "comments";

    public async findByBusinessId(businessId: number, conn = null, query = null): Promise<Comment[]> {
        // tslint:disable-next-line:max-line-length
        const c = conn || await db.connection();
        return c.query(query || 
            `select * 
            from ${this.table} 
            where business_id = ${businessId} 
            and deleted_at is null 
            order by id desc `
            ).then((results) => results);
    }
}
