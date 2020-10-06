"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../../framework/models/Table");
class User extends Table_1.Table {
    // tslint:disable-next-line:no-empty
    constructor() {
        super();
        this.suspended_times = 0;
        this.banned_times = 0;
        this.bad_report_times = 0;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map