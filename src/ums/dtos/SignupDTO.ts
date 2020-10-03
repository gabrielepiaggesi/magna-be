export class SignupDTO {
    public username: string;
    public email: string;
    public password: string;
    public hasAccepted: boolean = false;
    public referrer_id: number = null;

    // tslint:disable-next-line:no-empty
    constructor() {}
}
