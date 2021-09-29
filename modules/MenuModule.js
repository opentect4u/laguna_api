const db = require('../core/db');
const { F_Select } = require('./MenuSetupModule');
var data = '';
const PreviewMenu = (res_id, st_time, end_time, menu_id, date) => {
    var dat = {};
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
                // console.log(dat);
                data = { suc: 1, msg: 'Success', res: dat };
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
                AND e.start_time >= '${st_time}'
                AND e.end_time <= '${end_time}'
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

const CheckMenu = (res_id, st_time, end_time) => {
    var sql = `SELECT a.menu_id, d.menu_description, e.start_time, e.end_time
                FROM md_item_description a, md_menu d, td_date_time e
                WHERE a.menu_id = d.id
                AND a.menu_id=e.menu_id AND a.restaurant_id=e.restaurant_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time >= '${st_time}'
                AND e.end_time <= '${end_time}'
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

const MenuData = (res_id, st_time, end_time, menu_id, date) => {
    var dat = {};
    var whr_menu = menu_id > 0 ? `AND a.menu_id = "${menu_id}"` : '';
    var whr_dt = date > 0 ? `AND e.month_day = "${date}"` : '';
    let sec_sql = `SELECT a.id, a.menu_id, a.section_id, c.section_img, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time >= '${st_time}'
    AND e.end_time <= '${end_time}' ${whr_menu} ${whr_dt}
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
                console.log(dat);
                let oth_sql = `SELECT * FROM td_other_image WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
                let oth_data = await F_Select(oth_sql)
                let menu_check = await CheckMenu(res_id, st_time, end_time);
                let cov_img = oth_data.length > 0 ? oth_data.msg[0].cover_page_img : '',
                    top_img = oth_data.length > 0 ? oth_data.msg[0].top_image_img : ''
                // console.log(dat);
                data = { suc: 1, msg: 'Success', res: dat, cov_img: cov_img, top_img: top_img, menu_check: menu_check.msg };
                // let oth_sql = `SELECT * FROM td_other_image WHERE restaurant_id = "${res_id}" AND menu_id = "${result[0].menu_id}"`;
                // let oth_data = await F_Select(oth_sql)
                // let menu_check = await CheckMenu(res_id, st_time, end_time);
                // // console.log(dat);
                // data = { suc: 1, msg: 'Success', res: dat, cov_img: oth_data.msg[0].cover_page_img, top_img: oth_data.msg[0].top_image_img, menu_check: menu_check };
                // console.log({ dat });
            }
            // console.log(dat);
            resolve(data)
        })
    })

}

module.exports = { PreviewMenu, CheckMenu, MenuData };
