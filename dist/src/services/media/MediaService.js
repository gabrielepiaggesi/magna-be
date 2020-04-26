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
const index_1 = require("../../integration/middleware/index");
const Logger_1 = require("../../utils/Logger");
const storage_1 = require("@google-cloud/storage");
const database_1 = require("../../database");
const Media_1 = require("../../models/media/Media");
const MediaRepository_1 = require("../../repositories/media/MediaRepository");
const DetailType_1 = require("../../enums/user/DetailType");
const DetailRepository_1 = require("../../repositories/user/DetailRepository");
const Detail_1 = require("../../models/user/Detail");
const LOG = new Logger_1.Logger("MediaService.class");
const mediaRepository = new MediaRepository_1.MediaRepository();
const detailRepository = new DetailRepository_1.DetailRepository();
const db = new database_1.Database();
const storage = new storage_1.Storage({
    projectId: "thismybio",
    keyFilename: "./src/services/media/firebaseKey.json"
});
let bucket = storage.bucket("thismybio.appspot.com");
class MediaService {
    // https://console.firebase.google.com/u/0/project/thismybio/storage/thismybio.appspot.com/files?hl=it
    // https://github.com/expressjs/multer
    // https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
    // https://gist.github.com/stardustxx/58748550699228174b805aaadfc98a35#file-app-js
    uploadMedia(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = index_1.auth.loggedId;
            let file = req.file; //.file because on fe the input name is file
            if (file) {
                yield db.newTransaction();
                try {
                    const url = yield this.uploadImageToStorage(file);
                    console.log(url);
                    let media = new Media_1.Media();
                    media.user_id = userId;
                    media.detail = file.fileSize;
                    media.provider_path = bucket.name;
                    media.type = "IMAGE";
                    media.url = `https://storage.googleapis.com/` + url;
                    media.private_url = `https://storage.cloud.google.com/` + url;
                    const mediaInserted = yield mediaRepository.save(media);
                    let details = yield detailRepository.findByType(DetailType_1.DetailType.IMAGE, userId);
                    let detail = details[0] || new Detail_1.Detail();
                    detail.type = DetailType_1.DetailType.IMAGE;
                    detail.text1 = media.url;
                    detail.user_id = userId;
                    if (detail.id) {
                        yield detailRepository.update(detail);
                    }
                    else {
                        yield detailRepository.save(detail);
                    }
                    yield db.commit();
                    return res.status(200).send({ url });
                }
                catch (e) {
                    yield db.rollback();
                    LOG.error("uploadMedia error", e);
                    let msg = (e.message) ? e.message : null;
                    let error_code = (e.code) ? e.code : e;
                    let decline_code = (e.decline_code) ? e.decline_code : null;
                    return res.status(500).send({ msg, error_code, decline_code });
                }
            }
        });
    }
    uploadImageToStorage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw { message: 'No image file', code: 'no_image' };
            }
            const newFileName = `${file.originalname}_${Date.now()}`;
            const fileUpload = bucket.file(newFileName);
            const blobStream = yield fileUpload.createWriteStream({ metadata: { contentType: file.mimetype }, predefinedAcl: "publicRead" });
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
            return `${bucket.name}/${fileUpload.name}`;
        });
    }
}
exports.MediaService = MediaService;
//# sourceMappingURL=MediaService.js.map