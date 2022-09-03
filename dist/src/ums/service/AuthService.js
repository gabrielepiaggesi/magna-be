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
const Logger_1 = require("../../framework/services/Logger");
const __1 = require("../..");
const UserRepository_1 = require("../repository/UserRepository");
const User_1 = require("../model/User");
const UserStatus_1 = require("../type/UserStatus");
const Preconditions_1 = require("../../utils/Preconditions");
const IndroError_1 = require("../../utils/IndroError");
const Helpers_1 = require("../../utils/Helpers");
const EmailSender_1 = require("../../framework/services/EmailSender");
const JobOfferLinkRepository_1 = require("../../recruitment/repository/JobOfferLinkRepository");
const CompanyRepository_1 = require("../repository/CompanyRepository");
const JobOfferRepository_1 = require("../../recruitment/repository/JobOfferRepository");
const ExamLinkRepository_1 = require("../../recruitment/repository/ExamLinkRepository");
const ExamRepository_1 = require("../../recruitment/repository/ExamRepository");
const LOG = new Logger_1.Logger("AuthService.class");
const userRepository = new UserRepository_1.UserRepository();
const db = require("../../connection");
const shortid = require('shortid');
const jobOfferLinkRepository = new JobOfferLinkRepository_1.JobOfferLinkRepository();
const companyRepository = new CompanyRepository_1.CompanyRepository();
const jobOfferRepository = new JobOfferRepository_1.JobOfferRepository();
const examLinkRepository = new ExamLinkRepository_1.ExamLinkRepository();
const examRepository = new ExamRepository_1.ExamRepository();
class AuthService {
    getLoggedUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const user = yield userRepository.findById(userId, connection);
            delete user.password;
            yield connection.release();
            return user;
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
            const userAge = Helpers_1.getDatesDiffIn(userDTO.birthdate, Date.now(), 'years');
            yield Preconditions_1.Precondition.checkIfFalse((!userAge || userAge < 18 || userAge > 100), "Età Invalida! Sei troppo giovane, non puoi iscriverti");
            const connection = yield db.connection();
            const userWithThisEmail = yield userRepository.findByEmail(userDTO.email, connection);
            const password = shortid.generate();
            const passwordHashed = yield bcrypt_1.default.hash(password, 10);
            const uuid = userDTO.jobOfferUUID || userDTO.examUUID;
            const entityLink = userDTO.jobOfferUUID ? yield jobOfferLinkRepository.findByUUID(uuid, connection) : yield examLinkRepository.findByUUID(uuid, connection);
            const entity = userDTO.jobOfferUUID ? yield jobOfferRepository.findById(entityLink['job_offer_id'], connection) : yield examRepository.findById(entityLink['exam_id'], connection);
            const company = yield companyRepository.findById(entity.company_id, connection);
            const emailTemplateId = userDTO.jobOfferUUID ? 1 : 2;
            if (userWithThisEmail) {
                yield this.updateUserPassword(userWithThisEmail, passwordHashed, connection);
                const payload = { id: userWithThisEmail.id, type: 'IndroUser122828?' };
                const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                EmailSender_1.EmailSender.sendSpecificEmail({
                    templateId: emailTemplateId,
                    email: userDTO.email,
                    params: {
                        email: userDTO.email,
                        pwd: password,
                        companyName: company.name,
                        role: entity.role,
                        linkUUID: uuid,
                        token
                    }
                });
                return { msg: "ok" };
            }
            else {
                yield Preconditions_1.Precondition.checkIfFalse((!!userWithThisEmail || !userDTO.email || !userDTO.hasAccepted), "General Error", connection);
                userDTO.password = passwordHashed;
                const newUser = yield this.saveNewUser(userDTO, connection);
                const payload = { id: newUser.id, type: 'IndroUser122828?' };
                const token = jsonwebtoken_1.default.sign(payload, jwt_1.jwtConfig.secretOrKey);
                EmailSender_1.EmailSender.sendSpecificEmail({ templateId: emailTemplateId, email: userDTO.email, params: { token, email: userDTO.email, pwd: password, companyName: company.name, role: entity.role, linkUUID: uuid } });
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
                newUser.status = UserStatus_1.UserStatus.NEW;
                newUser.password = dto.password;
                newUser.name = dto.name;
                newUser.lastname = dto.lastname;
                newUser.birthdate = dto.birthdate;
                newUser.age = Helpers_1.getDatesDiffIn(dto.birthdate, Date.now(), 'years');
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