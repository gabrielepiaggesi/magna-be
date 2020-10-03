"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../../framework/models/Table");
class Transaction extends Table_1.Table {
    constructor() {
        super();
        this.provider = 'STRIPE';
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map