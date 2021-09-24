const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs');
const { MenuImageSave } = require('../modules/MenuSetupModule');
const TestRouter = express.Router();
// const db = require('./db')

TestRouter.use(upload());

var dir = 'public';
var subDir = "public/uploads";

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.mkdirSync(subDir);
}

TestRouter.post('/testing', async (req, res) => {
    // await uploadFile(req.files.files, req.body.ac_id);
    let res_name = req.body.restaurant_name.replace(' ', '_');
    let menu_name = req.body.menu_id == 1 ? 'breakfast' : (req.body.menu_id == 2 ? 'lunch' : (req.body.menu_id == 3 ? 'dinner' : (req.body.menu_id == 4 ? 'brunch' : 'special')));
    await UploadCover(req.files.cov_img, req.files.top_img, menu_name, res_name, req.body)
    console.log({ fi: req.files, dt: req.body, re: req });
})

const UploadCover = async (cov_img, top_img, menu_name, res_name, data) => {
    if (cov_img && top_img) {
        var cov_file = cov_img;
        var top_file = top_img;
        var filename = cov_file.name,
            top_fl_name = top_img.name,
            top_file_ext = top_fl_name.split('.')[1],
            top_file_name = "top." + top_file_ext,
            top_file_path = "uploads/" + res_name + "/" + menu_name + "/" + top_file_name;
        let file_ext = filename.split('.')[1];
        var ResIdPath = "public/uploads/" + res_name;
        var UploadsPath = ResIdPath + "/" + menu_name + "/";
        var cov_file_name = "cover." + file_ext;
        var cov_file_path = "uploads/" + res_name + "/" + menu_name + "/" + cov_file_name;

        if (!fs.existsSync(ResIdPath)) {
            fs.mkdirSync(ResIdPath);
            fs.mkdirSync(UploadsPath);
        } else {
            if (!fs.existsSync(UploadsPath)) {
                fs.mkdirSync(UploadsPath);
            }
        }
        // console.log(filename);

        cov_file.mv(UploadsPath + cov_file_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Cover Uploaded');
            }
        })

        top_file.mv(UploadsPath + top_file_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Top Uploaded');
            }
        })

        await MenuImageSave()
    }
}

const uploadFile = (files, name) => {
    if (files) {
        var ResIdPath = "public/uploads/" + name;
        var UploadsPath = "public/uploads/" + name + "/breakfast/";

        if (!fs.existsSync(ResIdPath)) {
            fs.mkdirSync(ResIdPath);
            fs.mkdirSync(UploadsPath);
        } else {
            if (!fs.existsSync(UploadsPath)) {
                fs.mkdirSync(UploadsPath);
            }
        }
        files.forEach(dt => {
            var file = dt;
            var filename = file.name
            // console.log(filename);

            file.mv(UploadsPath + filename, (err) => {
                if (err) {
                    // res.send(err)
                } else {
                }
            })
        })
    }
}

module.exports = { TestRouter };