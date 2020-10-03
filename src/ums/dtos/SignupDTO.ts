export class SignupDTO {
    public username: string;
    public email: string;
    public password: string;
    public hasAccepted: boolean = false;
    public age: number = null;

    // tslint:disable-next-line:no-empty
    constructor() {}
}
