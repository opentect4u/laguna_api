const db = require('../core/db');
const dateFormat = require('dateformat');
var multer = require('multer');

const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');

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

const MenuSave = async (data) => {
    var mndt = await MenuImageSave(data);
    var othdt = await OtherImageSave(data);
    var secdt = await SectionImageSave(data);
    var mdt = await MonthDateSave(data);
    var dt = '';
    if (mndt && othdt && secdt && mdt) {
        dt = { suc: 1, msg: "Inserted Successfully !!" };
    } else {
        dt = { suc: 0, msg: "Something Went Wrong" };
    }
    return new Promise((resolve, reject) => {
        resolve(dt)
    })
}

const MenuImageSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO td_other_image (restaurant_id, menu_id, active_flag, cover_page_url, top_img_url, created_by, created_dt) VALUES
    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.coverurl}", "${data.topurl}", "${data.restaurant_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = false;
            } else {
                data = true;
            }
        })
        resolve(data)
    })
}

const OtherImageSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO td_menu_image (restaurant_id, menu_id, active_flag, menu_url, created_by, created_dt) VALUES 
    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.MenuUrl}", "${data.restaurant_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = false;
            } else {
                data = true;
            }
        })
        resolve(data)
    })
}

const SectionImageSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO td_section_image_request (restaurant_id, menu_id, active_flag, sec_url, created_by, created_dt) VALUES 
    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${data.SectionUrl}", "${data.restaurant_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = false;
            } else {
                data = true;
            }
        })
        resolve(data)
    })
}

const MonthDateSave = async (data) => {

    var sql = '';
    await DeleteDatetime(data);
    return new Promise((resolve, reject) => {
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        data.month_day.forEach(async d => {
            if (d.dt > 0) {
                var chk_dt = await Check_Data(db_name = 'td_date_time', whr = `WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day = "${d.dt}"`);
                if (chk_dt > 1) {
                    sql = `INSERT INTO td_date_time (restaurant_id, menu_id, active_flag, month_day, start_time, end_time, created_by, created_dt) VALUES 
                    ("${data.restaurant_id}", "${data.menu_id}", "${data.break_check}", "${d.dt}", "${data.start_time}", "${data.end_time}", "${data.restaurant_id}", "${datetime}")`;
                } else {
                    sql = `UPDATE td_date_time SET start_time = "${data.start_time}", end_time = "${data.end_time}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" 
                    WHERE restaurant_id = "${data.restaurant_id}" AND menu_id = "${data.menu_id}" AND month_day = "${d.dt}"`;
                }
                db.query(sql, (err, lastId) => {
                    if (err) {
                        console.log(err);
                        data = false;
                    } else {
                        data = true;
                    }
                })
            }
        })
        resolve(data);
    })
}

const DeleteDatetime = (data) => {
    var dt = {
        coverurl: 'asdsadasd',
        topurl: '123.com',
        MenuUrl: 'asdsad',
        SectionUrl: 'asdsa',
        restaurant_id: '55',
        menu_id: '3',
        break_check: 'Y',
        start_time: '22:11',
        end_time: '22:11',
        month_day: [
            { dt: 2 },
            { dt: 3 },
            { dt: 4 },
            { dt: 5 },
            { dt: 6 },
            { dt: 7 },
            { dt: 8 }
        ]
    }
}

const LogoSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO td_logo (restaurant_id, logo_url, created_by, created_dt) VALUES 
    ("${data.restaurant_id}", "${data.logo}", "${data.restaurant_id}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Inserted Successfully !!" };
            }
            resolve(data)
        })
    })
}

const AboutUsSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_dt = await Check_Data(db_name = 'td_about', whr = `WHERE restaurant_id = "${data.restaurant_id}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO td_about (restaurant_id, about_us, created_by, created_dt) VALUES 
        ("${data.restaurant_id}", "${data.aboutus}", "${data.restaurant_id}", "${datetime}")`;
    } else if (chk_dt == 1) {
        sql = `UPDATE td_about SET about_us = "${data.aboutus}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" WHERE restaurant_id = "${data.restaurant_id}"`;
    }

    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Inserted Successfully !!" };
            }
            resolve(data)
        })
    })
}

