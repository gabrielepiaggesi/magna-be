import { Response } from "express";
import { Logger } from "../../framework/services/Logger";
import { auth } from "../..";
import { Media } from "../../media/models/Media";
import jwt from "jsonwebtoken";
import { MediaService } from "../../media/services/MediaService";
import { UserRepository } from "../repository/UserRepository";
import { jwtConfig } from "../../../environment/dev/jwt";

const LOG = new Logger("UserService.class");
const userRepository = new UserRepository();
const mediaService = new MediaService();
const db = require("../../connection");

export class UserService {

    public async getUser(res: Response, userId: number) {
        const connection = await db.connection();
        const user = await userRepository.findById(userId, connection);
        delete user.password;
        const userFound = { email: user.email, image_url: user.image_url, user_id: user.id, bio: user.description };
        LOG.debug("getUser", userFound.user_id);
        await connection.release();
        return res.status(200).send(userFound);
    }

    public async getLoggedUser(res: Response, req) {
        const connection = await db.connection();
        const loggedId = auth.getLoggedUserId(req);
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
            user.description = obj.description;
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

    public async updateProfileImage(res: Response, req) {
        const loggedId = auth.getLoggedUserId(req);
        const file = req.file;
        if (file && file.size && (file.size > (3 * 1024 * 1024))) { // > 1MB
            return res.status(500).send("Immagine troppo pesante, cambiala");
        } 

        const connection = await db.connection();
        await connection.newTransaction();
        LOG.debug("file 1", file.name);
        try {
            let user = await userRepository.findById(loggedId, connection);
            let media: Media = await mediaService.uploadFile({ file, user_id: loggedId }, connection);
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
}
