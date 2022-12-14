"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _1 = require(".");
const AuthController_1 = require("./mgn-entity/controller/AuthController");
const BusinessController_1 = require("./mgn-entity/controller/BusinessController");
const UserController_1 = require("./mgn-entity/controller/UserController");
const UserReviewController_1 = require("./mgn-network/controller/UserReviewController");
const UserSocialPostController_1 = require("./mgn-network/controller/UserSocialPostController");
const BusinessDiscountController_1 = require("./mgn-reward/controller/BusinessDiscountController");
const BusinessFidelityCardController_1 = require("./mgn-reward/controller/BusinessFidelityCardController");
const UserDiscountController_1 = require("./mgn-reward/controller/UserDiscountController");
const UserFidelityCardController_1 = require("./mgn-reward/controller/UserFidelityCardController");
const Helpers_1 = require("./utils/Helpers");
const ReservationController_1 = require("./mgn-network/controller/ReservationController");
const UserReferralController_1 = require("./mgn-reward/controller/UserReferralController");
const PublicController_1 = require("./mgn-entity/controller/PublicController");
const MenuController_1 = require("./mgn-network/controller/MenuController");
const routes = express_1.default.Router();
routes.use("/auth", Helpers_1.routeFromController(new AuthController_1.AuthController()));
routes.use("/public", Helpers_1.routeFromController(new PublicController_1.PublicController()));
routes.use("/user", _1.auth.isUser, Helpers_1.routeFromController(new UserController_1.UserController()));
routes.use("/business", _1.auth.isUser, Helpers_1.routeFromController(new BusinessController_1.BusinessController()));
routes.use("/reservation", _1.auth.isUser, Helpers_1.routeFromController(new ReservationController_1.ReservationController()));
routes.use("/menuInfo", Helpers_1.routeFromController(new MenuController_1.MenuController()));
routes.use("/userReview", _1.auth.isUser, Helpers_1.routeFromController(new UserReviewController_1.UserReviewController()));
routes.use("/userSocialPost", _1.auth.isUser, Helpers_1.routeFromController(new UserSocialPostController_1.UserSocialPostController()));
routes.use("/businessDiscount", _1.auth.isUser, Helpers_1.routeFromController(new BusinessDiscountController_1.BusinessDiscountController()));
routes.use("/userDiscount", _1.auth.isUser, Helpers_1.routeFromController(new UserDiscountController_1.UserDiscountController()));
routes.use("/businessFidelityCard", _1.auth.isUser, Helpers_1.routeFromController(new BusinessFidelityCardController_1.BusinessFidelityCardController()));
routes.use("/userFidelityCard", _1.auth.isUser, Helpers_1.routeFromController(new UserFidelityCardController_1.UserFidelityCardController()));
routes.use("/userReferral", _1.auth.isUser, Helpers_1.routeFromController(new UserReferralController_1.UserReferralController()));
exports.default = routes;
//# sourceMappingURL=api.js.map