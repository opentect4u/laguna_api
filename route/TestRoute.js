const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs');
const db = require('../core/db');
const { MenuImageSave, SectionImageSave, OtherImageSave, MonthDateSave, LogoSave, SectionSave } = require('../modules/MenuSetupModule');
const TestRouter = express.Router();
// const db = require('./db')

TestRouter.use(upload());

//var dir = 'public';
//var subDir = "public/uploads";

//if (!fs.existsSync(dir)) {
//    fs.mkdirSync(dir);

//    fs.mkdirSync(subDir);
//}

TestRouter.post('/testing', async (req, res) => {
    // console.log({ bd: req.body });
    var cov_file_name = '',
        top_img_name = '';
    if (req.files.cov_img) {
        cov_file_name = req.body.restaurant_id + '_' + req.body.menu_id + '_cover_' + req.files.cov_img.name;
        req.files.cov_img.mv('uploads/' + cov_file_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Top Uploaded');
            }
        })
    }
    if (req.files.top_img) {
        top_img_name = req.body.restaurant_id + '_' + req.body.menu_id + '_top_' + req.files.top_img.name;
        req.files.top_img.mv('uploads/' + top_img_name, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Other Image Top Uploaded');
            }
        })
    }

    var dt = await MenuImageSave(req.body, cov_file_name, top_img_name);
    var upload_menu = await UploadMenu(req.files.menu_img ? req.files.menu_img : null, req.body);
    var upload_sec = await UploadSection(req.files.section_img ? req.files.section_img : null, req.body);
    res.send({ suc: 1, msg: 'Success' });
})

const UploadCover = async (menu_name, res_name, data) => {
    var top_file_path = '',
        cov_file_path = '';
    if (cov_img && top_img) {
        var cov_file = cov_img;
        var top_file = top_img;
        var filename = cov_file.name,
            top_fl_name = top_img.name,
            top_file_ext = top_fl_name.split('.')[1],
            top_file_name = "top." + top_file_ext;
        top_file_path = "uploads/" + top_file_name;
        let file_ext = filename.split('.')[1];
        var ResIdPath = "uploads/";
        var UploadsPath = ResIdPath + "/";
        var cov_file_name = "cover." + file_ext;
        cov_file_path = "uploads/" + cov_file_name;

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

        // return new Promise(async (resolve, reject) => {
        //     if (await MenuImageSave(data, cov_file_path, top_file_path)) {
        //         res = true;
        //     } else {
        //         res = false
        //     }
        //     resolve(res);
        // })
    }

    return new Promise(async (resolve, reject) => {
        if (await MenuImageSave(data, cov_file_path, top_file_path)) {
            res = true;
        } else {
            res = false
        }
        resolve(res);
    })
}

const UploadSection = async (sec_img, data) => {
    var file_path = '';
    if (sec_img) {
        // console.log();
        var sec_file = sec_img,
            ResIdPath = "uploads/";

        if (Array.isArray(sec_img)) {
            var i = 1;
            sec_file.forEach(dt => {
                var file = dt;
                var filename = data.restaurant_id + '_' + data.menu_id + '_section_' + i + '_' + file.name;

                file.mv("uploads/" + filename, async (err) => {
                    if (err) {
                        console.log(`${filename} not uploaded`);
                    } else {
                        console.log(`Successfully ${filename} uploaded`);
                        await SectionImageSave(data, filename);
                    }
                })
                i++;
            })
        } else {
            var filename = data.restaurant_id + '_' + data.menu_id + '_section_' + sec_file.name;

            sec_file.mv("uploads/" + filename, async (err) => {
                if (err) {
                    console.log(`${filename} not uploaded`);
                } else {
                    console.log(`Successfully ${filename} uploaded`);
                    await SectionImageSave(data, filename);
                }
            })
        }
    } else {
        await SectionImageSave(data, file_path);
    }
}

const UploadMenu = async (menu_img, data) => {
    var file_path = '';
    // console.log({ menu_len: menu_img });
    if (menu_img) {
        var sec_file = menu_img,
            // filename = sec_file.name,
            // file_ext = filename.split('.')[1],
            ResIdPath = "uploads/";

        if (Array.isArray(sec_file)) {
            var i = 1;
            sec_file.forEach(dt => {
                var file = dt;
                var filename = data.restaurant_id + '_' + data.menu_id + '_menu_' + i + '_' + file.name;

                file.mv('uploads/' + filename, async (err) => {
                    if (err) {
                        console.log(`${filename} not uploaded`);
                    } else {
                        console.log(`Successfully ${filename} uploaded`);
                        await OtherImageSave(data, filename);
                    }
                })
                i++;
            })
        } else {
            var filename = data.restaurant_id + '_' + data.menu_id + '_menu_' + sec_file.name;

            sec_file.mv('Uploads/' + filename, async (err) => {
                if (err) {
                    console.log(`${filename} not uploaded`);
                } else {
                    console.log(`Successfully ${filename} uploaded`);
                    await OtherImageSave(data, filename);
                }
            })
        }

    } else {
        await OtherImageSave(data, file_path)
    }
}

