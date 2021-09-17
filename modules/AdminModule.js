const db = require('../core/db');
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
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_package (pakage_name, no_of_menu, special_menu, setup_fee, monthly_fee, pack_description, created_by, created_dt) VALUES ("${data.Serial_no}", "${data.Menu_number}", "${data.Special_Menu}", "${data.SetUp_Fee}", "${data.Monthly_Fee}", "${data.Description}", "Subham", "2021-09-15")`;
    } else {
        sql = `UPDATE md_package SET no_of_menu= "${data.Serial_no}", special_menu= "${data.Special_Menu}", setup_fee= "${data.SetUp_Fee}", monthly_fee= "${data.Monthly_Fee}", pack_description= "${data.Description}", modified_by= "Subham", modified_dt= "2021-09-15" WHERE pakage_name = ${data.Serial_no}`;
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
    var sql = '';
    if (check > 1) {
        sql = `INSERT INTO md_promo_calander (id, free_flag, price, created_by, created_dt) VALUES ("${data.serial_no}", "${data.free}", "${data.price}", "Subham", "2021-09-15")`;
    } else {
        sql = `UPDATE md_promo_calander SET free_flag= "${data.free}", price= "${data.price}", modified_by= "Subham", modified_dt= "2021-09-15" WHERE id = ${data.serial_no}`;
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
    if (check > 1) {
        sql = `INSERT INTO md_holder_cling (id, price, created_by, created_dt) VALUES ("${data.serial_no}", "${data.per_Holder_Price}", "Subham", "2021-09-15")`;
    } else {
        sql = `UPDATE md_holder_cling SET price= "${data.per_Holder_Price}", modified_by= "Subham", modified_dt= "2021-09-15" WHERE id = ${data.serial_no}`;
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

module.exports = { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave };