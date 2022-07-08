import { QueryBuilder } from "../../utils/QueryBuilder";
const db = require("../../connection");
import mysql2 from "mysql2";

export class Repository<T> {
    public queryBuilder: QueryBuilder<T> = new QueryBuilder<T>();
    public table = "";

    public async save(model: T, conn) {
        const c = conn;
        const insert = this.queryBuilder.save(model, this.table);
        return await c.query(insert);
    }

    public async saveMultiple(keys: string[], values: any[], conn) {
        const c = conn;
        const insert = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES ?`;
        // var keys = [
        //     ['demian', 'demian@gmail.com', 1],
        //     ['john', 'john@gmail.com', 2],
        //     ['mark', 'mark@gmail.com', 3],
        //     ['pete', 'pete@gmail.com', 4]
        // ];
        // var values = [
        //     ['demian', 'demian@gmail.com', 1],
        //     ['john', 'john@gmail.com', 2],
        //     ['mark', 'mark@gmail.com', 3],
        //     ['pete', 'pete@gmail.com', 4]
        // ];
        // conn.query(sql, [values], function(err) {
        //     if (err) throw err;
        //     conn.end();
        // });

        return await c.query(insert, [values]);
    }

    public async update(model: T, conn) {
        const c = conn;
        // tslint:disable-next-line:no-string-literal
        const id = model["id"];
        const update = this.queryBuilder.update(model, id, this.table);
        return await c.query(update);
    }

    public async delete(model: T, conn) {
        const c = conn;
        // tslint:disable-next-line:no-string-literal
        const id = model["id"];
        model['deleted_at'] = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
        const d = this.queryBuilder.update(model, id, this.table);
        return await c.query(d);
    }

    public async findAll(query = null, conn) {
        const c = conn;
        return await c.query(query || `select * from ${this.table} limit 1000`);
    }

    public async findAllActive(query = null, conn) {
        const c = conn;
        return await c.query(query || `select * from ${this.table} where deleted_at is null limit 1000`);
    }

    public async findById(id: number, conn, query = null): Promise<T> {
        const c = conn;
        // tslint:disable-next-line:max-line-length
        return await c.query(query || `select * from ${this.table} where id = ${id} limit 1`).then((results) => results[0]);
    }
}
