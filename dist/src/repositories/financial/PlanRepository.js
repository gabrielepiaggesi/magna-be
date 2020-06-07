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
const Repository_1 = require("../Repository");
const db = require("../../database");
class PlanRepository extends Repository_1.Repository {
    constructor() {
        super(...arguments);
        this.table = "plans";
    }
    findByStripePlanId(stripeId, query = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = `select * from plans where stripe_plan_id = "${stripeId}" and deleted_at is null`;
            return yield db.query(query || q).then((results) => results[0]);
        });
    }
}
exports.PlanRepository = PlanRepository;
//# sourceMappingURL=PlanRepository.js.map