TestRouter.post('/logo', async (req, res) => {
    // console.log({ body: req.body, fl: req.files, req });
    // let res_name = req.body.restaurant_name.replace(' ', '_');
    // var data = await UploadLogo(req.files.logo_img, res_name, req.body);
    var data = await UploadLogo(req.files.logo_img, req.body);
    res.send({ suc: 1, msg: 'Success' });
})

const UploadLogo = async (logo_img, data) => {
    var dt = '',
        file_path = '';
    if (logo_img) {
        var file = logo_img;
        var filename = data.restaurant_id + '_logo_' + file.name;

        file.mv("uploads/" + filename, async (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Logo Uploaded ' + filename);
                await LogoSave(data, filename);
            }
        })

    } else {
        await LogoSave(data, file_path);
    }
}

TestRouter.post('/cover_save', async (req, res) => {
    var img_type = 'cover';
    var dt = await CoverImgUpload(req.files.cov_img, img_type, req.body);
    res.send(dt);
})

const CoverImgUpload = async (files, img_type, data) => {
    var filename = '',
        dt = '';
    if (files) {
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;
        return new Promise(async (resolve, reject) => {
            files.mv('uploads/' + filename, async (err) => {
                if (err) {
                    console.log(`${filename} not uploaded`);
                } else {
                    console.log(`Successfully ${filename} uploaded`);
                    dt = await UpdateOtherImg(`cover_page_url = "${data.cov_url}", cover_page_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
                }
                resolve(dt);
            })
        })
    } else {
        return new Promise(async (resolve, reject) => {
            dt = await UpdateOtherImg(`cover_page_url = "${data.cov_url}", cover_page_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
            resolve(dt);
        })
    }
}

TestRouter.post('/top_save', async (req, res) => {
    var img_type = 'top';
    var dt = await TopImgUpload(req.files.top_img, img_type, req.body);
    res.send(dt);
})

const TopImgUpload = async (files, img_type, data) => {
    var filename = '',
        dt = '';
    if (files) {
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;
        return new Promise(async (resolve, reject) => {
            files.mv('uploads/' + filename, async (err) => {
                if (err) {
                    console.log(`${filename} not uploaded`);
                } else {
                    console.log(`Successfully ${filename} uploaded`);
                    dt = await UpdateOtherImg(`top_img_url = "${data.top_url}", top_image_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
                    resolve(dt);
                }
            })
        })
    } else {
        return new Promise(async (resolve, reject) => {
            dt = await UpdateOtherImg(`top_img_url = "${data.top_url}", top_image_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
            resolve(dt);
        })
    }
}

TestRouter.post('/section', async (req, res) => {
    var sec_name = req.body.sec_name.replace(' ', '_');
    var img_type = 'section' + sec_name;
    var dt = await UploadSectionImg(req.files ? req.files.sec_img : null, img_type, req.body);
    res.send(dt);
})

const UploadSectionImg = (files, img_type, data) => {
    var filename = '',
        dt = '';
    if (files) {
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;
        return new Promise(async (resolve, reject) => {
            files.mv('uploads/' + filename, async (err) => {
                if (err) {
                    console.log(`${filename} not uploaded`);
                } else {
                    console.log(`Successfully ${filename} uploaded`);
                    dt = await SectionSave(data, filename);
                    resolve(dt);
                }
            })
        })
    } else {
        return new Promise(async (resolve, reject) => {
            dt = await SectionSave(data, filename);
            resolve(dt);
        })
    }
}

const UpdateOtherImg = (fields, whr, table_name) => {
    var sql = `UPDATE ${table_name} SET ${fields} WHERE ${whr}`;
    var res = '';
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                res = { suc: 0, msg: 'Not Updated' };
            } else {
                res = { suc: 1, msg: 'Updated Successfully' };
            }
            resolve(res)
        })
    })
}

module.exports = { TestRouter, UploadLogo };