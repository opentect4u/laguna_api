const db = require('../core/db');
const Buffer = require('buffer').Buffer;
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
var data = '';

const ResRegistration = (data) => {
    // console.log(data);
    var add2_fl = data.Address2 ? ',addr_line2' : '';
    var add2_vl = data.Address2 ? `,"${data.Address2}"` : '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `INSERT INTO td_contacts (contact_date, restaurant_name, contact_name, phone_no, email, addr_line1 ${add2_fl}, city, zip, country, website, created_by, created_at) VALUES ("${datetime}","${data.Name}", "${data.Contact}","${data.Telephone}","${data.Email}","${data.Address1}" ${add2_vl}, "${data.cityState}","${data.zip}","${data.country}","${data.Website}", "${data.Email}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            }
            else {
                let str = result.insertId + '/' + data.Email;
                let id_en = Buffer.from(str).toString('base64');
                data = { suc: 1, msg: 'Successfully Inserted !!', id: id_en };
            }
            resolve(data);
        })
    })
}

const EmailCheck = (data) => {
    var sql = `SELECT * FROM td_contacts WHERE email = "${data.Email}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                if (result.length > 0) {
                    data = { suc: 2, msg: 'Email Already Exist' };
                } else {
                    data = { suc: 1, msg: 'Fresh Email' }
                }
            }
            resolve(data);
        })
    })
}

const MobileCheck = (mob_no) => {
    var sql = `SELECT * FROM td_contacts WHERE phone_no = "${mob_no}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                if (result.length > 0) {
                    data = { suc: 2, msg: 'Number Already Exist' };
                } else {
                    data = { suc: 1, msg: 'Fresh Number' }
                }
            }
            resolve(data);
        })
    })
}

const OrderSave = (data) => {
    // var table_top = [{
    //     id: '6',
    //     qty: data.tabletop
    // }, {
    //     id: '7',
    //     qty: data.wall_mount1
    // }, {
    //     id: '8',
    //     qty: data.wall_mount2
    // }];
    // var window_cling = [{
    //     id: '9',
    //     qty: data.window
    // }];
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var str = Buffer.from(data.res_id, 'base64').toString('ascii');
    var de_id = str.split('/');
    // console.log({ table_top, window_cling, st: str.split('/')[0] });
    var sql = `INSERT INTO td_order_items (restaurant_id, package_id, birth_calendar_flag, event_calendar, table_top_6, table_top_7, table_top_8, window_cling_9, created_by, created_dt) VALUES
    ("${de_id[0]}", "${data.package}", "${data.birthday}", "${data.event}", '${data.tabletop}', '${data.wall_mount1}', "${data.wall_mount2}", "${data.window}", "${de_id[1]}", "${datetime}")`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            }
            else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const UpdateOrder = (data) => {
    var str = Buffer.from(data.res_id, 'base64').toString('ascii');
    var de_id = str.split('/');
    var sql = `UPDATE td_order_items SET payment_flag = "Y" WHERE restaurant_id = ${de_id[0]}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = false;
            }
            else {
                data = true;
            }
            resolve(data);
        })
    })
}

const PaySave = async (data) => {
    var str = Buffer.from(data.res_id, 'base64').toString('ascii');
    var de_id = str.split('/');
    var pwd = bcrypt.hashSync('123', 10);
    var dt = '';
    await SaveUrl(de_id[0], data);
    return new Promise(async (resolve, reject) => {
        if (await UpdateOrder(data)) {
            var sql = `INSERT INTO td_users (restaurant_id, email_id, pwd, active_flag) VALUES ("${de_id[0]}", "${de_id[1]}", "${pwd}", "Y")`;
            db.query(sql, async (err, result) => {
                if (err) {
                    console.log(err);
                    data = { suc: 0, msg: JSON.stringify(err) };
                }
                else {
                    if (dt = await GetResturentDetails(de_id[0])) {
                        data = { suc: 1, msg: 'Successfully Inserted !!', res: dt[0] };
                    } else {
                        data = { suc: 0, msg: "Something Went Wrong" };
                    }

                }
                resolve(data);
            })
        } else {
            data = { suc: 0, msg: "Err In UpdateOrder" };
            resolve(data);
        }
    })
}

const GetResturentDetails = (id) => {
    var sql = `SELECT a.*, c.no_of_menu FROM td_contacts a, td_order_items b, md_package c WHERE a.id = "${id}" AND a.id=b.restaurant_id AND b.package_id=c.id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = false;
            }
            else {
                data = result;
            }
            resolve(data);
        })
    })
}

const SaveUrl = (id, data) => {
    var sql = '';
    let ckh_sql = `SELECT * FROM md_url WHERE restaurant_id = "${id}"`;
    db.query(ckh_sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                sql = `UPDATE md_url url = "${data.url}" WHERE restaurant_id = "${id}"`;
            } else {
                sql = `INSERT INTO md_url (restaurant_id, url) VALUES ("${id}", "${data.url}")`;
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
    })
}

module.exports = { ResRegistration, EmailCheck, OrderSave, PaySave, MobileCheck };