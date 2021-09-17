const db = require('../core/db');
const dateFormat = require('dateformat');
const bcrypt = require('bcrypt');
var data = '';

const Login = async (data) => {
    // console.log(data);
    var sql = `SELECT * FROM td_users WHERE email_id = "${data.uname}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: 'Something Went Wrong' };
            }
            if (result.length > 0) {
                if (await bcrypt.compare(data.psw, result[0].pwd)) {
                    await UpdateLoginTime(email = data.uname);
                    if (result[0].last_login_dt) {
                        data = { suc: 1, msg: result[0] };
                    } else {
                        data = { suc: 2, msg: result[0] };
                    }
                } else {
                    data = { suc: 0, msg: 'Please Check Your User ID Or Password' }
                }
            } else {
                data = { suc: 0, msg: 'User Is Deactivated Or No Data Found' };
            }
            resolve(data);
        })
    })
}

const UpdateLoginTime = (email_id) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = `UPDATE td_users SET last_login_dt = "${datetime}" WHERE email = ${email_id}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
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

module.exports = { Login }