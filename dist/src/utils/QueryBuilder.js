"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
class QueryBuilder {
    // tslint:disable-next-line:no-shadowed-variable
    save(model, table) {
        let columns = "";
        let values = "";
        let i = 0;
        Object.keys(model).forEach((key) => {
            const value = (typeof model[key] !== "number") ? ((model[key] && model[key] != '' && model[key] != ' ') ? `${mysql_1.default.escape(model[key])}` : `NULL`) : model[key];
            columns += (i === 0) ? key : ", " + key;
            values += (i === 0) ? value : ", " + value;
            i++;
        });
        return `insert into ${table} (${columns}) values (${values})`;
    }
    // tslint:disable-next-line:no-shadowed-variable
    update(model, id, table) {
        let columns = "";
        let i = 0;
        Object.keys(model).forEach((key) => {
            const value = (typeof model[key] !== "number") ? ((model[key] && model[key] != '' && model[key] != ' ') ? `${mysql_1.default.escape(model[key])}` : `NULL`) : model[key];
            columns += (i === 0) ? key + " = " + value : ", " + key + " = " + value;
            i++;
        });
        return `update ${table} set ${columns} where id = ${id}`;
    }
    getWhereIn(arra) {
        let whereIn = "";
        let i = 0;
        arra.forEach((elem) => {
            const value = (typeof elem !== "number") ? `"${elem}"` : elem;
            whereIn += (i === 0) ? value : ", " + value;
            i++;
        });
        console.log('WHERE IN', whereIn);
        return whereIn;
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map