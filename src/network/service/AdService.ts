import { Response } from "express";
import { Logger } from "../../framework/services/Logger";
import { auth } from "../../framework/integrations/middleware";
import { AdRepository } from "../repository/AdRepository";
import { Ad } from "../model/Ad";
import { BlackListReason } from "../../ums/service/classes/BlackListReason";
import { AdLocation } from "./classes/AdLocation";
import { AdPurpose } from "./classes/AdPurpose";
const LOG = new Logger("PostService.class");
const adRepository = new AdRepository();
const db = require("../../connection");

export class AdService {

    public async getFeed(res: Response, page: number = 0, queryParams) {
        console.log('queryParams', queryParams);
        const connection = await db.connection();
        const ads = await adRepository.findAdsForFeed(page, parseInt(queryParams.from, 10) || 18, parseInt(queryParams.to, 10) || 65, parseInt(queryParams.cat, 10) || 1, connection);
        await connection.release();
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
    }

    public async getLimitedFeed(res: Response, req, page: number = 0) {
        if (page > 0) return res.status(500).send("Registrati per vedere altri annunci!");
        const connection = await db.connection();
        const ads = await adRepository.findAdsForFeed(auth.getLoggedUserId(req), page, connection);
        await connection.release();
        return res.status(200).send(ads);
    }

    public async getAd(res: Response, adId: number) {
        const connection = await db.connection();
        let post = await adRepository.findAd(adId, connection);
        post['report_reasons'] = [
            BlackListReason.FAKE_USER,
            BlackListReason.FAKE_PHOTO,
            BlackListReason.FAKE_CONTACT,
            BlackListReason.ASK_MONEY,
            BlackListReason.FRAUD,
            BlackListReason.DANGER
        ];
        post.ad_feed_date = new Date(post.ad_feed_date).toISOString().substring(0, 19);
        post.ad_created_at = new Date(post.ad_created_at).toISOString().substring(0, 19);
        await connection.release();
        return res.status(200).send(post);
    }

    public async getMyAds(res: Response, req, page: number = 0) {
        const connection = await db.connection();
        const posts = await adRepository.findAdsByUserId(auth.getLoggedUserId(req), page || 0, connection);
        await connection.release();
        LOG.debug("getMyPosts", posts.length);
        return res.status(200).send(posts);
    }

    public async publishAd(res: Response, req) {
        const loggedId = auth.getLoggedUserId(req);
        const obj = req.body
        if (obj.bio && obj.bio.length > 255) {
            return res.status(500).send({ message: "Descrizione troppo lunga" });
        }
        console.log("new ad", obj);
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let ad = new Ad();
            ad.user_id = loggedId;
            if (obj.bio) ad.bio = obj.bio;
            ad.category_id = obj.category_id || 1;
            ad.location = AdLocation[obj.location] || null;
            ad.purpose = AdPurpose[obj.purpose] || null;
            ad.feed_date = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            const postInserted = await adRepository.save(ad, connection);
            ad.id = postInserted.insertId;

            await connection.commit();
            await connection.release();
            return res.status(200).send(ad);
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator msg error", e);
            return res.status(500).send({ message: e });
        }
    }

    public async deleteAd(res: Response, req, adId: number) {
        const loggedId = auth.getLoggedUserId(req);
        const connection = await db.connection();
        await connection.newTransaction();

        try {
            let post = await adRepository.findById(adId, connection);
            if (post.user_id != loggedId) { return res.status(500).send({ message: 'You are not the owner' }); }
            await adRepository.delete(post, connection);

            await connection.commit();
            await connection.release();
            return res.status(200).send({status: "success"});
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator msg error", e);
            return res.status(500).send({ message: e });
        }
    }

    public async pushAd(res: Response, req, adId: number) {
        const loggedId = auth.getLoggedUserId(req);
        const connection = await db.connection();
        await connection.newTransaction();

        try {
            let post = await adRepository.findById(adId, connection);
            if (post.user_id != loggedId) { return res.status(500).send({ message: 'You are not the owner' }); }
            post.feed_date = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
            await adRepository.update(post, connection);

            await connection.commit();
            await connection.release();
            return res.status(200).send({status: "success"});
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("new creator msg error", e);
            return res.status(500).send({ message: e });
        }
    }
}
