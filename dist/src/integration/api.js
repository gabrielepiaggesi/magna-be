"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthApi_1 = __importDefault(require("./AuthApi"));
const UserApi_1 = __importDefault(require("./user/UserApi"));
const FinancialApi_1 = __importDefault(require("./financial/FinancialApi"));
const DetailApi_1 = __importDefault(require("./user/DetailApi"));
const MediaApi_1 = __importDefault(require("./media/MediaApi"));
const routes = express_1.default.Router();
routes.use("/auth", AuthApi_1.default);
routes.use("/user", UserApi_1.default);
routes.use("/detail", DetailApi_1.default);
routes.use("/media", MediaApi_1.default);
routes.use("/financial", FinancialApi_1.default);
exports.default = routes;
//# sourceMappingURL=api.js.map