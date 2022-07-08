import { AuthMiddleWare } from "./framework/middleware/AuthMiddleWare";

export const auth: AuthMiddleWare = new AuthMiddleWare();

export const initMiddlewares = (app) => {
    this.auth = new AuthMiddleWare();
    app.use(this.auth.init());
};
