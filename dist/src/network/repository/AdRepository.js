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
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class AdRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "ads";
    }
    findAdsForFeed(lastPostId = 0, fromAge = 18, toAge = 65, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const addPage = (lastPostId != 0) ? ` and ad.id < ${lastPostId} ` : ` `;
            console.log(fromAge, toAge);
            return c.query(query ||
                `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location ,
            ad.feed_date as ad_feed_date,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram,
            user.email as user_email, 
            (case when (user.whatsapp is not null or user.telegram is not null) then 1 else 0 end) as has_contact,
            (case when (user.image_url is not null) then 1 else 0 end) as has_image 
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.image_url is not null and user.deleted_at is null and user.age between ${fromAge} and ${toAge} 
            where ad.deleted_at is null ${addPage} 
            order by ad.feed_date desc  
            limit 9`).then((results) => results);
        });
    }
    findAd(adId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn;
            return c.query(query ||
                `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location,
            ad.feed_date as ad_feed_date,
            ad.bio as ad_bio,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram, 
            user.email as user_email  
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deleted_at is null  
            where ad.deleted_at is null and ad.id = ${adId} 
            limit 1`).then((results) => results[0]);
        });
    }
    findAdsByUserId(userId, lastPostId = 0, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const addPage = (lastPostId != 0) ? ` and ad.id < ${lastPostId} ` : ` `;
            return c.query(query ||
                `select ad.id as ad_id,
            ad.purpose as ad_purpose,
            ad.location as ad_location,
            ad.feed_date as ad_feed_date,
            ad.created_at as ad_created_at,
            user.id as user_id,
            user.image_url as user_image,
            user.age as user_age,
            user.whatsapp as user_whatsapp,
            user.telegram as user_telegram, 
            user.email as user_email  
            from ${this.table} ad  
            inner join users user on user.id = ad.user_id and user.deleted_at is null   
            where ad.deleted_at is null ${addPage} 
            and ad.user_id = ${userId} 
            order by ad.feed_date desc 
            limit 9`).then((results) => results);
        });
    }
}
exports.AdRepository = AdRepository;
//# sourceMappingURL=AdRepository.js.map