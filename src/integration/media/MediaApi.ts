import express from "express";
import { MediaService } from "../../services/media/MediaService";
import { auth } from "../middleware/index";
import multer, { memoryStorage } from 'multer'
const mediaRoutes = express.Router();

const multerConfig = {
    storage: memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
};

// services
const insightService = new MediaService();

// routes
mediaRoutes.post("/upload", 
    auth.isUser, 
    multer(multerConfig).single('file'), 
    async (req, res) => await insightService.uploadMedia(res, req)
);


export default mediaRoutes;
