import { Response } from "express";
import { UserDTO } from "../dtos/UserDTO";
import { auth } from "../integration/middleware/index";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { Logger } from "../utils/Logger";
import { StoryRepository } from "../repositories/StoryRepository";

const LOG = new Logger("InsightService.class");
const userRepository = new UserRepository();
const storyRepository = new StoryRepository();

export class InsightService {

    public async getTodayUsers(res: Response) {
        const num = await userRepository.findTodayUsers();
        return res.status(200).send(num);
    }

    public async getTodayStories(res: Response) {
        const num = await storyRepository.findTodayStories();
        return res.status(200).send(num);
    }

    public async getTotalUsers(res: Response) {
        const num = await userRepository.findTotalUsers();
        return res.status(200).send(num);
    }

    public async getTotalStories(res: Response) {
        const num = await storyRepository.findTotalStories();
        return res.status(200).send(num);
    }
}