const NoticeSave = async (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    let chk_dt = await Check_Data(db_name = 'td_menu_notice', whr = `WHERE restaurant_id = "${data.restaurant_id}"`);
    var sql = '';
    if (chk_dt > 1) {
        sql = `INSERT INTO td_menu_notice (restaurant_id, menu_id, notice_flag, position_id, header_title, font_color, back_color, notice_content, created_by, created_dt) VALUES 
    ("${data.restaurant_id}", "${data.menu}", "${data.notice_flag}", "${data.position}", "${data.headertitle}", "${data.fontcolor}", "${data.back_color}", "${data.notice}", "${data.restaurant_id}", "${datetime}")`;
    } else {
        sql = `UPDATE td_menu_notice SET menu_id = "${data.menu}", notice_flag = "${data.notice_flag}", position_id = "${data.position}",
         header_title = "${data.headertitle}", font_color = "${data.fontcolor}", back_color = "${data.back_color}", notice_content = "${data.notice}", 
         modified_by = "${data.restaurant_id}", modified_dt = "${datetime}" WHERE restaurant_id = "${data.restaurant_id}"`;
    }

    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: "Inserted Successfully !!" };
            }
            resolve(data)
        })
    })
}

const F_Select = (sql) => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result };
            }
            resolve(data)
        })
    })
}

const Check_Data = (db_name, whr) => {
    let sql = `SELECT * FROM ${db_name} ${whr}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                data = 0;
            } else {
                if (result.length > 0) {
                    data = 1;
                } else {
                    data = 2;
                }
            }
            resolve(data);
        })
    })
}

const SectionSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (data.id) {
        sql = `UPDATE md_section SET menu_id = "${data.menu_id}", section_name = "${data.sec_name}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        sql = `INSERT INTO md_section (restaurant_id, menu_id, section_name, created_by, created_dt) VALUES 
        ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_name}", "${data.restaurant_id}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const ItemSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (data.id) {
        sql = `UPDATE md_items SET menu_id = "${data.menu_id}", section_id = "${data.sec_id}", item_name = "${data.item_name}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        sql = `INSERT INTO md_items (restaurant_id, menu_id, section_id, item_name, created_by, created_dt)
     VALUES ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_id}", "${data.item_name}", "${data.restaurant_id}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const ItemPriceSave = (data) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (data.id) {
        sql = `UPDATE md_item_description SET menu_id = "${data.menu_id}", section_id = "${data.sec_id}", item_id = "${data.item_id}", item_price = "${data.item_price}", 
        item_desc = "${data.item_desc}", item_note = "${data.item_note}", modified_by = "${data.restaurant_id}", modified_dt = "${datetime}"
        WHERE id = "${data.id}"`;
    } else {
        sql = `INSERT INTO md_item_description (restaurant_id, menu_id, section_id, item_id, item_price, item_desc, item_note, created_by, created_dt)
    VALUES ("${data.restaurant_id}", "${data.menu_id}", "${data.sec_id}", "${data.item_id}", "${data.item_price}", "${data.item_desc}", "${data.item_note}", "${data.restaurant_id}", "${datetime}")`;
    }

    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

const create = async (dataForQRcode, center_image, width, cwidth) => {
    const canvas = createCanvas(width, width);
    QRCode.toCanvas(
        canvas,
        dataForQRcode,
        {
            errorCorrectionLevel: "H",
            margin: 1,
            color: {
                dark: "#2196F3",
                light: "#ffffff",
            },
        }
    );

    const ctx = canvas.getContext("2d");
    const img = await loadImage(center_image);
    const center = (width - cwidth) / 2;
    let path = 'assets/qr.png';
    let img_name = 'qr.png';
    ctx.drawImage(img, center, center, cwidth, cwidth);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(path, buffer)
    return new Promise((resolve, reject) => {
        resolve({ path, img_name });
    })
    // return canvas.toDataURL("image/png");
}

const GenerateQr = async (data) => {
    const qrCode = await create(
        data.url,
        data.img,
        145,
        45
    );
    var sql = '';
    let ckh_sql = `SELECT * FROM md_url WHERE restaurant_id = "${data.res_id}"`;
    db.query(ckh_sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                sql = `UPDATE md_url url = "${data.url}", image = "${qrCode.img_name}" WHERE restaurant_id = "${data.res_id}"`;
            } else {
                sql = `INSERT INTO md_url (restaurant_id, url, image) VALUES ("${data.res_id}", "${data.url}", "${qrCode.img_name}")`;
            }
        }
    })
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: 'Inserted Successfully !!' };
            }
            resolve(data)
        })
    })
}

module.exports = {
    BreakfastSave, MenuSave, LogoSave, AboutUsSave, NoticeSave, F_Select, MonthDateSave, SectionSave, ItemSave, ItemPriceSave, GenerateQr, MenuImageSave, OtherImageSave, SectionImageSave };