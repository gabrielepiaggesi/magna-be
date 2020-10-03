import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../environment/dev/jwt";
import { LoginDTO } from "../dtos/LoginDTO";
import { SignupDTO } from "../dtos/SignupDTO";
import { Logger } from "../../framework/services/Logger";
import { auth } from "../../framework/integrations/middleware";
import { UserRepository } from "../repository/UserRepository";
import { User } from "../model/User";
import { UserStatus } from "./classes/UserStatus";

const LOG = new Logger("AuthService.class");
const userRepository = new UserRepository();
const db = require("../../connection");

export class AuthService {

    public async login(res: Response, user: LoginDTO) {
        LOG.debug("login...");

        const { email, password } = user;
        if (email && password) {
            // tslint:disable-next-line:no-shadowed-variable
            const connection = await db.connection();
            const user = await userRepository.findByEmail(email, connection);
            if (!user) {
                return res.status(401).json({ message: "Error" });
            } else {
                await bcrypt.compare(password, user.password, async (err, right) => {
                    if (right) {
                        LOG.debug("right password");
                        // from now on we'll identify the user by the id and the id is the
                        // only personalized value that goes into our token
                        const payload = { id: user.id, type: 'PridePartyUser42' };
                        const token = jwt.sign(payload, jwtConfig.secretOrKey);
                        auth.setLoggedId(user.id);
                        await connection.release();
                        return res.status(200).json({ msg: "ok", token });
                    } else {
                        await connection.release();
                        return res.status(401).json({ msg: "Email or Password incorrect" });
                    }
                });
            }
        } else {
            return res.status(401).json({ message: "Error" });
        }
    }

    public async signup(res: Response, user: SignupDTO) {
        LOG.debug("signup...", user);

        const connection = await db.connection();
        const userWithThisUserName = await userRepository.findByEmail(user.email, connection);

        if (userWithThisUserName || !user.email || !user.hasAccepted) {
            return res.status(500).json({ msg: "General Error", code: 'Auth.Error' });
        }

        if (!user.age || user.age < 18 || user.age > 100) {
            return res.status(500).json({ msg: "Età Invalida! Sei troppo giovane, non puoi iscriverti", code: 'Auth.Age' });
        }

        await bcrypt.hash(user.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Cannot Create Password", code: 'Auth.Password' });
            } else if (hash) {
                await connection.newTransaction();
                try {
                    const tinyint = (user.hasAccepted) ? 1 : 0;
                    const newUser = new User();
                    newUser.email = user.email;
                    newUser.status = UserStatus.ACTIVE;
                    newUser.password = hash;
                    newUser.age = user.age;
                    newUser.accept_terms_and_conditions = tinyint;
                    newUser.accept_privacy_policy = tinyint;
                    newUser.accept_DCMA_policy = tinyint;
                    newUser.accept_acceptable_use_policy = tinyint;
                    newUser.accept_refund_policy = tinyint;
                    newUser.equal_or_older_than_18yo = tinyint;

                    const userInserted = await userRepository.save(newUser, connection);
                    LOG.debug("newUserId ", userInserted.insertId);
                    const userId = userInserted.insertId;

                    auth.setLoggedId(userId);

                    await connection.commit();
                    await connection.release();
                    const payload = { id: userId, type: 'PridePartyUser42' };
                    const token = jwt.sign(payload, jwtConfig.secretOrKey);
                    return res.status(200).json({ msg: "ok", token });
                } catch (e) {
                    await connection.rollback();
                    await connection.release();
                    return res.status(500).json({ msg: "Cannot Create User", code: 'Auth.User' });
                }
            } else {
                return res.status(500).json({ msg: "Cannot Create Password", code: 'Auth.Password' });
            }
        });
    }
}
