import passport from "passport";
import passportJWT from "passport-jwt";
import { jwtConfig } from "../../../environment/jwt";
import { AuthService } from "../../services/AuthService";
const authService = new AuthService();
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

export class AuthMiddleWare {
  public jwtOptions = { jwtFromRequest: null, secretOrKey: null };
  public strategy;
  public isUser = passport.authenticate("jwt", { session: false });

  constructor() {
    this.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    this.jwtOptions.secretOrKey = jwtConfig.secretOrKey;
    // tslint:disable-next-line:variable-name
    this.strategy = new JwtStrategy(this.jwtOptions, (jwt_payload, next) => {
      console.log("payload received", jwt_payload);
      const user = authService.checkUser(jwt_payload.id);
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
    passport.use(this.strategy);
  }

  public init() {
    return passport.initialize();
  }
}
