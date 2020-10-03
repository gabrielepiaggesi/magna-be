"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../../framework/repositories/Repository");
const db = require("../../connection");
class SubScriptionRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "subscriptions";
    }
    findCurrentSubForUser(userId, planId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from subscriptions sub 
        inner join plans plan on plan.id = sub.plan_id 
        where sub.user_id = ${userId} and sub.plan_id = ${planId} and sub.subscription_status not in ("canceled", "unpaid") and sub.deleted_at is null`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
    findByUserIdAndPlanId(userId, planId, conn = null, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = conn || (yield db.connection());
            const q = `select * from subscriptions where user_id = ${userId} and plan_id = ${planId} and subscription_status not in ("canceled", "unpaid") and deleted_at is null`;
            return yield c.query(query || q).then((results) => results[0]);
        });
    }
}
exports.SubScriptionRepository = SubScriptionRepository;
//# sourceMappingURL=SubScriptionRepository.js.map