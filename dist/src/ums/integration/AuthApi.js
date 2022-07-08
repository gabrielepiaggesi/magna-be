"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("../../utils/Helpers");
const AuthController_1 = require("../Controllers/AuthController");
// const authRoutes = express.Router();
// // services
// const authService = new AuthService();
// const authComtroller = new AuthController();
// // routes
// authRoutes.post("/login", async (req, res) => await authComtroller.login(res, req));
// authRoutes.post("/signup", async (req, res) => await authComtroller.signup(res, req));
// export default authRoutes;
exports.authRoutes = Helpers_1.routeFromController(new AuthController_1.AuthController());
//# sourceMappingURL=AuthApi.js.map