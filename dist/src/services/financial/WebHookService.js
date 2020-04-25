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
const database_1 = require("../../database");
const Logger_1 = require("../../utils/Logger");
const WalletService_1 = require("./WalletService");
const LOG = new Logger_1.Logger("WebHookService.class");
const walletService = new WalletService_1.WalletService();
const db = new database_1.Database();
class WebHookService {
    updateSubScriptionWH(res, sub) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("subscription webhook", sub.id);
            yield db.newTransaction();
            try {
                const walletIsUpdated = yield walletService.updateUserWallet(sub);
                yield db.commit();
                if (sub.status == 'past_due' ||
                    sub.status == 'canceled' ||
                    sub.status == 'unpaid') {
                    // notify user
                }
                return res.status(200).send({ status: "success" });
            }
            catch (e) {
                yield db.rollback();
                LOG.error("subscription webhook error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.WebHookService = WebHookService;
//# sourceMappingURL=WebHookService.js.map