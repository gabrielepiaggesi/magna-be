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

    public async getFeed(res: Response, page: number = 0) {
        const connection = await db.connection();
        const ads = await adRepository.findAdsForFeed(page, connection);
        await connection.release();
        return res.status(200).send(ads);
    }

    public async getLimitedFeed(res: Response, page: number = 0) {
        if (page > 0) return res.status(500).send("Registrati per vedere altri annunci!");
        const connection = await db.connection();
        const ads = await adRepository.findAdsForFeed(auth.loggedId, page, connection);
        await connection.release();
        return res.status(200).send(ads);
    }

    public async getAd(res: Response, adId: number) {
        const connection = await db.connection();
        let post = await adRepository.findById(adId, connection);
        post['report_reasons'] = [
            BlackListReason.FAKE_USER,
            BlackListReason.FAKE_PHOTO,
            BlackListReason.FAKE_CONTACT,
            BlackListReason.ASK_MONEY,
            BlackListReason.FRAUD,
            BlackListReason.DANGER
        ];
        await connection.release();
        return res.status(200).send(post);
    }

    public async getMyAds(res: Response, page: number = 0) {
        const connection = await db.connection();
        const posts = await adRepository.findAdsByUserId(auth.loggedId, page, connection);
        await connection.release();
        LOG.debug("getMyPosts", posts.length);
        return res.status(200).send(posts);
    }

    public async publishAd(res: Response, obj) {
        const loggedId = auth.loggedId;
        console.log("new ad", obj);
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let ad = new Ad();
            ad.user_id = loggedId;
            ad.location = AdLocation[obj.location] || null;
            ad.purpose = AdPurpose[obj.purpose] || null;
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

    public async deleteAd(res: Response, adId: number) {
        const loggedId = auth.loggedId;
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
}
