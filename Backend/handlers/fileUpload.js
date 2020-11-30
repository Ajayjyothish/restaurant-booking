const multer = require('multer');
var fileExtension = require('file-extension')


// Configure Storage
var storage = multer.diskStorage({
    // Setting directory on disk to save uploaded files
    destination: function (req, file, cb) {
        let type = req.params.type
        cb(null, 'public/my_uploaded_files/'+ type)
    },

    // Setting name of file saved
    filename: function (req, file, cb) {
        let fileName = req.params.filename
        cb(null, fileName )
    }
})

module.exports=  multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 2MBs
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            //Error 
            cb(new Error('Please upload JPG and PNG images only!'))
        }
        //Success 
        cb(undefined, true)
    }
})





