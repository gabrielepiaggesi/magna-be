import { Response } from "express";
import { UserDTO } from "../../dtos/UserDTO";
import { auth } from "../../integration/middleware/index";
import { User } from "../../models/user/User";
import { UserRepository } from "../../repositories/user/UserRepository";
import { Logger } from "../../utils/Logger";
import { DetailRepository } from "../../repositories/user/DetailRepository";
import { DetailType } from "../../enums/user/DetailType";
import { Detail } from "../../models/user/Detail";
import { Database } from "../../database";

const LOG = new Logger("DetailService.class");
const userRepository = new UserRepository();
const detailRepository = new DetailRepository();
const db = new Database();

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

    public async updateBio(res: Response, obj) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;
            let detail;
            let detailInserted;

            if (obj.id) {
                detail = await detailRepository.findById(obj.id);
                detail.user_id = loggedId;
                detail.type = DetailType.BIO;
                detail.text1 = obj.text1;
                detailInserted = await detailRepository.update(detail);
            } else {
                detail = new Detail();
                detail.user_id = loggedId;
                detail.type = DetailType.BIO;
                detail.text1 = obj.text1;
                detailInserted = await detailRepository.save(detail);
            }
        
            LOG.debug("updateBio success", detailInserted);
            return res.status(200).send(detailInserted);
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

    public async updateNow(res: Response, obj) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;
            let detail;
            let detailInserted;

            if (obj.id) {
                detail = await detailRepository.findById(obj.id);
                detail.user_id = loggedId;
                detail.type = DetailType.NOW;
                detail.text1 = obj.text1;
                detail.text2 = obj.text2;
                detailInserted = await detailRepository.update(detail);
            } else {
                detail = new Detail();
                detail.user_id = loggedId;
                detail.type = DetailType.BIO;
                detail.text1 = obj.text1;
                detail.text2 = obj.text2;
                detailInserted = await detailRepository.save(detail);
            }
        
            LOG.debug("updateBio success", detailInserted);
            return res.status(200).send(detailInserted);
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

    public async updateNameLastName(res: Response, obj) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;
            let detail;
            let detailInserted;

            if (obj.id) {
                detail = await detailRepository.findById(obj.id);
                detail.user_id = loggedId;
                detail.type = DetailType.NAME_LASTNAME;
                detail.text1 = obj.text1;
                detailInserted = await detailRepository.update(detail);
            } else {
                detail = new Detail();
                detail.user_id = loggedId;
                detail.type = DetailType.NAME_LASTNAME;
                detail.text1 = obj.text1;
                detailInserted = await detailRepository.save(detail);
            }
        
            LOG.debug("updateBio success", detailInserted);
            return res.status(200).send(detailInserted);
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

    public async updateLinks(res: Response, items = []) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;

            for (let i = 0; i<=items.length; i++) {
                let item = items[i];
                let detail: Detail;

                if (item.id) {
                    detail = await detailRepository.findById(item.id);
                    detail.user_id = loggedId;
                    detail.type = DetailType.LINK;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.text3 = item.text3;
                    if (item.toDelete) {
                        await detailRepository.delete(detail);
                    } else {
                        await detailRepository.update(detail);
                    }
                } else {
                    detail = new Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType.LINK;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.text3 = item.text3;
                    await detailRepository.save(detail);
                }

            }

            return res.status(200).send("success");
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

    public async updateJobs(res: Response, items = []) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;

            for (let i = 0; i<=items.length; i++) {
                let item = items[i];
                let detail: Detail;

                if (item.id) {
                    detail = await detailRepository.findById(item.id);
                    detail.user_id = loggedId;
                    detail.type = DetailType.JOB;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.start_date = item.start_date;
                    detail.end_date = item.end_date;
                    if (item.toDelete) {
                        await detailRepository.delete(detail);
                    } else {
                        await detailRepository.update(detail);
                    }
                } else {
                    detail = new Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType.LINK;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.start_date = item.start_date;
                    detail.end_date = item.end_date;
                    await detailRepository.save(detail);
                }

            }

            return res.status(200).send("success");
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

    public async updateEducations(res: Response, items = []) {

        await db.newTransaction();
        try {
            const loggedId = auth.loggedId;

            for (let i = 0; i<=items.length; i++) {
                let item = items[i];
                let detail: Detail;

                if (item.id) {
                    detail = await detailRepository.findById(item.id);
                    detail.user_id = loggedId;
                    detail.type = DetailType.EDUCATION;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.start_date = item.start_date;
                    detail.end_date = item.end_date;
                    if (item.toDelete) {
                        await detailRepository.delete(detail);
                    } else {
                        await detailRepository.update(detail);
                    }
                } else {
                    detail = new Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType.LINK;
                    detail.text1 = item.text1;
                    detail.text2 = item.text2;
                    detail.start_date = item.start_date;
                    detail.end_date = item.end_date;
                    await detailRepository.save(detail);
                }

            }

            return res.status(200).send("success");
        } catch (e) {
            await db.rollback();
            LOG.error("updateBio error", e);
            return res.status(500).send(e);
        }
    }

}
