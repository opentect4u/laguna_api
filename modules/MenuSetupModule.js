const db = require('../core/db');
const dateFormat = require('dateformat');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../assets/files');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });

const BreakfastSave = (upload.array('file'), (req, res, next) => {
    console.log(req.file);
    if (!req.file) {
        res.status(500);
    }
    res.json({ fileUrl: 'http://localhost:3000/assets/files/' + req.file.filename });
})

module.exports = { BreakfastSave };