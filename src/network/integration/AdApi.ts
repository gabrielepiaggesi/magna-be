import express from "express";
import { auth } from "../../framework/integrations/middleware";
import multer, { memoryStorage } from 'multer';
import { AdService } from "../service/AdService";
const networkRoutes = express.Router();

// services
const adsService = new AdService();

// routes
networkRoutes.get("/feed/:lastPostId", async (req, res) => await adsService.getFeed(res, parseInt(req.params.lastPostId, 10)));
networkRoutes.get("/my/:lastPostId", auth.isUser, async (req, res) => await adsService.getMyAds(res, parseInt(req.params.lastPostId, 10)));
networkRoutes.get("/:postId", auth.isUser, async (req, res) => await adsService.getAd(res, parseInt(req.params.postId, 10)));
networkRoutes.post("/feed", auth.isUser, async (req, res) => await adsService.publishAd(res, req.body));

export default networkRoutes;
