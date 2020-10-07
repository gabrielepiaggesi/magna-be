import express from "express";
import { auth } from "../../framework/integrations/middleware";
import multer, { memoryStorage } from 'multer';
import { AdService } from "../service/AdService";
import { UserService } from "../../ums/service/UserService";
const networkRoutes = express.Router();

// services
const adsService = new AdService();
const userService = new UserService();

// routes
networkRoutes.get("/feed/:lastPostId", async (req, res) => await adsService.getFeed(res, parseInt(req.params.lastPostId, 10), req.query));
networkRoutes.get("/my/:lastPostId", auth.isUser, async (req, res) => await adsService.getMyAds(res, req, parseInt(req.params.lastPostId, 10)));
networkRoutes.get("/:postId", auth.isUser, async (req, res) => await adsService.getAd(res, parseInt(req.params.postId, 10)));
networkRoutes.post("/delete/:postId", auth.isUser, async (req, res) => await adsService.deleteAd(res, req, parseInt(req.params.postId, 10)));
networkRoutes.post("/push/:postId", auth.isUser, async (req, res) => await adsService.pushAd(res, req, parseInt(req.params.postId, 10)));
networkRoutes.post("/feed", auth.isUser, async (req, res) => await adsService.publishAd(res, req));
networkRoutes.post("/report", auth.isUser, async (req, res) => await userService.blackListPublisher(res, req));

export default networkRoutes;
