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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../../environment/dev/jwt");
const Logger_1 = require("../../framework/services/Logger");
const middleware_1 = require("../../framework/integrations/middleware");
const UserRepository_1 = require("../repository/UserRepository");
const User_1 = require("../model/User");
const UserStatus_1 = require("./classes/UserStatus");
const LOG = new Logger_1.Logger("AuthService.class");
const userRepository = new UserRepository_1.UserRepository();
const db = require("../../connection");
class AuthService {
    login(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("login...");
            const { email, password } = user;
            if (email && password) {
                // tslint:disable-next-line:no-shadowed-variable
                const connection = yield db.connection();
                const user = yield userRepository.findByEmail(email, connection);
                if (!user) {
                    return res.status(401).json({ message: "No such user found" });
                }
                else {
                    yield bcrypt_1.default.compare(password, user.password, (err, right) => __awaiter(this, void 0, void 0, function* () {
                        if (right) {
                            LOG.debug("right password");
                            // from now on we'll identify the user by the id and the id is the
                            // only personalized value that goes into our token
                            const payload = { id: user.id };
                            const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                            middleware_1.auth.setLoggedId(user.id);
                            yield connection.release();
                            return res.status(200).json({ msg: "ok", token });
                        }
                        else {
                            yield connection.release();
                            return res.status(401).json({ msg: "Password is incorrect" });
                        }
                    }));
                }
            }
            else {
                return res.status(401).json({ message: "No such user found" });
            }
        });
    }
    signup(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("signup...", user);
            const connection = yield db.connection();
            const userWithThisUserName = yield userRepository.findByEmail(user.email, connection);
            if (userWithThisUserName || !user.email || !user.hasAccepted) {
                return res.status(500).json({ msg: "General Error", code: 'Auth.Error' });
            }
            if (!user.age || user.age < 18 || user.age > 100) {
                return res.status(500).json({ msg: "Età Invalida! Sei troppo giovane, non puoi iscriverti", code: 'Auth.Age' });
            }
            yield bcrypt_1.default.hash(user.password, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ msg: "Cannot Create Password", code: 'Auth.Password' });
                }
                else if (hash) {
                    yield connection.newTransaction();
                    try {
                        const tinyint = (user.hasAccepted) ? 1 : 0;
                        const newUser = new User_1.User();
                        newUser.email = user.email;
                        newUser.status = UserStatus_1.UserStatus.ACTIVE;
                        newUser.password = hash;
                        newUser.age = user.age;
                        newUser.accept_terms_and_conditions = tinyint;
                        newUser.accept_privacy_policy = tinyint;
                        newUser.accept_DCMA_policy = tinyint;
                        newUser.accept_acceptable_use_policy = tinyint;
                        newUser.accept_refund_policy = tinyint;
                        newUser.equal_or_older_than_18yo = tinyint;
                        const userInserted = yield userRepository.save(newUser, connection);
                        LOG.debug("newUserId ", userInserted.insertId);
                        const userId = userInserted.insertId;
                        middleware_1.auth.setLoggedId(userId);
                        yield connection.commit();
                        yield connection.release();
                        const payload = { id: userId };
                        const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                        return res.status(200).json({ msg: "ok", token });
                    }
                    catch (e) {
                        yield connection.rollback();
                        yield connection.release();
                        return res.status(500).json({ msg: "Cannot Create User", code: 'Auth.User' });
                    }
                }
                else {
                    return res.status(500).json({ msg: "Cannot Create Password", code: 'Auth.Password' });
                }
            }));
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map