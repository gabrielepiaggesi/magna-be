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
const Logger_1 = require("../../framework/services/Logger");
const middleware_1 = require("../../framework/integrations/middleware");
const AdRepository_1 = require("../repository/AdRepository");
const Ad_1 = require("../model/Ad");
const BlackListReason_1 = require("../../ums/service/classes/BlackListReason");
const AdLocation_1 = require("./classes/AdLocation");
const AdPurpose_1 = require("./classes/AdPurpose");
const LOG = new Logger_1.Logger("PostService.class");
const adRepository = new AdRepository_1.AdRepository();
const db = require("../../connection");
class AdService {
    getFeed(res, page = 0, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('queryParams', queryParams);
            const connection = yield db.connection();
            const ads = yield adRepository.findAdsForFeed(page, parseInt(queryParams.from, 10) || 18, parseInt(queryParams.to, 10) || 65, parseInt(queryParams.cat, 10) || 1, connection);
            yield connection.release();
            for (let i = 0; i < ads.length; i++) {
                const ad = ads[i];
                ad.user_telegram = (ad.user_telegram) ? true : false;
                ad.user_whatsapp = (ad.user_whatsapp) ? true : false;
                ad.user_email = (ad.user_email) ? true : false;
                ad.ad_feed_date = new Date(ad.ad_feed_date).toISOString().substring(0, 19);
                ad.ad_created_at = new Date(ad.ad_created_at).toISOString().substring(0, 19);
                ads[i] = ad;
            }
            return res.status(200).send(ads);
        });
    }
    getLimitedFeed(res, req, page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page > 0)
                return res.status(500).send("Registrati per vedere altri annunci!");
            const connection = yield db.connection();
            const ads = yield adRepository.findAdsForFeed(middleware_1.auth.getLoggedUserId(req), page, connection);
            yield connection.release();
            return res.status(200).send(ads);
        });
    }
    getAd(res, adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            let post = yield adRepository.findAd(adId, connection);
            post['report_reasons'] = [
                BlackListReason_1.BlackListReason.FAKE_USER,
                BlackListReason_1.BlackListReason.FAKE_PHOTO,
                BlackListReason_1.BlackListReason.FAKE_CONTACT,
                BlackListReason_1.BlackListReason.ASK_MONEY,
                BlackListReason_1.BlackListReason.FRAUD,
                BlackListReason_1.BlackListReason.DANGER
            ];
            post.ad_feed_date = new Date(post.ad_feed_date).toISOString().substring(0, 19);
            post.ad_created_at = new Date(post.ad_created_at).toISOString().substring(0, 19);
            yield connection.release();
            return res.status(200).send(post);
        });
    }
    getMyAds(res, req, page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const posts = yield adRepository.findAdsByUserId(middleware_1.auth.getLoggedUserId(req), page || 0, connection);
            yield connection.release();
            LOG.debug("getMyPosts", posts.length);
            return res.status(200).send(posts);
        });
    }
    publishAd(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.getLoggedUserId(req);
            const obj = req.body;
            if (obj.bio && obj.bio.length > 255) {
                return res.status(500).send({ message: "Descrizione troppo lunga" });
            }
            console.log("new ad", obj);
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let ad = new Ad_1.Ad();
                ad.user_id = loggedId;
                if (obj.bio)
                    ad.bio = obj.bio;
                ad.category_id = obj.category_id || 1;
                ad.location = AdLocation_1.AdLocation[obj.location] || null;
                ad.purpose = AdPurpose_1.AdPurpose[obj.purpose] || null;
                ad.feed_date = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
                const postInserted = yield adRepository.save(ad, connection);
                ad.id = postInserted.insertId;
                yield connection.commit();
                yield connection.release();
                return res.status(200).send(ad);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator msg error", e);
                return res.status(500).send({ message: e });
            }
        });
    }
    deleteAd(res, req, adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let post = yield adRepository.findById(adId, connection);
                if (post.user_id != loggedId) {
                    return res.status(500).send({ message: 'You are not the owner' });
                }
                yield adRepository.delete(post, connection);
                yield connection.commit();
                yield connection.release();
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator msg error", e);
                return res.status(500).send({ message: e });
            }
        });
    }
    pushAd(res, req, adId) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.getLoggedUserId(req);
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let post = yield adRepository.findById(adId, connection);
                if (post.user_id != loggedId) {
                    return res.status(500).send({ message: 'You are not the owner' });
                }
                post.feed_date = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
                yield adRepository.update(post, connection);
                yield connection.commit();
                yield connection.release();
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("new creator msg error", e);
                return res.status(500).send({ message: e });
            }
        });
    }
}
exports.AdService = AdService;
//# sourceMappingURL=AdService.js.map