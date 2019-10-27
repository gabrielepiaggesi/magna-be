"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jwt_1 = require("../../../environment/jwt");
const AuthService_1 = require("../../services/AuthService");
const authRoutes = express_1.default.Router();
const authService = new AuthService_1.AuthService();
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const JwtStrategy = passport_jwt_1.default.Strategy;
class AuthMiddleWare {
    constructor() {
        this.jwtOptions = { jwtFromRequest: null, secretOrKey: null };
        this.isUser = passport_1.default.authenticate("jwt", { session: false });
        this.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        this.jwtOptions.secretOrKey = jwt_1.jwtConfig.secretOrKey;
        // tslint:disable-next-line:variable-name
        this.strategy = new JwtStrategy(this.jwtOptions, (jwt_payload, next) => {
            console.log("payload received", jwt_payload);
            const user = authService.checkUser(jwt_payload.id);
            if (user) {
                next(null, user);
            }
            else {
                next(null, false);
            }
        });
        passport_1.default.use(this.strategy);
    }
    init() {
        return passport_1.default.initialize();
    }
}
exports.AuthMiddleWare = AuthMiddleWare;
//# sourceMappingURL=AuthMiddleWare.js.map