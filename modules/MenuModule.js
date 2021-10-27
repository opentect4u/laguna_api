const db = require('../core/db');
const { F_Select } = require('./MenuSetupModule');
var data = '';
const PreviewMenu = (res_id, st_time, end_time, menu_id, date, menu_date) => {
    var dat = {};
    var promo_sql = '',
        promo_dt = '';
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    let sec_sql = `SELECT a.id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time >= '${st_time}'
    AND e.end_time <= '${end_time}' ${whr_menu} ${whr_dt}
    GROUP BY c.id
    ORDER BY c.id`;
    // console.log(sec_sql);
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetDataRes(result[i].section_id, res_id, st_time, end_time, menu_id);
                    dat[result[i].section_name] = { res, sec_img: result[i].section_img };
                    // dat[result[i].section_name] = ;
                    // console.log(dat);
                }
                // console.log(dat);
                var promo_ckh = await CheckPromotion(res_id, menu_date, menu_id);
                if (promo_ckh == 'Y') {
                    promo_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
                    var promo_data = await F_Select(promo_sql);
                    promo_dt = promo_data.msg[0];
                } else {
                    promo_dt = '';
                }
                data = { suc: 1, msg: 'Success', res: dat, promo_flag: promo_ckh, promo_dt };
                // console.log({ dat });
            }
            // console.log(dat);
            resolve(data)
        })
    })

}

const GetDataRes = (sec_id, res_id, st_time, end_time, menu_id, date) => {
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    var sql = `SELECT a.id, a.section_id, b.item_name, a.item_price, a.item_desc, a.item_note, e.start_time, e.end_time
                FROM md_item_description a, md_items b, md_section c, md_menu d, td_date_time e
                WHERE a.item_id=b.id
                AND a.section_id = c.id
                AND a.menu_id = d.id
                AND a.menu_id=e.menu_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time <= '${st_time}'
                AND e.end_time >= '${end_time}'
                AND a.section_id = "${sec_id}" ${whr_menu} ${whr_dt}
                GROUP BY a.id
                ORDER BY a.section_id`;
    // console.log({ sql });
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // dt[sec_name] = result;
            resolve(result);
            // dat[dt.section_name] = result;
            // console.log({ a1: dat });
        })
    })

}

const CheckMenu = (res_id, st_time, end_time, date, menu_id) => {
    let menu_whr = menu_id ? `AND a.menu_id = "${menu_id}"` : '';
    let whr = date ? `AND e.month_day = "${date}"` : '';
    var sql = `SELECT a.menu_id, d.menu_description, e.start_time, e.end_time
                FROM md_item_description a, md_menu d, td_date_time e
                WHERE a.menu_id = d.id
                AND a.menu_id=e.menu_id AND a.restaurant_id=e.restaurant_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time <= '${st_time}'
                AND e.end_time >= '${end_time}' ${whr} ${menu_whr}
                GROUP BY a.menu_id
                ORDER BY a.menu_id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                data = { suc: 1, msg: result };
            }
            resolve(data);
        })
    })
}

const MenuData = (res_id, st_time, end_time, menu_id, date, greet, menu_active_flag, replace_menu_id, reg_menu_flag, sp_st_time, sp_end_time) => {
    var dat = {},
        sp_menu_sql = '',
        sp_menu = '',
        promo_sql = '',
        promo_dt = '';
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    let sec_sql = `SELECT a.id, a.menu_id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
	AND a.restaurant_id=e.restaurant_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time <= '${st_time}'
    AND e.end_time >= '${end_time}' ${whr_menu} ${whr_dt}
    GROUP BY c.id
    ORDER BY c.id`;
    console.log(sec_sql);
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetDataRes(result[i].section_id, res_id, st_time, end_time, menu_id);
                    dat[result[i].section_name] = { res, sec_img: result[i].section_img };
                    // dat[result[i].section_name] = ;
                    // console.log(dat);
                }
                var menu_id = result.length > 0 ? result[0].menu_id : 0;
                // console.log(dat);
                let oth_sql = `SELECT * FROM td_other_image WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
                let oth_data = await F_Select(oth_sql)
                let menu_check = await CheckMenu(res_id, st_time, end_time, date, null);
                let cov_img = oth_data.msg.length > 0 ? oth_data.msg[0].cover_page_img : '',
                    top_img = oth_data.msg.length > 0 ? oth_data.msg[0].top_image_img : '';
                if (menu_active_flag != 'N') {
                    sp_menu_sql = `SELECT a.*, b.name as cat_name FROM td_special_data a, md_special_category b WHERE a.img_catg=b.id AND a.restaurant_id = "${res_id}" AND a.menu_id = 5`;
                    let sp_menu_dt = await F_Select(sp_menu_sql);
                    sp_menu = sp_menu_dt.msg[0];
                    if (reg_menu_flag != 'E') {
                        menu_check.msg.push({ menu_id: 5, menu_description: 'Special Menu', start_time: sp_st_time, end_time: sp_end_time })
                    }
                } else {
                    sp_menu = '';
                }
                var promo_ckh = await CheckPromotion(res_id, date, menu_id);
                if (promo_ckh == 'Y') {
                    promo_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
                    var promo_data = await F_Select(promo_sql);
                    promo_dt = promo_data.msg[0];
                } else {
                    promo_dt = '';
                }
                // console.log(dat);
                data = { suc: 1, msg: 'Success', res: dat, cov_img: cov_img, top_img: top_img, menu_check: menu_check.msg, len: sec_sql, dt: oth_data, greet: greet, menu_active_flag, reg_menu_flag, sp_menu: sp_menu, promo_flag: promo_ckh, promo_dt };
            }
            // console.log(dat);
            resolve(data)
        })
    })
}

const CheckPromotion = async (res_id, date, menu_id) => {
    menu_id = menu_id > 0 ? menu_id : '';
    var promo_flag = 'N';
    var chk_sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id} AND status_id = '0'`;
    var chk_dt = await F_Select(chk_sql);

    if (chk_dt.msg.length > 0) {
        if (chk_dt.msg[0].menu_id == 0 && chk_dt.msg[0].month_day == 1) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == 0 && chk_dt.msg[0].month_day == date) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == menu_id && chk_dt.msg[0].month_day == 1) {
            promo_flag = 'Y';
        } else if (chk_dt.msg[0].menu_id == menu_id && chk_dt.msg[0].month_day == date) {
            promo_flag = 'Y';
        } else {
            promo_flag = 'N';
        }
    } else {
        promo_flag = 'N';
    }

    return new Promise((resolve, reject) => {
        resolve(promo_flag);
    })
}

module.exports = { PreviewMenu, CheckMenu, MenuData };