"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthApi_1 = __importDefault(require("../../ums/integration/AuthApi"));
const UserApi_1 = __importDefault(require("../../ums/integration/UserApi"));
const FinancialApi_1 = __importDefault(require("../../financial/integration/FinancialApi"));
const AdApi_1 = __importDefault(require("../../network/integration/AdApi"));
const routes = express_1.default.Router();
routes.use("/auth", AuthApi_1.default);
routes.use("/user", UserApi_1.default);
routes.use("/financial", FinancialApi_1.default);
routes.use("/network", AdApi_1.default);
exports.default = routes;
//# sourceMappingURL=api.js.map