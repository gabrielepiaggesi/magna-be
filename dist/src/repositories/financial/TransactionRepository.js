"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../Repository");
class TransactionRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "transactions";
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=TransactionRepository.js.map