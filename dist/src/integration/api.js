"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthApi_1 = __importDefault(require("./AuthApi"));
const BusinessApi_1 = __importDefault(require("./business/BusinessApi"));
const FinancialApi_1 = __importDefault(require("./financial/FinancialApi"));
const MenuApi_1 = __importDefault(require("./menu/MenuApi"));
const routes = express_1.default.Router();
routes.use("/auth", AuthApi_1.default);
routes.use("/menu", MenuApi_1.default);
routes.use("/business", BusinessApi_1.default);
routes.use("/financial", FinancialApi_1.default);
exports.default = routes;
//# sourceMappingURL=api.js.map