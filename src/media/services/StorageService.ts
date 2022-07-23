import { Storage, GetSignedUrlConfig } from '@google-cloud/storage';
import { Logger } from '../../framework/services/Logger';
import { MediaRepository } from '../repositories/MediaRepository';
import { Media } from '../models/Media';
import { auth } from '../..';

const LOG = new Logger("StorageService.class");
const mediaRepository = new MediaRepository();
const db = require("../../database");
const storage = new Storage({ projectId: "thismybio", keyFilename: "./src/media/services/firebaseKey.json"});
let bucket = storage.bucket("thismybio.appspot.com");

export class StorageService {
    // https://console.firebase.google.com/u/0/project/thismybio/storage/thismybio.appspot.com/files?hl=it
    // https://github.com/expressjs/multer
    // https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
    // https://gist.github.com/stardustxx/58748550699228174b805aaadfc98a35#file-app-js

    // https://cloud.google.com/storage/docs/access-control/signed-urls
    // https://cloud.google.com/storage/docs/access-control/signing-urls-with-helpers#storage-signed-url-object-nodejs
    // https://console.cloud.google.com/storage/browser/thismybio.appspot.com;tab=objects?forceOnBucketsSortingFiltering=false&project=thismybio&prefix=&forceOnObjectsSortingFiltering=false
    public async getMediaSignedUrl(fileName): Promise<string> {
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };        
        const [url] = await bucket.file(fileName).getSignedUrl(options);
        return url;
    }

    public async uploadMedia(obj, connection) {
        LOG.debug("uploadMedia", obj); 
        const userId = obj.user_id;
        let file = obj.file;  //.file because on fe the input name is file
        if (file) {
            try {
                const fileUploaded = await this.uploadImageToStorage(file, userId);
                const url = fileUploaded.url;
                const fileName = fileUploaded.name;
                console.log(url);

                let media = new Media();
                media.user_id = obj.user_id;
                media.size = file.fileSize || file.size;
                media.provider_path = bucket.name;
                media.type = obj.type;
                media.url = `https://storage.googleapis.com/` + url;
                media.private_url = `https://storage.cloud.google.com/` + url;
                media.name = fileName;
                const mediaInserted = await mediaRepository.save(media, connection);
                media.id = mediaInserted.insertId;

                // not commit because you are in the original transaction still
                return media;
            } catch (e) {
                LOG.error("uploadMedia error", e);
                let msg = (e.message) ? e.message : null;
                let error_code = (e.code) ? e.code : e;
                let decline_code = (e.decline_code) ? e.decline_code : null;
                throw {msg, error_code, decline_code};
            }
        } else {
            LOG.error("file empty");
            throw "file empty";
        }
    }

    private async uploadImageToStorage(file, userId): Promise<any> {
        if (!file) { throw { message: 'No image file', code: 'no_image' }; }
        console.log((file.name || file.originalname));
        let namee = (file.name || file.originalname);
        namee = namee.replace(" ", "_");
        const newFileName = `${userId}_${Date.now()}_${namee}`;
        const fileUpload = await bucket.file(newFileName);
        const blobStream = await fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });

        await blobStream.on('error', (error) => {
            console.log(error);
            throw { message: 'Something is wrong! Unable to upload at the moment.', code: 'unable_upload' }; 
        });

        await blobStream.on('complete', () => {
            // The public URL can be used to directly access the file via HTTP.
            // https://firebasestorage.googleapis.com/v0/b/thismybio.appspot.com/o/gp.jpeg?alt=media
            // https://storage.cloud.google.com/thismybio.appspot.com/gp.jpeg
            // https://storage.googleapis.com/thismybio.appspot.com/gp.jpeg_1587912784594
            // format(`https://storage.cloud.google.com/${bucket.name}/${fileUpload.name}`).toString();
            return `${bucket.name}/${fileUpload.name}`;
        });
    
        await blobStream.end(file.buffer);
        return { url: `${bucket.name}/${fileUpload.name}`, name: newFileName };
    }
}
