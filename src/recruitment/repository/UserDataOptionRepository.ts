import { Repository } from "../../framework/repositories/Repository";
const db = require("../../connection");
import mysql2 from "mysql2";
import { UserDataOption } from "../model/UserDataOption";

export class UserDataOptionRepository extends Repository<UserDataOption> {
    public table = "users_data_options";
    // ${mysql2.escape(stripeId)}
}
