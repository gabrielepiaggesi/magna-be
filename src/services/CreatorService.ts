import { Response } from "express";
import { CreatorRepository } from "../repositories/CreatorRepository";
import { Logger } from "../utils/Logger";

const LOG = new Logger("CreatorService.class");
const creatorRepository = new CreatorRepository();

export class CreatorService {

    public async getCreator(res: Response, creatorId: number) {
        const creator = await creatorRepository.findById(creatorId);
        LOG.debug("creator", creator);
        return res.status(200).send(creator);
    }
}
