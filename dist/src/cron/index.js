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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cron = __importStar(require("cron"));
const Logger_1 = require("../utils/Logger");
const CronJob = Cron.CronJob;
const LOG = new Logger_1.Logger("CRON");
exports.initJobs = (app) => {
    var retentionEmailJob = new CronJob('* 5 18 * * *', function () {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.info('retentionEmailJob started');
            // await EmailSender.sendRetentionEmail();
            LOG.info('retentionEmailJob completed');
        });
    }, null, true, 'Europe/Rome');
    retentionEmailJob.start();
};
//# sourceMappingURL=index.js.map