import { Response } from "express";
import { UserDTO } from "../../dtos/UserDTO";
import { auth } from "../../integration/middleware/index";
import { User } from "../../models/user/User";
import { UserRepository } from "../../repositories/user/UserRepository";
import { Logger } from "../../utils/Logger";

const LOG = new Logger("MediaService.class");
const userRepository = new UserRepository();

export class MediaService {

}
