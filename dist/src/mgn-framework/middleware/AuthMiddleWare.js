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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../../env/dev/jwt");
const UserRepository_1 = require("../../mgn-entity/repository/UserRepository");
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
// tslint:disable-next-line:variable-name
const JwtStrategy = passport_jwt_1.default.Strategy;
const userRepository = new UserRepository_1.UserRepository();
class AuthMiddleWare {
    constructor() {
        this.jwtOptions = { jwtFromRequest: null, secretOrKey: 'IndroUser122828?' };
        this.isUser = passport_1.default.authenticate("jwt", { session: false });
        this.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        this.jwtOptions.secretOrKey = jwt_1.jwtConfig.secretOrKey;
        // tslint:disable-next-line:variable-name
        this.strategy = new JwtStrategy(this.jwtOptions, (jwt_payload, next) => __awaiter(this, void 0, void 0, function* () {
            console.log("payload received", jwt_payload);
            // const user = await userRepository.findById(jwt_payload.id);
            if (jwt_payload.id && jwt_payload.type === 'IndroUser122828?') {
                this.loggedId = jwt_payload.id;
                next(null, true);
            }
            else {
                next(null, false);
            }
        }));
        passport_1.default.use(this.strategy);
    }
    init() {
        passport_1.default.session();
        return passport_1.default.initialize();
    }
    setLoggedId(id) {
        this.loggedId = id;
    }
    getLoggedUserId(req) {
        var authorization = req.headers.authorization.split(' ')[1], decoded;
        decoded = jsonwebtoken_1.default.verify(authorization, jwt_1.jwtConfig.secretOrKey);
        console.log('user logged', decoded.id);
        return decoded.id;
    }
}
exports.AuthMiddleWare = AuthMiddleWare;
//# sourceMappingURL=AuthMiddleWare.js.map