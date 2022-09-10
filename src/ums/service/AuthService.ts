import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../env/dev/jwt";
import { LoginDTO } from "../type/LoginDTO";
import { SignupDTO } from "../type/SignupDTO";
import { Logger } from "../../framework/services/Logger";
import { auth } from "../..";
import { UserRepository } from "../repository/UserRepository";
import { User } from "../model/User";
import { UserStatus } from "../type/UserStatus";
import { Precondition } from "../../utils/Preconditions";
import { IndroError } from "../../utils/IndroError";
import { getDatesDiffIn } from "../../utils/Helpers";
import { EmailSender } from "../../framework/services/EmailSender";
import { JobOfferLinkRepository } from "../../recruitment/repository/JobOfferLinkRepository";
import { CompanyRepository } from "../repository/CompanyRepository";
import { JobOfferRepository } from "../../recruitment/repository/JobOfferRepository";
import { ExamLinkRepository } from "../../recruitment/repository/ExamLinkRepository";
import { ExamRepository } from "../../recruitment/repository/ExamRepository";
import { Exam } from "../../recruitment/model/Exam";
import { JobOffer } from "../../recruitment/model/JobOffer";
import { JobOfferLink } from "../../recruitment/model/JobOfferLink";
import { ExamLink } from "../../recruitment/model/ExamLink";
import { Company } from "../model/Company";

const LOG = new Logger("AuthService.class");
const userRepository = new UserRepository();
const db = require("../../connection");
const shortid = require('shortid');
const jobOfferLinkRepository = new JobOfferLinkRepository();
const companyRepository = new CompanyRepository();
const jobOfferRepository = new JobOfferRepository();
const examLinkRepository = new ExamLinkRepository();
const examRepository = new ExamRepository();

export class AuthService {

    public async getLoggedUser(userId: number) {
        const connection = await db.connection();
        const user = await userRepository.findById(userId, connection);
        delete user.password;
        await connection.release();
        return user;
    }

    public async totalUsers() {
        const connection = await db.connection();
        const users = await userRepository.findTotalUsers(connection);
        await connection.release();
        return { total: users.length };
    }

    public async login(userDTO: LoginDTO) {
        LOG.debug("login...");
        const { email, password } = userDTO;
        await Precondition.checkIfTrue((!!email && !!password), "Email or Password incorrect");
        
        const connection = await db.connection();
        const user = await userRepository.findByEmail(email, connection);
        await Precondition.checkIfTrue(!!user, "Email or Password incorrect", connection);
        await connection.release();

        const passwordIsRight = await bcrypt.compare(password , user.password);
        if (!passwordIsRight) throw new IndroError("Email or Password incorrect", 401);

        const payload = { id: user.id, type: 'IndroUser122828?' };
        const token = jwt.sign(payload, jwtConfig.secretOrKey);
        // EmailSender.sendSpecificEmail({ templateId: 1, email, params: { email, pwd: password } });
        auth.setLoggedId(user.id);
        return { msg: "ok", token, user };
    }

    public async signup(userDTO: SignupDTO) {
        LOG.debug("signup...", userDTO);
        const userAge = getDatesDiffIn(userDTO.birthdate, Date.now(), 'years');
        await Precondition.checkIfFalse((!userAge || userAge < 18 || userAge > 100), "Età Invalida! Sei troppo giovane, non puoi iscriverti");

        const connection = await db.connection();
        const userWithThisEmail = await userRepository.findByEmail(userDTO.email, connection);

        const password = shortid.generate();
        const passwordHashed = await bcrypt.hash(password, 10);

        const uuid = userDTO.jobOfferUUID || userDTO.examUUID;
        const entityLink: JobOfferLink|ExamLink = userDTO.jobOfferUUID ? await jobOfferLinkRepository.findByUUID(uuid, connection) : await examLinkRepository.findByUUID(uuid, connection);
        const entity: JobOffer|Exam = userDTO.jobOfferUUID ?  await jobOfferRepository.findById(entityLink['job_offer_id'], connection) : await examRepository.findById(entityLink['exam_id'], connection);
        const company: Company = await companyRepository.findById(entity.company_id, connection);

        const emailTemplateId = userDTO.jobOfferUUID ? 1 : 2;

        if (userWithThisEmail) {
            await this.updateUserPassword(userWithThisEmail, passwordHashed, connection);
            const payload = { id: userWithThisEmail.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            EmailSender.sendSpecificEmail({ 
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
        } else {
            await Precondition.checkIfFalse((!!userWithThisEmail || !userDTO.email || !userDTO.hasAccepted), "General Error", connection);
            userDTO.password = passwordHashed;
    
            const newUser = await this.saveNewUser(userDTO, connection);
            const payload = { id: newUser.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            EmailSender.sendSpecificEmail({ templateId: emailTemplateId, email: userDTO.email, params: { token, email: userDTO.email, pwd: password, companyName: company.name, role: entity.role, linkUUID: uuid } });
            return { msg: "ok", token, user: newUser };
        }
    }

    public async signupLanding(userDTO: SignupDTO) {
        LOG.debug("signup LANDING...", userDTO);

        const connection = await db.connection();
        const userWithThisEmail = await userRepository.findByEmail(userDTO.email, connection);

        const password = 'LANDINGindro42?';
        const passwordHashed = await bcrypt.hash(password, 10);

        if (userWithThisEmail) {
            await this.updateUserPassword(userWithThisEmail, passwordHashed, connection);
            const payload = { id: userWithThisEmail.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            return { msg: "ok" };
        } else {
            userDTO.password = passwordHashed;
            const newUser = await this.saveNewUser(userDTO, connection);
            const payload = { id: newUser.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            return { msg: "ok" };
        }
    }

    private async saveNewUser(dto: SignupDTO, connection) {
        await connection.newTransaction();
        try {
            const newUser = new User();
            newUser.email = dto.email;
            newUser.status = UserStatus.NEW;
            newUser.password = dto.password;
            newUser.name = dto.name;
            newUser.lastname = dto.lastname;
            newUser.birthdate = dto.birthdate;
            newUser.age = getDatesDiffIn(dto.birthdate, Date.now(), 'years');
            newUser.accept_terms_and_condition = (dto.hasAccepted) ? 1 : 0;

            const userInserted = await userRepository.save(newUser, connection);
            newUser.id = userInserted.insertId;
            LOG.debug("NEW USER ", newUser.id);
            auth.setLoggedId(newUser.id);

            await connection.commit();
            await connection.release();
            return newUser;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create User", 500, null, e);
        }
    }

    private async updateUserPassword(user: User, pwd: string, connection) {
        await connection.newTransaction();
        try {
            user.password = pwd;
            const userInserted = await userRepository.update(user, connection);
            auth.setLoggedId(user.id);

            await connection.commit();
            await connection.release();
            return user;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Update User PWD", 500, null, e);
        }
    }
}
