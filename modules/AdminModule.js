const db = require('../core/db');
const dateFormat = require('dateformat');
var data = '';

const GetPackageData = (data) => {
    var sql = `SELECT * FROM md_package`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = { suc: 0, msg: JSON.stringify(err) }; }
            else {
                if (result.length > 0) {
                    data = { suc: 1, msg: result };
                } else {
                    data = { suc: 2, msg: 'No Data Found' };
                }
            }
            resolve(data);
        })
    })
}

const PackageSave = async (data) => {
    var check = await CheckPackage(data,);
    var user = 'admin@gmail.com';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_package (pakage_name, no_of_menu, special_menu, setup_fee, monthly_fee, created_by, created_dt) VALUES ("${data.Serial_no}", "${data.Menu_number}", "${data.Special_Menu}", "${data.SetUp_Fee}", "${data.Monthly_Fee}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_package SET no_of_menu= "${data.Menu_number}", special_menu= "${data.Special_Menu}", setup_fee= "${data.SetUp_Fee}", monthly_fee= "${data.Monthly_Fee}", modified_by= "${user}", modified_dt= "${datetime}" WHERE pakage_name = ${data.Serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const CheckPackage = (data) => {
    var sql = `SELECT * FROM md_package WHERE pakage_name = ${data.Serial_no}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = 0; }
            else {
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

const GetResult = (tb_name) => {
    var sql = `SELECT * FROM ${tb_name}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = { suc: 0, msg: JSON.stringify(err) }; }
            else {
                if (result.length > 0) {
                    data = { suc: 1, msg: result };
                } else {
                    data = { suc: 2, msg: 'No Data Found' };
                }
            }
            resolve(data);
        })
    })
}

const PromoSave = async (data) => {
    var check = await CheckData(data, tb_name = 'md_promo_calander');
    var user = 'admin@gmail.com';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_promo_calander (id, free_flag, price, created_by, created_dt) VALUES ("${data.serial_no}", "${data.free}", "${data.price}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_promo_calander SET free_flag= "${data.free}", price= "${data.price}", modified_by= "${user}", modified_dt= "${datetime}" WHERE id = ${data.serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const HolderClingSave = async (data) => {
    var check = await CheckData(data, tb_name = 'md_holder_cling');
    var sql = '';
    var user = 'admin@gmail.com',
        free_flag = data.per_Holder_Price > 0 ? 'N' : 'Y',
        price = data.per_Holder_Price > 0 ? data.per_Holder_Price : 0;
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    if (check > 1) {
        sql = `INSERT INTO md_holder_cling (id, free_flag, price, created_by, created_dt) VALUES ("${data.serial_no}", "${free_flag}", "${price}", "${user}", "${datetime}")`;
    } else {
        sql = `UPDATE md_holder_cling SET free_flag= "${free_flag}", price= "${price}", modified_by= "${user}", modified_dt= "${datetime}" WHERE id = ${data.serial_no}`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Inserted !!' };
            }
            resolve(data);
        })
    })
}

const CheckData = (data, tb_name) => {
    var sql = `SELECT * FROM ${tb_name} WHERE id = ${data.serial_no}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) { console.log(err); data = 0; }
            else {
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

const UpdateApproval = (flag, res_id) => {
    var sql = `UPDATE md_url SET approval_flag = '${flag}' WHERE restaurant_id = "${res_id}"`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Updated !!' };
            }
            resolve(data);
        })
    })
}

const F_Delete = (tb_name, whr) => {
    let sql = `DELETE FROM ${tb_name} ${whr}`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, lastId) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) }
            } else {
                data = { suc: 1, msg: 'Successfully Deleted !!' };
            }
            resolve(data);
        })
    })
}

module.exports = { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave, UpdateApproval, CheckData, F_Delete };