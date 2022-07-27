"use strict";
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
    // var retentionEmailJob = 
    // new CronJob('0 30 18 * * *', async function() {
    //     LOG.info('retentionEmailJob started');
    //     // await EmailSender.sendRetentionEmail();
    //     LOG.info('retentionEmailJob completed');
    // }, null, true, 'Europe/Rome');
    // retentionEmailJob.start();
};
//# sourceMappingURL=index.js.map