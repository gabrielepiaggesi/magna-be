"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const Logger_1 = require("../utlis/Logger");
const Repository_1 = require("./Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
class UserRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.db = new database_1.Database();
        this.table = "users";
    }
    findByName(name, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map