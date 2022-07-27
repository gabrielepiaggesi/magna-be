"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../framework/services/Logger");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const CompanyStatus_1 = require("../type/CompanyStatus");
const Company_1 = require("../model/Company");
const UserCompany_1 = require("../model/UserCompany");
const CompanyRepository_1 = require("../repository/CompanyRepository");
const UserCompanyRepositor_1 = require("../repository/UserCompanyRepositor");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const companyRepository = new CompanyRepository_1.CompanyRepository();
const userCompanyRepository = new UserCompanyRepositor_1.UserCompanyRepository();
class CompanyService {
    newCompany(newCoDTO, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!newCoDTO.email || !newCoDTO.name), "Incomplete Data");
            const connection = yield db.connection();
            const coWithThisEmail = yield companyRepository.findByEmail(newCoDTO.email, connection);
            yield Preconditions_1.Precondition.checkIfFalse((!!coWithThisEmail), "Company with this Email already exists", connection);
            const newCompany = yield this.updateOrCreateCompany(newCoDTO, null, loggedUserId, connection);
            const newUserCompany = yield this.saveNewUserCompany({ user_id: loggedUserId, company_id: newCompany.id, role: 'CEO' }, connection);
            yield connection.release();
            return { newCompany, newUserCompany };
        });
    }
    inviteUserInCompany(userDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!userDTO.user_id || !userDTO.company_id), "Incomplete Data");
            const connection = yield db.connection();
            const userInThisCompany = yield userCompanyRepository.findByUserIdAndCompanyId(userDTO.user_id, userDTO.company_id, connection);
            yield Preconditions_1.Precondition.checkIfFalse((!!userInThisCompany), "User Already in this Company", connection);
            const newUserCompany = yield this.saveNewUserCompany(userDTO, connection);
            yield connection.release();
            return newUserCompany;
        });
    }
    getCompanyInfo(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const company = yield companyRepository.findById(companyId, connection);
            yield Preconditions_1.Precondition.checkIfTrue((!!company), "Company does not exist", connection);
            yield connection.release();
            return company;
        });
    }
    getUserCompanies(loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const companies = yield userCompanyRepository.findUserCompanies(loggedUserId, connection); // TODO JOIN! with company
            yield connection.release();
            return companies;
        });
    }
    updateCompanyDetails(newCoDTO, companyId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const newCo = yield this.updateOrCreateCompany(newCoDTO, companyId, loggedUserId, connection);
            yield connection.release();
            return newCo;
        });
    }
    updateOrCreateCompany(newCoDTO, companyId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const newCo = companyId ? yield companyRepository.findById(companyId, connection) : new Company_1.Company();
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
                newCo.status = companyId ? newCo.status : CompanyStatus_1.CompanyStatus.NEW;
                newCo.author_user_id = companyId ? newCo.author_user_id : loggedUserId;
                const coInserted = companyId ? yield companyRepository.update(newCo, connection) : yield companyRepository.save(newCo, connection);
                newCo.id = companyId ? newCo.id : coInserted.insertId;
                yield connection.commit();
                !companyId && LOG.info("NEW COMPANY", newCo.id);
                return newCo;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Company", 500, null, e);
            }
        });
    }
    saveNewUserCompany(dto, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.newTransaction();
            try {
                const newUser = new UserCompany_1.UserCompany();
                newUser.company_id = dto.company_id;
                newUser.user_id = dto.user_id;
                newUser.role = dto.role;
                newUser.status = CompanyStatus_1.CompanyStatus.ACTIVE;
                const coInserted = yield userCompanyRepository.save(newUser, connection);
                newUser.id = coInserted.insertId;
                yield connection.commit();
                LOG.info("NEW USER COMPANY", newUser.id);
                return newUser;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create Company", 500, null, e);
            }
        });
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=CompanyService.js.map