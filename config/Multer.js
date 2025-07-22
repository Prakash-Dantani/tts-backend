const multer = require("multer");
const multerS3 = require("multer-s3");


const uploadToBucket = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        acl: 'public-read', // Allows public URL access
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const filename = Date.now().toString() + "-" + file.originalname;
            cb(null, filename);
        },

    })
});

module.exports = uploadToBucket;