import { Logger } from "../../mgn-framework/services/Logger";
import { InsightRepository } from "../repository/InsightRepository";

const LOG = new Logger("InsightService.class");
const db = require("../../connection");
const insightRepository = new InsightRepository()

export class InsightService {
    
    public async getTotalUsers() {
        const connection = await db.connection();
        const count = await insightRepository.findTotalUsers(connection);
        LOG.info('getTotalUsers', count);
        await connection.release();
        return count;
    }

    public async getTodayUsers() {
        const connection = await db.connection();
        const today = new Date(Date.now()).toISOString().substring(0, 10);
        const count = await insightRepository.findTodayUsers(today, connection);
        LOG.info('getTodayUsers', count);
        await connection.release();
        return count;
    }

    public async getTotalFidelitiesCards() {
        const connection = await db.connection();
        const count = await insightRepository.findTotalFidelitiesCards(connection);
        LOG.info('getTotalFidelitiesCards', count);
        await connection.release();
        return count;
    }

    public async getTotalBusinesses() {
        const connection = await db.connection();
        const count = await insightRepository.findTotalBusinesses(connection);
        LOG.info('getTotalBusinesses', count);
        await connection.release();
        return count;
    }

    public async getTotalReservations() {
        const connection = await db.connection();
        const count = await insightRepository.findTotalReservations(connection);
        LOG.info('getTotalReservations', count);
        await connection.release();
        return count;
    }

    public async getTotalReservationsToday() {
        const connection = await db.connection();
        const today = new Date(Date.now()).toISOString().substring(0, 10);
        const count = await insightRepository.findTotalReservationsToday(today, connection);
        LOG.info('getTotalReservationsToday', count);
        await connection.release();
        return count;
    }

    public async getTotalReviews() {
        const connection = await db.connection();
        const count = await insightRepository.findTotalReviews(connection);
        LOG.info('getTotalReviews', count);
        await connection.release();
        return count;
    }

    public async getTotalReviewsToday() {
        const connection = await db.connection();
        const today = new Date(Date.now()).toISOString().substring(0, 10);
        const count = await insightRepository.findTotalReviewsToday(today, connection);
        LOG.info('getTotalReviewsToday', count);
        await connection.release();
        return count;
    }

}
