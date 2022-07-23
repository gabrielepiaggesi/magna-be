import { Logger } from '../../framework/services/Logger';
import { StorageService } from './StorageService';
import { auth } from '../..';

const LOG = new Logger("MediaService.class");
const uploadService = new StorageService();

export class MediaService {

    public async uploadFile(dto: { file: any, user_id: number }, conn) {
        if (!conn) { throw "Connection error!" };
        try {
            const obj = {
                file: dto.file,
                user_id: dto.user_id,
                type: (dto.file.mimetype || dto.file.mimeType || dto.file.type) || 'unknown'
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
