"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    // tslint:disable-next-line:no-empty
    constructor() {
        // tslint:disable-next-line:variable-name
        this.created_at = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
        // tslint:disable-next-line:variable-name
        this.updated_at = this.created_at;
    }
    getId() {
        return this.id;
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map