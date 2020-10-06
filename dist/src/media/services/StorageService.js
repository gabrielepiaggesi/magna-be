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
const storage_1 = require("@google-cloud/storage");
const Logger_1 = require("../../framework/services/Logger");
const MediaRepository_1 = require("../repositories/MediaRepository");
const Media_1 = require("../models/Media");
const middleware_1 = require("../../framework/integrations/middleware");
const LOG = new Logger_1.Logger("UploadService.class");
const mediaRepository = new MediaRepository_1.MediaRepository();
const db = require("../../database");
const storage = new storage_1.Storage({ projectId: "thismybio", keyFilename: "./src/media/services/firebaseKey.json" });
let bucket = storage.bucket("thismybio.appspot.com");
class StorageService {
    // https://console.firebase.google.com/u/0/project/thismybio/storage/thismybio.appspot.com/files?hl=it
    // https://github.com/expressjs/multer
    // https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
    // https://gist.github.com/stardustxx/58748550699228174b805aaadfc98a35#file-app-js
    // https://cloud.google.com/storage/docs/access-control/signed-urls
    // https://cloud.google.com/storage/docs/access-control/signing-urls-with-helpers#storage-signed-url-object-nodejs
    getMediaSignedUrl(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000,
            };
            const [url] = yield bucket.file(fileName).getSignedUrl(options);
            return url;
        });
    }
    uploadMedia(obj, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("uploadMedia", obj);
            const userId = obj.user_id;
            let file = obj.file; //.file because on fe the input name is file
            if (file) {
                try {
                    const fileUploaded = yield this.uploadImageToStorage(file);
                    const url = fileUploaded.url;
                    const fileName = fileUploaded.name;
                    console.log(url);
                    let media = new Media_1.Media();
                    media.user_id = obj.user_id;
                    media.size = file.fileSize || file.size;
                    media.provider_path = bucket.name;
                    media.type = obj.type;
                    media.url = `https://storage.googleapis.com/` + url;
                    media.private_url = `https://storage.cloud.google.com/` + url;
                    media.name = fileName;
                    const mediaInserted = yield mediaRepository.save(media, connection);
                    media.id = mediaInserted.insertId;
                    // not commit because you are in the original transaction still
                    return media;
                }
                catch (e) {
                    LOG.error("uploadMedia error", e);
                    let msg = (e.message) ? e.message : null;
                    let error_code = (e.code) ? e.code : e;
                    let decline_code = (e.decline_code) ? e.decline_code : null;
                    throw { msg, error_code, decline_code };
                }
            }
            else {
                LOG.error("file empty");
                throw "file empty";
            }
        });
    }
    uploadImageToStorage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw { message: 'No image file', code: 'no_image' };
            }
            let namee = (file.name || file.originalname);
            namee = namee.replace(" ", "_");
            const newFileName = `${middleware_1.auth.loggedId}_${Date.now()}_${namee}`;
            const fileUpload = yield bucket.file(newFileName);
            const blobStream = yield fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });
            yield blobStream.on('error', (error) => {
                console.log(error);
                throw { message: 'Something is wrong! Unable to upload at the moment.', code: 'unable_upload' };
            });
            yield blobStream.on('complete', () => {
                // The public URL can be used to directly access the file via HTTP.
                // https://firebasestorage.googleapis.com/v0/b/thismybio.appspot.com/o/gp.jpeg?alt=media
                // https://storage.cloud.google.com/thismybio.appspot.com/gp.jpeg
                // https://storage.googleapis.com/thismybio.appspot.com/gp.jpeg_1587912784594
                // format(`https://storage.cloud.google.com/${bucket.name}/${fileUpload.name}`).toString();
                return `${bucket.name}/${fileUpload.name}`;
            });
            yield blobStream.end(file.buffer);
            return { url: `${bucket.name}/${fileUpload.name}`, name: newFileName };
        });
    }
}
exports.StorageService = StorageService;
//# sourceMappingURL=StorageService.js.map