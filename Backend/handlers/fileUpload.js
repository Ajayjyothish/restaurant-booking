const multer = require("multer");
const fs = require("fs");

// Configure Storage
var storage = multer.diskStorage({
  // Setting directory on disk to save uploaded files
  destination: function (req, file, cb) {
    let type = req.params.type;
    if (type !== "restaurants") {
      const dir = `public/my_uploaded_files/${type}`;
      return cb(null, dir);
    } else {
      const dir = `public/my_uploaded_files/${type}/${req.params.id}`;
      if (!fs.existsSync(dir)) {
        console.log("does not exist");
        fs.mkdir(dir, () => {
          return cb(null, dir);
        });
      } else {
        console.log("exists");
        return cb(null, dir);
      }
    }
  },

  // Setting name of file saved
  filename: function (req, file, cb) {
    let fileName = req.params.filename;
    cb(null, fileName);
  },
});

module.exports = multer({
  storage: storage,
  limits: {
    // Setting Image Size Limit to 2MBs
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //Error
      cb(new Error("Please upload JPG and PNG images only!"));
    }
    //Success
    cb(undefined, true);
  },
});
