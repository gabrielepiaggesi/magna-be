export class SignupDTO {
    public name: string;
    public lastname: string;
    public email: string;
    public password: string;
    public birthdate: string;
    public hasAccepted: boolean = false;
    public age: number = null;

    public jobOfferUUID: string;

    // tslint:disable-next-line:no-empty
    constructor() {}
}
