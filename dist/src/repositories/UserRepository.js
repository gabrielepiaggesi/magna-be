"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../utils/Logger");
const Repository_1 = require("./Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
class UserRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users";
    }
    findByName(name, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
    findByEmailAndPassword(email, password, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where email = "${email}" and password = "${password}" limit 1`).then((results) => results[0]);
    }
    findByEmail(email, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where email = "${email}" limit 1`).then((results) => results[0]);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map