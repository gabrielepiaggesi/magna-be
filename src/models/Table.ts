export class Table {
    // tslint:disable-next-line:variable-name
    public created_at: string = new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ");
    // tslint:disable-next-line:variable-name
    public updated_at: string = this.created_at;
    // tslint:disable-next-line:variable-name
    public deleted_at: string;
    private id;

    // tslint:disable-next-line:no-empty
    constructor() {}

    public getId() {
        return this.id;
    }
}
