import * as Cron from 'cron';
import { Logger } from '../utils/Logger';
import { EmailSender } from '../framework/services/EmailSender';

const CronJob = Cron.CronJob;
const LOG = new Logger("CRON");

export const initJobs = (app) => {
    var retentionEmailJob = 
    new CronJob('* 17 * * *', async function() {
        LOG.info('retentionEmailJob started');
        await EmailSender.sendRetentionEmail();
        LOG.info('retentionEmailJob completed');
    }, null, true, 'Europe/Rome');
    retentionEmailJob.start();
};
