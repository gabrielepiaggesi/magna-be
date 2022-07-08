import { Logger } from "../../framework/services/Logger";
import { IndroError } from "../../utils/IndroError";
import { Precondition } from "../../utils/Preconditions";
import { CompanyDTO } from "../type/CompanyDTO";
import { CompanyStatus } from "../type/CompanyStatus";
import { UserCompanyDTO } from "../type/UserCompanyDTO";
import { Company } from "../model/Company";
import { UserCompany } from "../model/UserCompany";
import { CompanyRepository } from "../repository/CompanyRepository";
import { UserCompanyRepository } from "../repository/UserCompanyRepositor";

const LOG = new Logger("CompanyService.class");
const db = require("../../connection");
const companyRepository = new CompanyRepository();
const userCompanyRepository = new UserCompanyRepository();

export class CompanyService {

    public async newCompany(newCoDTO: CompanyDTO, loggedUserId: number) {
        await Precondition.checkIfFalse((!newCoDTO.email || !newCoDTO.name), "Incomplete Data");
        
        const connection = await db.connection();
        const coWithThisEmail = await companyRepository.findByEmail(newCoDTO.email, connection);
        await Precondition.checkIfFalse((!!coWithThisEmail), "Company with this Email already exists", connection);
        
        const newCompany = await this.updateOrCreateCompany(newCoDTO, null, loggedUserId, connection);
        const newUserCompany = await this.saveNewUserCompany({ user_id: loggedUserId, company_id: newCompany.id, role: 'CEO' }, connection);
        await connection.release();
        return { newCompany, newUserCompany };
    }

    public async inviteUserInCompany(userDTO: UserCompanyDTO) {
        await Precondition.checkIfFalse((!userDTO.user_id || !userDTO.company_id), "Incomplete Data");
        
        const connection = await db.connection();
        const userInThisCompany = await userCompanyRepository.findByUserIdAndCompanyId(userDTO.user_id, userDTO.company_id, connection);
        await Precondition.checkIfFalse((!!userInThisCompany), "User Already in this Company", connection);
        
        const newUserCompany = await this.saveNewUserCompany(userDTO, connection);
        await connection.release();
        return newUserCompany;
    }

    public async getCompanyInfo(companyId: number) {
        const connection = await db.connection();
        const company = await companyRepository.findById(companyId, connection);
        await Precondition.checkIfTrue((!!company), "Company does not exist", connection);
        await connection.release();
        return company;
    }

    public async getUserCompanies(loggedUserId: number) {
        const connection = await db.connection();
        const companies = await userCompanyRepository.findUserCompanies(loggedUserId, connection); // TODO JOIN! with company
        LOG.debug(companies);
        await connection.release();
        return companies;
    }

    public async updateCompanyDetails(newCoDTO: CompanyDTO, companyId: number, loggedUserId: number) {
        const connection = await db.connection();
        const newCo = await this.updateOrCreateCompany(newCoDTO, companyId, loggedUserId, connection);
        await connection.release();
        return newCo;
    }

    private async updateOrCreateCompany(newCoDTO: CompanyDTO, companyId: number, loggedUserId: number, connection) {
        await connection.newTransaction();
        try {
            const newCo = companyId ? await companyRepository.findById(companyId, connection) : new Company();
            newCo.email = newCoDTO.email || newCo.email;
            newCo.name = newCoDTO.name || newCo.name;
            newCo.description = newCoDTO.description || newCo.description;
            newCo.hq_country = newCoDTO.hq_country || newCo.hq_country;
            newCo.hq_city = newCoDTO.hq_city || newCo.hq_city;
            newCo.hq_address = newCoDTO.hq_address || newCo.hq_address;
            newCo.category = newCoDTO.category || newCo.category;
            newCo.website = newCoDTO.website || newCo.website;
            newCo.employees_amount = newCoDTO.employees_amount || newCo.employees_amount;
            newCo.birthdate = newCoDTO.birthdate || newCo.birthdate;
            newCo.status = companyId ? newCo.status : CompanyStatus.NEW;
            newCo.author_user_id = companyId ? newCo.author_user_id : loggedUserId;

            const coInserted = companyId ? await companyRepository.update(newCo, connection) : await companyRepository.save(newCo, connection);
            newCo.id = companyId ? newCo.id : coInserted.insertId;
            await connection.commit();
            !companyId && LOG.info("NEW COMPANY", newCo.id);
            return newCo;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Company", 500, null, e);
        }
    }

    private async saveNewUserCompany(dto: UserCompanyDTO, connection) {
        await connection.newTransaction();
        try {
            const newUser = new UserCompany();
            newUser.company_id = dto.company_id;
            newUser.user_id = dto.user_id;
            newUser.role = dto.role;
            newUser.status = CompanyStatus.ACTIVE;

            const coInserted = await userCompanyRepository.save(newUser, connection);
            newUser.id = coInserted.insertId;
            await connection.commit();
            LOG.info("NEW USER COMPANY", newUser.id);
            return newUser;
        } catch (e) {
            LOG.error(e);
            await connection.rollback();
            await connection.release();
            throw new IndroError("Cannot Create Company", 500, null, e);
        }
    }
}
