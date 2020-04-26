import { auth } from "../../integration/middleware/index";
import { Logger } from "../../utils/Logger";
import { Storage } from '@google-cloud/storage';
import { format } from "url";
import { Database } from "../../database";
import { Media } from "../../models/media/Media";
import { MediaRepository } from "../../repositories/media/MediaRepository";
import { DetailType } from "../../enums/user/DetailType";
import { DetailRepository } from "../../repositories/user/DetailRepository";
import { Detail } from "../../models/user/Detail";

const LOG = new Logger("MediaService.class");
const mediaRepository = new MediaRepository();
const detailRepository = new DetailRepository();
const db = new Database();
const storage = new Storage({
    projectId: "thismybio",
    keyFilename: "./firebaseKey.json"
});
const bucket = storage.bucket("gs://thismybio.appspot.com");


export class MediaService {

    public async uploadMedia(res, req) {
        const userId = auth.loggedId;
        let file = req.file;  //.file because on fe the input name is file
        if (file) {

            await db.newTransaction();
            try {
                const url = await this.uploadImageToStorage(file);

                let media = new Media();
                media.user_id = userId;
                media.detail = file.fileSize;
                media.provider_path = bucket.name;
                media.type = "IMAGE";
                media.url = url;
                const mediaInserted = await mediaRepository.save(media);

                let details = await detailRepository.findByType(DetailType.IMAGE, userId);
                let detail = details[0] || new Detail();
                detail.type = DetailType.IMAGE;
                detail.text1 = url;
                detail.user_id = userId;
                if (detail.id) {
                    await detailRepository.update(detail);
                } else {
                    await detailRepository.save(detail);
                }

                await db.commit();
                return res.status(200).send({ url });
            } catch (e) {
                await db.rollback();
                LOG.error("uploadMedia error", e);
                let msg = (e.message) ? e.message : null;
                let error_code = (e.code) ? e.code : e;
                let decline_code = (e.decline_code) ? e.decline_code : null;
                return res.status(500).send({msg, error_code, decline_code});
            }
        }
    }

    private async uploadImageToStorage(file): Promise<string> {
        if (!file) { throw { message: 'No image file', code: 'no_image' }; }
        const newFileName = `${file.originalname}_${Date.now()}`;
        const fileUpload = bucket.file(newFileName);
        const blobStream = await fileUpload.createWriteStream({ metadata: { contentType: file.mimetype } });
        let url = null;

        await blobStream.on('error', (error) => { 
            throw { message: 'Something is wrong! Unable to upload at the moment.', code: 'unable_upload' }; });
    
        await blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        });
    
        await blobStream.end(file.buffer);
        return url;
    }
}


// /**
//  * Adding new file to the storage
//  */
// app.post('/upload', multer.single('file'), (req, res) => {
//   console.log('Upload Image');

//   let file = req.file;
//   if (file) {
//     uploadImageToStorage(file).then((success) => {
//       res.status(200).send({
//         status: 'success'
//       });
//     }).catch((error) => {
//       console.error(error);
//     });
//   }
// });

// /**
//  * Upload the image file to Google Storage
//  * @param {File} file object that will be uploaded to Google Storage
//  */
// const uploadImageToStorage = (file) => {
//   return new Promise((resolve, reject) => {
//     if (!file) {
//       reject('No image file');
//     }
//     let newFileName = `${file.originalname}_${Date.now()}`;

//     let fileUpload = bucket.file(newFileName);

//     const blobStream = fileUpload.createWriteStream({
//       metadata: {
//         contentType: file.mimetype
//       }
//     });

//     blobStream.on('error', (error) => {
//       reject('Something is wrong! Unable to upload at the moment.');
//     });

//     blobStream.on('finish', () => {
//       // The public URL can be used to directly access the file via HTTP.
//       const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
//       resolve(url);
//     });

//     blobStream.end(file.buffer);
//   });
// }