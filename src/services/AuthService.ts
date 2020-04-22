import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../environment/dev/jwt";
import { Database } from "../database";
import { LoginDTO } from "../dtos/LoginDTO";
import { SignupDTO } from "../dtos/SignupDTO";
import { UserDTO } from "../dtos/UserDTO";
import { auth } from "../integration/middleware";
import { User } from "../models/user/User";
import { UserRepository } from "../repositories/user/UserRepository";
import { Logger } from "../utils/Logger";

const LOG = new Logger("AuthService.class");
const userRepository = new UserRepository();
const db = new Database();

export class AuthService {

    public async login(res: Response, user: LoginDTO) {
        LOG.debug("login...");

        const { email, password } = user;
        if (email && password) {
            // tslint:disable-next-line:no-shadowed-variable
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "No such user found" });
            } else {
                await bcrypt.compare(password, user.password, (err, right) => {
                    if (right) {
                        LOG.debug("right password");
                        // from now on we'll identify the user by the id and the id is the
                        // only personalized value that goes into our token
                        const payload = { id: user.id };
                        const token = jwt.sign(payload, jwtConfig.secretOrKey);
                        auth.setLoggedId(user.id);
                        return res.status(200).json({ msg: "ok", token });
                    } else {
                        return res.status(401).json({ msg: "Password is incorrect" });
                    }
                });
            }
        }
    }

    public async signup(res: Response, user: SignupDTO) {
        LOG.debug("signup...", user);

        await bcrypt.hash(user.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Cannot create Hash" });
            } else if (hash) {
                await db.newTransaction();
                try {
                    const newUser = new User();
                    newUser.email = user.email;
                    newUser.status = 'new_user';
                    newUser.password = hash;

                    const userInserted = await userRepository.save(newUser);
                    LOG.debug("newUserId ", userInserted.insertId);
                    const userId = userInserted.insertId;
                    auth.setLoggedId(userId);

                    await db.commit();
                    const payload = { id: userId };
                    const token = jwt.sign(payload, jwtConfig.secretOrKey);
                    return res.status(200).json({ msg: "ok", token });
                } catch (e) {
                    await db.rollback();
                    return res.status(500).send("Cannot Create User");
                }
            } else {
                return res.status(500).json({ msg: "Cannot create Hash" });
            }
        });
    }

    public async checkUser(userId: number) {
        const user = await userRepository.findById(userId);
        LOG.debug("user", user);
        return Boolean(user);
    }
}
