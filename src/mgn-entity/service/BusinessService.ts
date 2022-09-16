import { Logger } from "../../mgn-framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { BusinessApi } from "../integration/BusinessApi";
import { Business } from "../model/Business";
import { BusinessRepository } from "../repository/BusinessRepository";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const businessRepository = new BusinessRepository();

export class BusinessService implements BusinessApi {
    
    public async addBusiness(dto: any, loggedUserId: number) {
        await Precondition.checkIfFalse((!dto.name), "Incomplete Data");
        const connection = await db.connection();
        
        await connection.newTransaction();
        const newBusiness = await this.updateOrCreateBusiness(dto, null, loggedUserId, connection);
        await connection.commit();
        await connection.release();
        
        return newBusiness;
    }

    public async deleteBusiness(businessId: number, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const business = await this.removeBusiness(businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return business;
    }

    public async updateBusiness(businessId: number, dto: any, loggedUserId: number) {
        const connection = await db.connection();

        await connection.newTransaction();
        const newBusiness = await this.updateOrCreateBusiness(dto, businessId, loggedUserId, connection);
        await connection.commit();
        await connection.release();

        return newBusiness;
    }

    public async getBusiness(businessId: number) {
        const connection = await db.connection();

        const business = await businessRepository.findById(businessId, connection);
        await connection.release();

        return business;
    }

    public async getUserBusinessesList(userId: number) {
        const connection = await db.connection();

        const businesses = await businessRepository.findByUserId(userId, connection);
        await connection.release();

        return businesses;
    }

    private async updateOrCreateBusiness(newBusinessDTO: any, businessId: number, loggedUserId: number, connection) {
        let newBusiness = new Business();
        if (businessId) {
            newBusiness = await businessRepository.findById(businessId, connection);
            if (newBusiness && newBusiness.user_id != loggedUserId) return null;
        }

        try {
            newBusiness.name = newBusinessDTO.name || newBusiness.name;
            newBusiness.status = businessId ? newBusiness.status : 'ACTIVE';
            newBusiness.user_id = businessId ? newBusiness.user_id : loggedUserId;

            const coInserted = businessId ? await businessRepository.update(newBusiness, connection) : await businessRepository.save(newBusiness, connection);
            newBusiness.id = businessId ? newBusiness.id : coInserted.insertId;
            !businessId && LOG.info("NEW BUSINESS", newBusiness.id);
            return newBusiness;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create BUSINESS", 500, null, e);
        }
    }

    private async removeBusiness(businessId: number, loggedUserId: number, connection) {
        const business = await businessRepository.findById(businessId, connection);
        if (!business || business.user_id != loggedUserId) return business;
        try {
            await businessRepository.delete(business, connection);
            return business;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Delete Business", 500, null, e);
        }
    }

}
