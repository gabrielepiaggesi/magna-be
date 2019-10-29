"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../utils/Logger");
const Repository_1 = require("./Repository");
const LOG = new Logger_1.Logger("UserRepository.class");
class CreatorRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "creators";
    }
    findByName(name, query = null) {
        // tslint:disable-next-line:max-line-length
        return this.db.query(query || `select * from ${this.table} where name = ${name} limit 1`).then((results) => results[0]);
    }
}
exports.CreatorRepository = CreatorRepository;
//# sourceMappingURL=CreatorRepository.js.map