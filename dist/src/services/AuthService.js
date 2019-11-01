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
const jwt_1 = require("../../environment/dev/jwt");
const database_1 = require("../database");
const middleware_1 = require("../integration/middleware");
const User_1 = require("../models/User");
const UserRepository_1 = require("../repositories/UserRepository");
const Logger_1 = require("../utils/Logger");
const LOG = new Logger_1.Logger("AuthService.class");
const userRepository = new UserRepository_1.UserRepository();
const db = new database_1.Database();
class AuthService {
    login(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("login...");
            const { email, password } = user;
            if (email && password) {
                // tslint:disable-next-line:no-shadowed-variable
                const user = yield userRepository.findByEmail(email);
                if (!user) {
                    return res.status(401).json({ message: "No such user found" });
                }
                else {
                    yield bcrypt_1.default.compare(password, user.password, (err, right) => {
                        if (right) {
                            LOG.debug("right password");
                            // from now on we'll identify the user by the id and the id is the
                            // only personalized value that goes into our token
                            const payload = { id: user.id };
                            const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                            middleware_1.auth.setLoggedId(user.id);
                            return res.status(200).json({ msg: "ok", token });
                        }
                        else {
                            return res.status(401).json({ msg: "Password is incorrect" });
                        }
                    });
                }
            }
        });
    }
    signup(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("signup...", user);
            yield bcrypt_1.default.hash(user.password, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ msg: "Cannot create Hash" });
                }
                else if (hash) {
                    yield db.newTransaction();
                    try {
                        const newUser = new User_1.User();
                        newUser.name = user.name;
                        newUser.lastname = user.lastname;
                        newUser.email = user.email;
                        newUser.password = hash;
                        const userInserted = yield userRepository.save(newUser);
                        LOG.debug("newUserId ", userInserted.insertId);
                        middleware_1.auth.setLoggedId(userInserted.insertId);
                        yield db.commit();
                        return res.status(200).send(userInserted);
                    }
                    catch (e) {
                        yield db.rollback();
                        return res.status(500).send("Cannot Create User");
                    }
                }
                else {
                    return res.status(500).json({ msg: "Cannot create Hash" });
                }
            }));
        });
    }
    checkUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(userId);
            LOG.debug("user", user);
            return Boolean(user);
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map