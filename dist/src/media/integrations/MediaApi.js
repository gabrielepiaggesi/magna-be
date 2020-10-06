// import express from "express";
// import multer, { memoryStorage } from 'multer'
// import { auth } from "../../framework/integrations/middleware";
// import { MediaService } from "../services/MediaService";
// const mediaRoutes = express.Router();
// const multerConfig = {
//     storage: memoryStorage(),
//     limits: {
//       fileSize: 2 * 1024 * 1024 // no larger than 5mb, you can change as needed.
//     }
// };
// // services
// const mediaService = new MediaService();
// // <form action="/upload" method="post" enctype="multipart/form-data">
// //   <input type="file" name="avatar" />
// // </form>
// // routes
// mediaRoutes.post("/upload", 
//     auth.isUser, 
//     multer(multerConfig).single('file'), 
//     async (req, res) => await mediaService.uploadMedia(res, req)
// );
// export default mediaRoutes;
//# sourceMappingURL=MediaApi.js.map