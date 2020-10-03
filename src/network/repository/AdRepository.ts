import { Repository } from "../../framework/repositories/Repository";
import { Ad } from "../model/Ad";
const db = require("../../connection");

export class AdRepository extends Repository<Ad> {
    public table = "ads";

    public async findAdsForFeed(lastPostId = 0, conn = null, query = null) {
        const c = conn || await db.connection();
        const addPage = (lastPostId != 0) ? ` and post.id < ${lastPostId} ` : ` `;
        return c.query(query || 
            `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.where as ad_where,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram 
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deletedAt is null and user.status = 'ACTIVE' 
            where ad.deleted_at is null ${addPage} 
            order by ad.id desc 
            limit 9`
        ).then((results) => results);
    }

    public async findAdsByUserId(userId, lastPostId = 0, conn = null, query = null) {
        const c = conn || await db.connection();
        const addPage = (lastPostId != 0) ? ` and post.id < ${lastPostId} ` : ` `;
        return c.query(query || 
            `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.where as ad_where,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram 
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deletedAt is null and user.status = 'ACTIVE'  
            where ad.deleted_at is null ${addPage} 
            and ad.user_id = ${userId} 
            order by ad.id desc 
            limit 9`
        ).then((results) => results);
    }
}
