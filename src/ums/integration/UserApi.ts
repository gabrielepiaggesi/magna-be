import express from "express";
import { auth } from "../../framework/integrations/middleware";
import multer, { memoryStorage } from 'multer';
import { UserService } from "../service/UserService";
const userRoutes = express.Router();

const multerConfig = {
    storage: memoryStorage(),
    limits: {
      fileSize: 3 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
};

// services
const userService = new UserService();

// routes
userRoutes.get("/me", auth.isUser, async (req, res) => await userService.getLoggedUser(res, req));
userRoutes.get("/:userId", async (req, res) => await userService.getUser(res, parseInt(req.params.userId, 10)));
userRoutes.get("/total/users", async (req, res) => await userService.getTotalUsers(res));

userRoutes.post("/me", auth.isUser, async (req, res) => await userService.updateAccountDetails(res, req.body));
userRoutes.post("/profileImage", auth.isUser, multer(multerConfig).single('file'), async (req, res) => await userService.updateProfileImage(res, req));

export default userRoutes;
