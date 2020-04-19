import express from "express";
import { auth } from "../middleware/index";
import { DetailService } from "../../services/user/DetailService";
const detailRoutes = express.Router();

// services
const detailService = new DetailService();

// routes
detailRoutes.get("/bio", auth.isUser, async (req, res) => await detailService.getBio(res));
detailRoutes.get("/now", auth.isUser, async (req, res) => await detailService.getNow(res));
detailRoutes.get("/jobs", auth.isUser, async (req, res) => await detailService.getJobs(res));
detailRoutes.get("/educations", auth.isUser, async (req, res) => await detailService.getEducations(res));
detailRoutes.get("/nameLastname", auth.isUser, async (req, res) => await detailService.getNameAndLastName(res));
detailRoutes.get("/links", auth.isUser, async (req, res) => await detailService.getLinks(res));
detailRoutes.get("/image", auth.isUser, async (req, res) => await detailService.getImage(res));

export default detailRoutes;
