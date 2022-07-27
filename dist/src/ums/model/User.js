"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../../framework/models/Table");
const Helpers_1 = require("../../utils/Helpers");
const UserStatus_1 = require("../type/UserStatus");
var moment = require('moment');
class User extends Table_1.Table {
    // tslint:disable-next-line:no-empty
    constructor() { super(); }
    fromSignup(dto) {
        this.email = dto.email;
        this.status = UserStatus_1.UserStatus.NEW;
        this.password = dto.password;
        this.name = dto.name;
        this.lastname = dto.lastname;
        this.birthdate = dto.birthdate;
        this.age = Helpers_1.getDatesDiffIn(dto.birthdate, Date.now(), 'years');
        this.accept_terms_and_condition = (dto.hasAccepted) ? 1 : 0;
        return this;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map