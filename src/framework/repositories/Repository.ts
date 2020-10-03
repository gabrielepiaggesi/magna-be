import { QueryBuilder } from "../../utils/QueryBuilder";
const db = require("../connection");

export class Repository<T> {
    public queryBuilder: QueryBuilder<T> = new QueryBuilder<T>();
    public table = "";

    public async save(model: T, conn = null) {
        const c = conn || await db.connection();
        const insert = this.queryBuilder.save(model, this.table);
        return await c.query(insert);
    }

    public async update(model: T, conn = null) {
        const c = conn || await db.connection();
        // tslint:disable-next-line:no-string-literal
        const id = model["id"];
        const update = this.queryBuilder.update(model, id, this.table);
        return await c.query(update);
    }

    public async delete(model: T, conn = null) {
        const c = conn || await db.connection();
        // tslint:disable-next-line:no-string-literal
        const id = model["id"];
        model['deleted_at'] = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
        const d = this.queryBuilder.update(model, id, this.table);
        return await c.query(d);
    }

    public async findAll(query = null, conn = null) {
        const c = conn || await db.connection();
        return await c.query(query || `select * from ${this.table} limit 1000`);
    }

    public async findById(id: number, conn = null, query = null): Promise<T> {
        const c = conn || await db.connection();
        // tslint:disable-next-line:max-line-length
        return await c.query(query || `select * from ${this.table} where id = ${id} limit 1`).then((results) => results[0]);
    }
}
