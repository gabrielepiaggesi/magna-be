import { Response } from "express";
import { Logger } from "../../framework/services/Logger";
import { auth } from "../../framework/integrations/middleware";
import { Media } from "../../media/models/Media";
import { MediaService } from "../../media/services/MediaService";
import { UserRepository } from "../repository/UserRepository";
import { BlackList } from "../model/BlackList";
import { BlackListRepository } from "../repository/BlackListRepository";
import { UserStatus } from "./classes/UserStatus";
import { BlackListReason } from "./classes/BlackListReason";
import { UserSubStatus } from "./classes/UserSubStatus";

const LOG = new Logger("UserService.class");
const userRepository = new UserRepository();
const blackRepository = new BlackListRepository();
const mediaService = new MediaService();
const db = require("../../connection");

export class UserService {

    public async getUser(res: Response, userId: number) {
        const connection = await db.connection();
        const user = await userRepository.findById(userId, connection);
        delete user.password;
        const userFound = { email: user.email, image_url: user.image_url, user_id: user.id, bio: user.bio };
        LOG.debug("getUser", userFound.user_id);
        await connection.release();
        return res.status(200).send(userFound);
    }

    public async getLoggedUser(res: Response) {
        const connection = await db.connection();
        const loggedId = auth.loggedId;
        const user = await userRepository.findById(loggedId, connection);
        delete user.password;
        LOG.debug("getLoggedUser", user.id);
        await connection.release();
        return res.status(200).send(user);
    }

    public async getTotalUsers(res: Response) {
        const connection = await db.connection();
        const num = await userRepository.findTotalUsers(connection);
        await connection.release();
        return res.status(200).send(num);
    }

    public async updateAccountDetails(res: Response, obj) {
        if (!obj.age || obj.age < 18) return res.status(500).send("Error, age not valid!");
        const connection = await db.connection();
        await connection.newTransaction();
        try {
            let user = await userRepository.findById(obj.id, connection);
            user.age = obj.age;
            user.bio = obj.bio;
            user.whatsapp = obj.whatsapp;
            user.telegram = obj.telegram;
            const id = await userRepository.update(user, connection);
            await connection.commit();
            await connection.release();
            delete user.password;
            LOG.debug("updateNameAndLastName", user.id);
            return res.status(200).send(user);
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("update user error", e);
            return res.status(500).send(e);
        }
    }

    public async updateProfileImage(res: Response, obj) {
        const loggedId = auth.loggedId;
        const file = obj.file;
        if (file && file.size && (file.size/1000000 > 5)) { // > 5MB
            return res.status(500).send("Immagine troppo pesante, cambiala");
        } 

        const connection = await db.connection();
        await connection.newTransaction();
        LOG.debug("file 1", file.name);
        try {
            let user = await userRepository.findById(loggedId, connection);
            let media: Media = await mediaService.uploadProfileMedia({ file, user_id: loggedId }, connection);
            user.image_url = media.url;
            const id = await userRepository.update(user, connection);
            await connection.commit();
            await connection.release();
            delete user.password;
            LOG.debug("updateProfileImage", user.id);
            return res.status(200).send(user);
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("update user image error", e);
            return res.status(500).send(e);
        }
    }

    public async blackListPublisher(res: Response, obj) {
        const loggedId = auth.loggedId;
        console.log("new ad", obj);
        const connection = await db.connection();

        const statusNotIn = [
            BlackListReason.ASK_MONEY,
            BlackListReason.FRAUD,
            BlackListReason.DANGER
        ];

        await connection.newTransaction();
        try {
            const countRep = await blackRepository.countByReporterIdAndUserId(loggedId, obj.user_id, statusNotIn, connection);
            const countUniqRep = await blackRepository.countByReporterId(loggedId, statusNotIn, connection);
            if (countRep > 5 || countUniqRep > 20) {
                let user = await userRepository.findById(loggedId, connection);
                user.bad_report_times = user.bad_report_times + 1;
                user.sub_status = UserSubStatus.BAD_REPORTER;
                await userRepository.update(user, connection);
            } else {
                let report = new BlackList();
                report.user_id = obj.user_id;
                report.reporter_id = loggedId;
                report.reason = BlackListReason[obj.reason] || null;
                report.text = obj.text;
                const postInserted = await blackRepository.save(report, connection);
                report.id = postInserted.insertId;

                const countUs = await blackRepository.countByUserId(obj.user_id, statusNotIn, connection);
                if (countUs > 5) {
                    let user = await userRepository.findById(obj.user_id, connection);
                    if (user.banned_times > 5) {
                        user.status = UserStatus.ENDED;
                    } else if (user.suspended_times > 10) {
                        user.banned_times = user.banned_times + 1;
                        user.status = UserStatus.BANNED;
                    } else {
                        user.suspended_times = user.suspended_times + 1;
                        user.status = UserStatus.SUSPENDED;
                    }
                    user.sub_status = UserSubStatus.BAD_PUBLISHER;
                    await userRepository.update(user, connection);
                }
            }

            await connection.commit();
            await connection.release();
            return res.status(200).send({ message: "done" });
        } catch (e) {
            await connection.rollback();
            await connection.release();
            LOG.error("blacklist error", e);
            return res.status(500).send({ message: e });
        }
    }
}
