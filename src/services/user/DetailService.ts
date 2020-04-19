import { Response } from "express";
import { UserDTO } from "../../dtos/UserDTO";
import { auth } from "../../integration/middleware/index";
import { User } from "../../models/user/User";
import { UserRepository } from "../../repositories/user/UserRepository";
import { Logger } from "../../utils/Logger";
import { DetailRepository } from "../../repositories/user/DetailRepository";
import { DetailType } from "../../enums/user/DetailType";

const LOG = new Logger("DetailService.class");
const userRepository = new UserRepository();
const detailRepository = new DetailRepository();

export class DetailService {

    public async getBio(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.BIO, loggedId);
        LOG.debug("detail getBio", detail[0] || null);
        return res.status(200).send(detail[0] || null);
    }

    public async getNow(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.NOW, loggedId);
        LOG.debug("detail getNow", detail[0] || null);
        return res.status(200).send(detail[0] || null);
    }

    public async getJobs(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.JOB, loggedId);
        LOG.debug("detail getJobs", detail.length);
        return res.status(200).send(detail);
    }

    public async getEducations(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.EDUCATION, loggedId);
        LOG.debug("detail getEducations", detail.length);
        return res.status(200).send(detail);
    }

    public async getLinks(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.LINK, loggedId);
        LOG.debug("detail getLinks", detail.length);
        return res.status(200).send(detail);
    }

    public async getNameAndLastName(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.NAME_LASTNAME, loggedId);
        LOG.debug("detail getNameAndLastName", detail[0] || null);
        return res.status(200).send(detail[0] || null);
    }

    public async getImage(res: Response) {
        const loggedId = auth.loggedId;
        const detail = await detailRepository.findByType(DetailType.IMAGE, loggedId);
        LOG.debug("detail getImage", detail[0] || null);
        return res.status(200).send(detail[0] || null);
    }

}
