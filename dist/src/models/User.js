"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    // tslint:disable-next-line:no-empty
    constructor() {
        // tslint:disable-next-line:variable-name
        this.created_at = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
        // tslint:disable-next-line:variable-name
        this.updated_at = this.created_at;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map