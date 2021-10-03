const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs');
const { MenuImageSave, SectionImageSave, OtherImageSave, MonthDateSave, LogoSave, SectionSave } = require('../modules/MenuSetupModule');
const TestRouter = express.Router();
const db = require('../core/db');

TestRouter.use(upload());

//var dir = 'public';
//var subDir = "public/uploads";

//if (!fs.existsSync(dir)) {
//    fs.mkdirSync(dir);

//    fs.mkdirSync(subDir);
//}

// TestRouter.post('/testing', async (req, res) => {
//     // console.log({ bd: req.body });
//     var cov_file_name = '',
//         top_img_name = '';
//     if (req.files.cov_img) {
//         cov_file_name = req.body.restaurant_id + '_' + req.body.menu_id + '_cover_' + req.files.cov_img.name;
//         req.files.cov_img.mv('uploads/' + cov_file_name, async (err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('Other Image Top Uploaded');
//             }
//         })
//     }
//     if (req.files.top_img) {
//         top_img_name = req.body.restaurant_id + '_' + req.body.menu_id + '_top_' + req.files.top_img.name;
//         req.files.top_img.mv('uploads/' + top_img_name, async (err) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('Other Image Top Uploaded');
//             }
//         })
//     }

//     var dt = await MenuImageSave(req.body, cov_file_name, top_img_name);
//     var upload_menu = await UploadMenu(req.files.menu_img, req.body);
//     var upload_sec = await UploadSection(req.files.section_img, req.body);
//     res.send({ suc: 1, msg: 'Success' });
// })

TestRouter.post('/testing', async (req, res) => {
    console.log({ bd: req });
    var cov_file_name = '',
        top_img_name = '',
        data = req.body;
    if (req.body.cov_img) {
        var cov_buffer = req.body.cov_img;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        cov_file_name = data.restaurant_id + '_cover_' + req.body.cov_filename;

        // console.log(ext);
        var cov_buffer_dt = cov_buffer.replace(/^data:image\/png;base64,/, "");
        cov_buffer_dt += cov_buffer_dt.replace('+', ' ');
        let cov_binaer_dt = new Buffer(cov_buffer_dt, 'base64').toString('binary');
        fs.writeFile("uploads/" + cov_file_name, cov_binaer_dt, "binary", async (err) => {
            if (err) console.log(err);
            // else {
            //     await LogoSave(data, filename);
            // }
        });
        // cov_file_name = req.body.restaurant_id + '_' + req.body.menu_id + '_cover_' + req.files.cov_img.name;
        // req.files.cov_img.mv('uploads/' + cov_file_name, async (err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('Other Image Top Uploaded');
        //     }
        // })
    }
    if (req.body.top_img) {
        // top_img_name = req.body.restaurant_id + '_' + req.body.menu_id + '_top_' + req.files.top_img.name;
        // req.files.top_img.mv('uploads/' + top_img_name, async (err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('Other Image Top Uploaded');
        //     }
        // })
        var top_buffer = req.body.top_img;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        top_img_name = data.restaurant_id + '_top_' + req.body.top_filename;

        // console.log(ext);
        var top_buffer_dt = top_buffer.replace(/^data:image\/png;base64,/, "");
        top_buffer_dt += top_buffer_dt.replace('+', ' ');
        let top_binaer_dt = new Buffer(top_buffer_dt, 'base64').toString('binary');
        fs.writeFile("uploads/" + top_img_name, top_binaer_dt, "binary", async (err) => {
            if (err) console.log(err);
            // else {
            //     await LogoSave(data, filename);
            // }
        });
    }

    var dt = await MenuImageSave(req.body, cov_file_name, top_img_name);
    var upload_menu = await UploadMenu(req.files ? (req.files.menu_img ? req.files.menu_img : null) : null, req.body);
    var upload_sec = await UploadSection(req.files.section_img ? req.files.section_img : null, req.body);
    res.send({ suc: 1, msg: 'Success' });
})

