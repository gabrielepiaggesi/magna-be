import mysql from "mysql";
export class QueryBuilder<T> {

    // tslint:disable-next-line:no-shadowed-variable
    public save<T>(model: T, table) {
        let columns = "";
        let values = "";
        let i = 0;
        Object.keys(model).forEach((key) => {
            const value = (typeof model[key] !== "number") ? ((model[key] && model[key] != '' && model[key] != ' ') ? `${mysql.escape(model[key])}` : `NULL`) : model[key];

            columns += (i === 0) ? key : ", " + key;
            values += (i === 0) ? value : ", " + value;
            i++;
        });
        return `insert into ${table} (${columns}) values (${values})`;
    }

    // tslint:disable-next-line:no-shadowed-variable
    public update<T>(model: T, id: number, table) {
        let columns = "";
        let i = 0;
        Object.keys(model).forEach((key) => {
            const value = (typeof model[key] !== "number") ? ((model[key] && model[key] != '' && model[key] != ' ') ? `${mysql.escape(model[key])}` : `NULL`) : model[key];
            columns += (i === 0) ? key + " = " + value : ", " + key + " = " + value;
            i++;
        });
        return `update ${table} set ${columns} where id = ${id}`;
    }

    public getWhereIn(arra: any[]) {
        let whereIn = "";
        let i = 0;
        arra.forEach((elem) => {
            const value = (typeof elem !== "number") ? `"${elem}"` : elem;
            whereIn += (i === 0) ? value : ", " + value;
            i++;
        });
        return whereIn;
    }
}
