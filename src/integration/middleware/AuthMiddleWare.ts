import passport from "passport";
import passportJWT from "passport-jwt";
import { jwtConfig } from "../../../environment/dev/jwt";
import { UserRepository } from "../../repositories/UserRepository";
const ExtractJwt = passportJWT.ExtractJwt;
// tslint:disable-next-line:variable-name
const JwtStrategy = passportJWT.Strategy;
const userRepository = new UserRepository();

export class AuthMiddleWare {
  public jwtOptions = { jwtFromRequest: null, secretOrKey: null };
  public strategy;
  public isUser = passport.authenticate("jwt", { session: false });
  public loggedId;

  constructor() {
    this.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    this.jwtOptions.secretOrKey = jwtConfig.secretOrKey;
    // tslint:disable-next-line:variable-name
    this.strategy = new JwtStrategy(this.jwtOptions, async (jwt_payload, next) => {
      console.log("payload received", jwt_payload);
      const user = await userRepository.findById(jwt_payload.id);
      if (Boolean(user)) {
        this.loggedId = jwt_payload.id;
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

  public setLoggedId(id) {
    this.loggedId = id;
  }
}
