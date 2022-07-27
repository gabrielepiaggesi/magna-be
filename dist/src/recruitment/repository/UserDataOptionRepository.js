"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class UserDataOptionRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "users_data_options";
        // ${mysql2.escape(stripeId)}
    }
}
exports.UserDataOptionRepository = UserDataOptionRepository;
//# sourceMappingURL=UserDataOptionRepository.js.map