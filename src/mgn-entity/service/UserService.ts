import { Logger } from "../../mgn-framework/services/Logger";
import { UserFidelityCardRepository } from "../../mgn-reward/repository/UserFidelityCardRepository";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { UserApi } from "../integration/UserApi";
import { User } from "../model/User";
import { NotificationRepository } from "../repository/NotificationRepository";
import { UserRepository } from "../repository/UserRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository();
const userFidelityCardRepository = new UserFidelityCardRepository();

export class UserService implements UserApi {
    
    public async getLoggedUser(userId: number) {
        const connection = await db.connection();
        const user = await userRepository.findById(userId, connection);
        delete user.password;
        await connection.release();
        return user;
    }
    
    public async addUser(dto: any, loggedUserId: number) {
        await Precondition.checkIfFalse((!dto.name), "Incomplete Data");
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newUser = await this.updateOrCreateUser(dto, loggedUserId, connection);
        await connection.commit();
        await connection.release();
        
        return newUser;
    }

    public async getUserNotifications(userId: number) {
        const connection = await db.connection();
        
        const userFidelityCards = await userFidelityCardRepository.findActiveByUserIdJoinBusiness(userId, connection);
        const businessIds = userFidelityCards.map(c => c.business_id);
        const nots = await notificationRepository.whereBusinessesIdsIn(businessIds, connection);
        await connection.release();
        
        return nots;
    }

    public async deleteUser(loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeUser(loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async updateUser(dto: any, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const newUser = await this.updateOrCreateUser(dto, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return newUser;
    }

    public async getUser(businessId: number) {
        const connection = await db.connection();

        const business = await userRepository.findById(businessId, connection);
        await Precondition.checkIfTrue((!!business), "Company does not exist", connection);
        await connection.release();

        return business;
    }

    private async updateOrCreateUser(newUserDTO: any, loggedUserId: number, connection) {
        let newUser = new User();
        if (loggedUserId) {
            newUser = await userRepository.findById(loggedUserId, connection);
            if (newUser && newUser.id != loggedUserId) return null;
        }

        try {
            newUser.name = newUserDTO.name || newUser.name;
            newUser.status = loggedUserId ? newUser.status : 'ACTIVE';
            newUser.id = loggedUserId ? newUser.id : loggedUserId;

            const coInserted = loggedUserId ? await userRepository.update(newUser, connection) : await userRepository.save(newUser, connection);
            newUser.id = loggedUserId ? newUser.id : coInserted.insertId;
            !loggedUserId && LOG.info("NEW BUSINESS", newUser.id);
            return newUser;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS", 500, null, e);
        }
    }

    private async removeUser(loggedUserId: number, connection) {
        const user = await userRepository.findById(loggedUserId, connection);
        if (!user || user.id != loggedUserId) return user;
        try {
            await userRepository.delete(user, connection);
            return user;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete User", 500, null, e);
        }
    }

}
