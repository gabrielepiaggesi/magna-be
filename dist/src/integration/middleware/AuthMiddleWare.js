"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jwt_1 = require("../../../environment/dev/jwt");
const UserRepository_1 = require("../../repositories/user/UserRepository");
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
// tslint:disable-next-line:variable-name
const JwtStrategy = passport_jwt_1.default.Strategy;
const userRepository = new UserRepository_1.UserRepository();
class AuthMiddleWare {
    constructor() {
        this.jwtOptions = { jwtFromRequest: null, secretOrKey: null };
        this.isUser = passport_1.default.authenticate("jwt", { session: false });
        this.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        this.jwtOptions.secretOrKey = jwt_1.jwtConfig.secretOrKey;
        // tslint:disable-next-line:variable-name
        this.strategy = new JwtStrategy(this.jwtOptions, (jwt_payload, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("payload received", jwt_payload);
            const user = yield userRepository.findById(jwt_payload.id);
            if (Boolean(user)) {
                this.loggedId = jwt_payload.id;
                next(null, user);
            }
            else {
                next(null, false);
            }
        }));
        passport_1.default.use(this.strategy);
    }
    init() {
        return passport_1.default.initialize();
    }
    setLoggedId(id) {
        this.loggedId = id;
    }
}
exports.AuthMiddleWare = AuthMiddleWare;
//# sourceMappingURL=AuthMiddleWare.js.map