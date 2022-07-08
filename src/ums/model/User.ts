import { Table } from "../../framework/models/Table";
import { getDatesDiffIn } from "../../utils/Helpers";
import { SignupDTO } from "../type/SignupDTO";
import { UserStatus } from "../type/UserStatus";
var moment = require('moment');

export class User extends Table {
    public email: string;
    public description: string;
    public name: string;
    public lastname: string;
    public age: number;
    public image_url: string;
    public media_id: number;
    public status: UserStatus;
    public password: string;
    public phone_number: string;
    public last_ip: string;
    public birthdate: string;
    public cv_url: string;
    public accept_terms_and_condition: number;
    public last_session: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }

    public fromSignup(dto: SignupDTO) {
        this.email = dto.email;
        this.status = UserStatus.NEW;
        this.password = dto.password;
        this.name = dto.name;
        this.lastname = dto.lastname;
        this.birthdate = dto.birthdate;
        this.age = getDatesDiffIn(dto.birthdate, Date.now(), 'years');
        this.accept_terms_and_condition = (dto.hasAccepted) ? 1 : 0;
        return this;
    }
}
