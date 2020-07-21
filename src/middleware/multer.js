const multer = require("multer");

const avatar = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith(".pdf"))
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be one of the format: jpg, jpeg or png"));
    }

    cb(undefined, true);
  },
});

module.exports = avatar;