const UploadSection = async (sec_img, data) => {
    var file_path = '';
    if (sec_img) {
        // console.log();
        var sec_file = sec_img,
            ResIdPath = "uploads/";

        if (Array.isArray(sec_img)) {
            console.log(sec_file.length);
            file_path = new Array();
            for (let i = 1; i <= sec_file.length; i++) {
                var filename = '';
                var file = sec_file[i - 1];
                filename = data.restaurant_id + '_' + data.menu_id + '_section_' + i + '_' + file.name;
                file_path.push({ i, filename });

                file.mv('uploads/' + filename, async (err) => {
                    if (err) {
                        console.log(`${filename} not uploaded`);
                    } else {
                        console.log(`Successfully ${filename} uploaded`);
                    }
                })
            }
            await SectionImageSave(data, file_path);
        } else {
            var filename = data.restaurant_id + '_' + data.menu_id + '_section_' + sec_file.name;

            sec_file.mv('Uploads/' + filename, async (err) => {
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
    if (menu_img) {
        var sec_file = menu_img,
            ResIdPath = "uploads/";

        if (Array.isArray(sec_file)) {
            console.log(sec_file.length);
            let j = 0;
            file_path = new Array();
            for (let i = 1; i <= sec_file.length; i++) {
                var filename = '';
                var file = sec_file[i - 1];
                filename = data.restaurant_id + '_' + data.menu_id + '_menu_' + i + '_' + file.name;
                file_path.push({ i, filename });

                file.mv('uploads/' + filename, async (err) => {
                    if (err) {
                        console.log(`${filename} not uploaded`);
                    } else {
                        console.log(`Successfully ${filename} uploaded`);
                    }
                })
            }
            await OtherImageSave(data, file_path);
            // console.log(Array.isArray(file_path));
        } else {
            // console.log({ else: Array.isArray(file_path) });
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
        // console.log("Null File Selected");
        await OtherImageSave(data, file_path)
    }
}

TestRouter.post('/logo', async (req, res) => {
    // console.log({ body: req.body, fl: req.files, req });
    // let res_name = req.body.restaurant_name.replace(' ', '_');
    // var data = await UploadLogo(req.files.logo_img, res_name, req.body);
    var data = await UploadLogo(req.body.logo_img, req.body);
    // console.log({logo_img: req.body.logo_img, body: req.body, req});
    res.send({ suc: 1, msg: 'Success' });
})

const UploadLogo = async (logo_img, data) => {
    var dt = '',
        file_path = '';
    if (logo_img) {
        var buffer = logo_img;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        var filename = data.restaurant_id + '_logo_' + data.filename;

        console.log(filename);
        var buffer_dt = buffer.replace(/^data:image\/png;base64,/, "");
        buffer_dt += buffer_dt.replace('+', ' ');
        let binaer_dt = new Buffer(buffer_dt, 'base64').toString('binary');
        fs.writeFile("uploads/" + filename, binaer_dt, "binary", async (err) => {
            if (err) console.log(err); // writes out file without error, but it's not a valid image
            else {
                await LogoSave(data, filename);
            }
        });
        // file.mv("uploads/" + filename, async (err) => {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log('Logo Uploaded ' + filename);
        //         await LogoSave(data, filename);
        //     }
        // })

    } else {
        await LogoSave(data, file_path);
    }
}

TestRouter.post('/cover_save', async (req, res) => {
    var img_type = 'cover';
    var dt = await CoverImgUpload(req.body.cov_img, img_type, req.body);
    res.send(dt);
})

const CoverImgUpload = async (files, img_type, data) => {
    var filename = '',
        res = '';
    if (files) {
        // var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;

        var buffer = files;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + data.filename;

        // console.log(ext);
        var buffer_dt = buffer.replace(/^data:image\/png;base64,/, "");
        buffer_dt += buffer_dt.replace('+', ' ');
        let binaer_dt = new Buffer(buffer_dt, 'base64').toString('binary');
        return new Promise(async (resolve, reject) => {
            fs.writeFile("uploads/" + filename, binaer_dt, "binary", async (err) => {
                if (err) { console.log(err); res = { suc: 0, msg: "err" }; } // writes out file without error, but it's not a valid image
                else {
                    res = await UpdateOtherImg(`cover_page_url = "${data.cov_url}", cover_page_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
                }
                resolve(res);
            });

        })

        // files.mv('uploads/' + filename, async (err) => {
        //     if (err) {
        //         console.log(`${filename} not uploaded`);
        //     } else {
        //         console.log(`Successfully ${filename} uploaded`);
        //         return new Promise(async (resolve, reject) => {
        //             dt = await UpdateOtherImg(`cover_page_url = "${data.cov_url}", cover_page_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
        //             resolve(dt);
        //         })
        //     }
        // })
    } else {
        return new Promise(async (resolve, reject) => {
            res = await UpdateOtherImg(`cover_page_url = "${data.cov_url}", cover_page_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
            resolve(res);
        })
    }
}

TestRouter.post('/top_save', async (req, res) => {
    var img_type = 'top';
    var dt = await TopImgUpload(req.body.top_img, img_type, req.body);
    res.send(dt);
})

const TopImgUpload = async (files, img_type, data) => {
    var filename = '',
        res = '';
    if (files) {
        // var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;
        // return new Promise(async (resolve, reject) => {
        //     files.mv('uploads/' + filename, async (err) => {
        //         if (err) {
        //             console.log(`${filename} not uploaded`);
        //         } else {
        //             console.log(`Successfully ${filename} uploaded`);
        //             dt = await UpdateOtherImg(`top_img_url = "${data.top_url}", top_image_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
        //             resolve(dt);
        //         }
        //     })
        // })
        var buffer = files;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + data.filename;

        // console.log(ext);
        var buffer_dt = buffer.replace(/^data:image\/png;base64,/, "");
        buffer_dt += buffer_dt.replace('+', ' ');
        let binaer_dt = new Buffer(buffer_dt, 'base64').toString('binary');
        return new Promise(async (resolve, reject) => {
            fs.writeFile("uploads/" + filename, binaer_dt, "binary", async (err) => {
                if (err) { console.log(err); res = { suc: 0, msg: "err" }; } // writes out file without error, but it's not a valid image
                else {
                    res = await UpdateOtherImg(`top_img_url = "${data.top_url}", top_image_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
                }
                resolve(res);
            });
        })
    } else {
        return new Promise(async (resolve, reject) => {
            res = await UpdateOtherImg(`top_img_url = "${data.top_url}", top_image_img = "${filename}"`, `id = "${data.id}" AND restaurant_id = "${data.restaurant_id}"`, 'td_other_image');
            resolve(res);
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

TestRouter.post('/section', async (req, res) => {
    // console.log(req.files);
    var sec_name = req.body.sec_name.replace(' ', '_');
    var img_type = 'section' + sec_name;
    var dt = await UploadSectionImg(req.body.sec_img, img_type, req.body);
    res.send(dt);
})

const UploadSectionImg = (files, img_type, data) => {
    var filename = '',
        res = '';
    if (files) {
        // var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + files.name;
        // return new Promise(async (resolve, reject) => {
        //     files.mv('uploads/' + filename, async (err) => {
        //         if (err) {
        //             console.log(`${filename} not uploaded`);
        //         } else {
        //             console.log(`Successfully ${filename} uploaded`);
        //             dt = await SectionSave(data, filename);
        //             resolve(dt);
        //         }
        //     })
        // })
        var buffer = files;
        // var dt = buffer.split(';');
        // var ext = dt[0].split('/')[1];
        var filename = data.restaurant_id + '_' + data.menu_id + '_' + img_type + '_' + data.filename;

        // console.log(ext);
        var buffer_dt = buffer.replace(/^data:image\/png;base64,/, "");
        buffer_dt += buffer_dt.replace('+', ' ');
        let binaer_dt = new Buffer(buffer_dt, 'base64').toString('binary');
        return new Promise(async (resolve, reject) => {
            fs.writeFile("uploads/" + filename, binaer_dt, "binary", async (err) => {
                if (err) { console.log(err); res = { suc: 0, msg: "err" }; } // writes out file without error, but it's not a valid image
                else {

                    res = await SectionSave(data, filename);
                }
                resolve(res);
            });
        })
    } else {
        return new Promise(async (resolve, reject) => {
            res = await SectionSave(data, filename);
            resolve(res);
        })
    }
}

TestRouter.get('/del_menu', (req, res) => {
    var sql = `DELETE FROM td_menu_image WHERE restaurant_id = ${req.query.res_id} AND id = ${req.query.id}`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
            res.send({ suc: 0, msg: JSON.stringify(err) });
        } else {
            res.send({ suc: 1, msg: "Deleted" });
        }
    })
})

TestRouter.get('/del_sec', (req, res) => {
    var sql = `DELETE FROM td_section_image_request WHERE restaurant_id = ${req.query.res_id} AND id = ${req.query.id}`;
    db.query(sql, (err, lastId) => {
        if (err) {
            console.log(err);
            res.send({ suc: 0, msg: JSON.stringify(err) });
        } else {
            res.send({ suc: 1, msg: "Deleted" });
        }
    })
})

module.exports = { TestRouter, UploadLogo };