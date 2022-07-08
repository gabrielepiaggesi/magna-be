import passport from "passport";
import passportJWT from "passport-jwt";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../../environment/dev/jwt";
import { UserRepository } from "../../ums/repository/UserRepository";
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
      // const user = await userRepository.findById(jwt_payload.id);
      if (jwt_payload.id && jwt_payload.type === 'PridePartyUser42') {
        this.loggedId = jwt_payload.id;
        next(null, true);
      } else {
        next(null, false);
      }
    });
    passport.use(this.strategy);
  }

  public init() {
    passport.session();
    return passport.initialize();
  }

  public setLoggedId(id) {
    this.loggedId = id;
  }

  public getLoggedUserId(req) {
    var authorization = req.headers.authorization.split(' ')[1],
        decoded;
        decoded = jwt.verify(authorization, jwtConfig.secretOrKey);
    console.log('user logged', decoded.id);
    return decoded.id;
  }
}
