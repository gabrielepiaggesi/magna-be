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

const LOG = new Logger("AuthService.class");
const userRepository = new UserRepository();
const db = require("../../connection");
const shortid = require('shortid');
const jobOfferLinkRepository = new JobOfferLinkRepository();
const companyRepository = new CompanyRepository();
const jobOfferRepository = new JobOfferRepository();

export class AuthService {

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

    public async signup(user: SignupDTO) {
        LOG.debug("signup...", user);
        const userAge = getDatesDiffIn(user.birthdate, Date.now(), 'years');
        await Precondition.checkIfFalse((!userAge || userAge < 18 || userAge > 100), "Età Invalida! Sei troppo giovane, non puoi iscriverti");

        const connection = await db.connection();
        const userWithThisEmail = await userRepository.findByEmail(user.email, connection);

        const password = shortid.generate();
        const passwordHashed = await bcrypt.hash(password, 10);
        const link = await jobOfferLinkRepository.findByUUID(user.jobOfferUUID, connection);
        const jOffer = await jobOfferRepository.findById(link.job_offer_id, connection);
        const company = await companyRepository.findById(jOffer.company_id, connection);

        if (userWithThisEmail) {
            await this.updateUserPassword(userWithThisEmail, passwordHashed, connection);
            const payload = { id: userWithThisEmail.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            EmailSender.sendSpecificEmail({ templateId: 1, email: user.email, params: { email: user.email, pwd: password, companyName: company.name, jobOfferName: jOffer.role, linkUUID: user.jobOfferUUID } });
            return { msg: "ok" };
        } else {
            await Precondition.checkIfFalse((!!userWithThisEmail || !user.email || !user.hasAccepted), "General Error", connection);
            user.password = passwordHashed;
    
            const newUser = await this.saveNewUser(user, connection);
            const payload = { id: newUser.id, type: 'IndroUser122828?' };
            const token = jwt.sign(payload, jwtConfig.secretOrKey);
            EmailSender.sendSpecificEmail({ templateId: 1, email: user.email, params: { email: user.email, pwd: password, companyName: company.name, jobOfferName: jOffer.role, linkUUID: user.jobOfferUUID } });
            return { msg: "ok", token, user: newUser };
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
