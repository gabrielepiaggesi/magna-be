"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    // tslint:disable-next-line:no-shadowed-variable
    save(model, table) {
        let columns = "";
        let values = "";
        let i = 0;
        Object.keys(model).forEach((key) => {
            const value = (typeof model[key] !== "number") ? `"${model[key]}"` : model[key];
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
            const value = (typeof model[key] !== "number") ? `"${model[key]}"` : model[key];
            columns += (i === 0) ? key + " = " + value : ", " + key + " = " + value;
            i++;
        });
        return `update ${table} set ${columns} where id = ${id}`;
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=QueryBuilder.js.map