import { Logger } from '../../framework/services/Logger';
import { StorageService } from './StorageService';
import { auth } from '../../framework/integrations/middleware';

const LOG = new Logger("MediaService.class");
const uploadService = new StorageService();

export class MediaService {

    public async uploadProfileMedia(req: any, conn) {
        if (!conn) { throw "Connection error!" }
        LOG.debug("uploadProfileMedia", req.file);
        try {
            const obj = {
                file: req.file,
                user_id: req.user_id,
                type: 'profile'
            };
            const url = await uploadService.uploadMedia(obj, conn);
            return url;
        } catch(e) {
            throw e;
        }
    }

    public async uploadPostMedia(req, conn) {
        if (!conn) { throw "Connection error!" }
        try {
            const obj = {
                file: req.file,
                user_id: req.user_id,
                type: 'post'
            };
            const url = await uploadService.uploadMedia(obj, conn);
            return url;
        } catch(e) {
            throw e;
        }
    }
}
