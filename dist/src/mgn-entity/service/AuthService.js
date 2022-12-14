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
const jwt_1 = require("../../../env/dev/jwt");
const Logger_1 = require("../../mgn-framework/services/Logger");
const __1 = require("../..");
const UserRepository_1 = require("../repository/UserRepository");
const User_1 = require("../model/User");
const Preconditions_1 = require("../../utils/Preconditions");
const IndroError_1 = require("../../utils/IndroError");
const Helpers_1 = require("../../utils/Helpers");
const EmailSender_1 = require("../../mgn-framework/services/EmailSender");
const AppVersionRepository_1 = require("../repository/AppVersionRepository");
const PushNotificationSender_1 = require("../../mgn-framework/services/PushNotificationSender");
const LOG = new Logger_1.Logger("AuthService.class");
const userRepository = new UserRepository_1.UserRepository();
const appVersionRepository = new AppVersionRepository_1.AppVersionRepository();
const db = require("../../connection");
const shortid = require('shortid');
class AuthService {
    appVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const appVersion = yield appVersionRepository.findLastActiveAppVersion(connection);
            yield connection.release();
            return appVersion;
        });
    }
    login(userDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("login...");
            const { email, password } = userDTO;
            yield Preconditions_1.Precondition.checkIfTrue((!!email && !!password), "Email or Password incorrect");
            const connection = yield db.connection();
            const user = yield userRepository.findByEmail(email, connection);
            yield Preconditions_1.Precondition.checkIfTrue(!!user, "Email or Password incorrect", connection);
            yield connection.release();
            const passwordIsRight = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordIsRight)
                throw new IndroError_1.IndroError("Email or Password incorrect", 401);
            const payload = { id: user.id, type: 'IndroUser122828?' };
            const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
            // EmailSender.sendSpecificEmail({ templateId: 1, email, params: { email, pwd: password } });
            __1.auth.setLoggedId(user.id);
            return { msg: "ok", token, user };
        });
    }
    signup(userDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("signup...", userDTO);
            // const userAge = getDatesDiffIn(userDTO.birthdate, Date.now(), 'years');
            // await Precondition.checkIfFalse((!userAge || userAge < 4 || userAge > 100), "Et?? Invalida! Sei troppo giovane, non puoi iscriverti");
            const connection = yield db.connection();
            const userWithThisEmail = yield userRepository.findByEmail(userDTO.email, connection);
            // const password = shortid.generate();
            const password = userDTO.password || shortid.generate();
            const passwordHashed = yield bcrypt_1.default.hash(password, 10);
            const emailTemplateId = 1;
            if (userWithThisEmail) {
                // await this.updateUserPassword(userWithThisEmail, passwordHashed, connection);
                // const payload = { id: userWithThisEmail.id, type: 'IndroUser122828?' };
                // const token = jwt.sign(payload, jwtConfig.secretOrKey);
                // EmailSender.sendSpecificEmail({ 
                //     templateId: emailTemplateId, 
                //     email: userDTO.email, 
                //     params: { 
                //         email: userDTO.email, 
                //         pwd: password,
                //         token
                //     } 
                // });
                yield connection.release();
                return { msg: "user_exists" };
            }
            else {
                yield Preconditions_1.Precondition.checkIfFalse((!!userWithThisEmail || !userDTO.email || !userDTO.hasAccepted), "General Error", connection);
                userDTO.password = passwordHashed;
                const newUser = yield this.saveNewUser(userDTO, connection);
                const payload = { id: newUser.id, type: 'IndroUser122828?' };
                const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                EmailSender_1.EmailSender.sendSpecificEmail({ templateId: emailTemplateId, email: userDTO.email, params: { email: userDTO.email, pwd: password } });
                PushNotificationSender_1.PushNotificationSender.sendToUser(1, 'Nuovo Utente!', userDTO.email, 'general');
                return { msg: "ok", token, user: newUser };
            }
        });
    }
    saveNewUser(dto, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const newUser = new User_1.User();
                newUser.email = dto.email;
                newUser.status = 'ACTIVE';
                newUser.password = dto.password;
                newUser.referral_code = shortid.generate();
                newUser.name = dto.name;
                newUser.lastname = dto.lastname;
                newUser.birthday = dto.birthdate;
                if (dto.lang)
                    newUser.lang = dto.lang;
                newUser.age = dto.birthdate ? Helpers_1.getDatesDiffIn(dto.birthdate, Date.now(), 'years') : 0;
                newUser.accept_terms_and_condition = (dto.hasAccepted) ? 1 : 0;
                const userInserted = yield userRepository.save(newUser, connection);
                newUser.id = userInserted.insertId;
                LOG.debug("NEW USER ", newUser.id);
                __1.auth.setLoggedId(newUser.id);
                yield connection.commit();
                yield connection.release();
                return newUser;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create User", 500, null, e);
            }
        });
    }
    updateUserPassword(user, pwd, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                user.password = pwd;
                const userInserted = yield userRepository.update(user, connection);
                __1.auth.setLoggedId(user.id);
                yield connection.commit();
                yield connection.release();
                return user;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update User PWD", 500, null, e);
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map