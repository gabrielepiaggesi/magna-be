import { Response } from "express";
import { UserDTO } from "../../dtos/UserDTO";
import { auth } from "../../integration/middleware/index";
import { User } from "../../models/user/User";
import { UserRepository } from "../../repositories/user/UserRepository";
import { Logger } from "../../utils/Logger";

const LOG = new Logger("UserService.class");
const userRepository = new UserRepository();

export class UserService {

    public async getUsers(res: Response) {
        const users = await userRepository.findAll();
        LOG.debug("users", users);
        return res.status(200).send(users);
    }

    public async getUser(res: Response, userId: number) {
        const user = await userRepository.findById(userId);
        delete user.password;
        LOG.debug("user", user);
        return res.status(200).send(user);
    }

    public async getLoggedUser(res: Response) {
        const loggedId = auth.loggedId;
        const user = await userRepository.findById(loggedId);
        delete user.password;
        LOG.debug("user", user);
        return res.status(200).send(user);
    }

    public async createUser(res: Response, user: UserDTO) {
        LOG.debug("userDTO", user);

        const newUser = new User();
        newUser.email = user.email;
        newUser.lang = 'it';

        const userInserted = await userRepository.save(newUser);
        LOG.debug("newUserId ", userInserted.insertId);
        return res.status(200).send(userInserted);
    }

    public async updateUser(res: Response, userDto: UserDTO) {
        LOG.debug("userDTO", userDto);

        const user = await userRepository.findById(userDto.id);
        user.email = userDto.email;

        const userUpdated = await userRepository.update(user);
        LOG.debug("userUpdated ", userUpdated);
        return res.status(200).send(userUpdated);
    }
}
