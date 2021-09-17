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

const OrderSave = (data) => {
    var table_top = [{
        id: '6',
        qty: data.tabletop
    }, {
        id: '7',
        qty: data.wall_mount1
    }, {
        id: '8',
        qty: data.wall_mount2
    }];
    var window_cling = [{
        id: '9',
        qty: data.window
    }];
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var str = Buffer.from(data.res_id, 'base64').toString('ascii');
    var de_id = str.split('/');
    // console.log({ table_top, window_cling, st: str.split('/')[0] });
    var sql = `INSERT INTO td_order_items (restaurant_id, package_id, birth_calendar_flag, event_calendar, table_top, window_cling, created_by, created_dt) VALUES 
    ("${de_id[0]}", "${data.package}", "${data.birthday}", "${data.event}", '${JSON.stringify(table_top)}', '${JSON.stringify(window_cling)}', "${de_id[1]}", "${datetime}")`;
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

    return new Promise(async (resolve, reject) => {
        if (await UpdateOrder(data)) {
            var sql = `INSERT INTO td_users (restaurant_id, email_id, pwd, active_flag) VALUES ("${de_id[0]}", "${de_id[1]}", "${pwd}", "Y")`;
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
        } else {
            data = { suc: 0, msg: "Err In UpdateOrder" };
            resolve(data);
        }
    })
}

module.exports = { ResRegistration, EmailCheck, OrderSave, PaySave };