// import multer from "multer";
// import multerS3 from "multer-s3";
// import AWS from "aws-sdk";
// import { Request, Response, NextFunction } from "express";
// import { UnsupportedFormatError, ValidationError } from "../../../../packages/middleware/error";

// import path from "path";

// // Use AWS SDK v2 types for multer-s3 compatibility
// const S3 = new AWS.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_KEY,
//     region: "ap-south-1",
//     signatureVersion: "v4",
// });

// const uploadlogoAndCoverPhoto = multer({
//     // CREATE MULTER-S3 FUNCTION FOR STORAGE
//     storage: multerS3({
//         s3: S3,
//         acl: "public-read",
//         // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
//         bucket: process.env.S3_PROJECTS_BUCKET!!,
//         // META DATA FOR PUTTING FIELD NAME
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         // SET / MODIFY ORIGINAL FILE NAME
//         key: function (req: Request, file, cb) {
//             let key;
//             if (file.fieldname == "logo") {
//                 let extname = path.extname(file.originalname).toLowerCase();
//                 key = `projects/${Date.now().toString()}-logo${extname}`;
//                 console.log("Key", key);
//             } else {
//                 let extname = path.extname(file.originalname).toLowerCase();
//                 key = `projects/${Date.now().toString()}-coverPhoto${extname}`;
//                 console.log("Key", key);
//             }
//             cb(null, key);
//         },
//     }),
//     // SET DEFAULT FILE SIZE UPLOAD LIMIT
//     limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
//     // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
//     fileFilter: function (req, file, cb) {
//         const filetypes = /jpeg|jpg|png/;
//         const mimetypes = /image\/jpeg|image\/jpg|image\/png/;
//         const extname = filetypes.test(
//             path.extname(file.originalname).toLowerCase()
//         );
//         const mimetype = mimetypes.test(file.mimetype);
//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(
//                 new ValidationError(
//                     "Allow screenshot images only of extensions jpeg|jpg|png !"
//                 )
//             );
//         }
//     },
// });
// export default {
//     uploadlogoAndCoverPhoto,
// };
