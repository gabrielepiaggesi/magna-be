import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../environment/dev/jwt";
import { LoginDTO } from "../dtos/LoginDTO";
import { SignupDTO } from "../dtos/SignupDTO";
import { UserDTO } from "../dtos/UserDTO";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { Logger } from "../utils/Logger";

const LOG = new Logger("AuthService.class");
const userRepository = new UserRepository();

export class AuthService {

    public async login(res: Response, user: LoginDTO) {
        LOG.debug("login...");

        const { email, password } = user;
        if (email && password) {
            // tslint:disable-next-line:no-shadowed-variable
            const user = await userRepository.findByEmail(email);
            if (!user) {
                res.status(401).json({ message: "No such user found" });
            }
            await bcrypt.compare(password, user.password, (err, right) => {
                if (right) {
                    // from now on we'll identify the user by the id and the id is the
                    // only personalized value that goes into our token
                    const payload = { id: user.id };
                    const token = jwt.sign(payload, jwtConfig.secretOrKey);
                    res.status(200).json({ msg: "ok", token });
                } else {
                    res.status(401).json({ msg: "Password is incorrect" });
                }
            });
        }
    }

    public async signup(res: Response, user: SignupDTO) {
        LOG.debug("signup...", user);

        await bcrypt.hash(user.password, 10, async (err, hash) => {
            if (err) {
                res.status(500).json({ msg: "Cannot create Hash" });
            } else if (hash) {
                const newUser = new User();
                newUser.name = user.name;
                newUser.lastname = user.lastname;
                newUser.email = user.email;
                newUser.password = hash;

                const userInserted = await userRepository.save(newUser);
                LOG.debug("newUserId ", userInserted.insertId);
                return res.status(200).send(userInserted);
            }
            res.status(500).json({ msg: "Cannot create Hash" });
        });
    }

    public async checkUser(userId: number) {
        const user = await userRepository.findById(userId);
        LOG.debug("user", user);
        return Boolean(user);
    }
}
