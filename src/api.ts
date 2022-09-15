import express from "express";
import { auth } from ".";
import { AuthController } from "./mgn-entity/controller/AuthController";
import { BusinessController } from "./mgn-entity/controller/BusinessController";
import { UserController } from "./mgn-entity/controller/UserController";
import { UserReviewController } from "./mgn-network/controller/UserReviewController";
import { UserSocialPostController } from "./mgn-network/controller/UserSocialPostController";
import { BusinessDiscountController } from "./mgn-reward/controller/BusinessDiscountController";
import { BusinessFidelityCardController } from "./mgn-reward/controller/BusinessFidelityCardController";
import { UserDiscountController } from "./mgn-reward/controller/UserDiscountController";
import { UserFidelityCardController } from "./mgn-reward/controller/UserFidelityCardController";
import { routeFromController } from "./utils/Helpers";
const routes = express.Router();

routes.use("/auth", routeFromController(new AuthController()));
routes.use("/user", auth.isUser, routeFromController(new UserController()));
routes.use("/business", auth.isUser, routeFromController(new BusinessController()));

routes.use("/userReview", auth.isUser, routeFromController(new UserReviewController()));
routes.use("/userSocialPost", auth.isUser, routeFromController(new UserSocialPostController()));

routes.use("/businessDiscount", auth.isUser, routeFromController(new BusinessDiscountController()));
routes.use("/userDiscount", auth.isUser, routeFromController(new UserDiscountController()));
routes.use("/businessFidelityCard", auth.isUser, routeFromController(new BusinessFidelityCardController()));
routes.use("/userFidelityCard", auth.isUser, routeFromController(new UserFidelityCardController()));

export default routes;
