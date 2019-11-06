"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthApi_1 = __importDefault(require("./AuthApi"));
const CreatorApi_1 = __importDefault(require("./CreatorApi"));
const StockApi_1 = __importDefault(require("./StockApi"));
const UserApi_1 = __importDefault(require("./UserApi"));
const routes = express_1.default.Router();
routes.use("/auth", AuthApi_1.default);
routes.use("/users", UserApi_1.default);
routes.use("/stocks", StockApi_1.default);
routes.use("/creators", CreatorApi_1.default);
exports.default = routes;
//# sourceMappingURL=api.js.map