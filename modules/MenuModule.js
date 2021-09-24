const db = require('../core/db');
var data = '';
const PreviewMenu = (res_id, st_time, end_time) => {
    var dat = new Array();
    let sec_sql = `SELECT a.id, a.section_id, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
    AND a.restaurant_id = "${res_id}"
    AND e.start_time >= '${st_time}'
    AND e.end_time < '${end_time}'
    GROUP BY c.id
    ORDER BY c.id`;
    return new Promise((resolve, reject) => {
        db.query(sec_sql, async (err, result) => {
            if (err) {
                console.log(err);
                data = { suc: 0, msg: JSON.stringify(err) };
            } else {
                for (let i = 0; i < result.length; i++) {
                    var res = await GetDataRes(result[i].section_id, res_id, st_time, end_time);
                    dat[result[i].section_name] = { res };
                    // console.log(dat);
                }
                // console.log(dat);
                data = { suc: 1, msg: 'Success', res: dat };
                // console.log({ dat });
            }
            // console.log(dat);
            resolve({ dat })
        })
    })

}

const Test = () => {
    dat = new Array();
    let sec_sql = `SELECT a.id, a.section_id, c.restaurant_id, c.section_name, e.start_time, e.end_time
    FROM md_item_description a, md_section c, td_date_time e
    WHERE a.section_id = c.id
    AND a.menu_id=e.menu_id
    AND a.restaurant_id = "5"
    AND e.start_time >= '08:00:00'
    AND e.end_time < '12:00:00'
    GROUP BY c.id
    ORDER BY c.id`;
    db.query(sec_sql, async (err, result) => {
        if (err) {
            console.log(err);
            data = { suc: 0, msg: JSON.stringify(err) };
        } else {
            for (let i = 0; i < result.length; i++) {
                var res = await GetDataRes(result[i].section_id, result[i].section_name);
                dat[result[i].section_name] = res;
                console.log(dat);
            }
            console.log({ dat });
            // result.forEach(async dt => {
            //     var res = await GetDataRes(dt.section_id, dt.section_name);
            //     dat[dt.section_name] = res;
            //     console.log({ a1: dat });
            //     // i = 0;
            //     // curr_sec_id = dt.section_id;
            //     // if (!dat.hasOwnProperty(dt.section_name)) {

            //     // dat[dt.section_name].push([i], { item_name: dt.item_name, item_price: dt.item_price, item_desc: dt.item_desc, item_note: dt.item_note });
            //     // }
            //     // pre_sec_id = dt.section_id;
            // })
            // console.log({ a2: data });
            // data = { suc: 1, msg: 'Success', res: result };
        }
    })

}

const GetDataRes = (sec_id, res_id, st_time, end_time) => {
    var sql = `SELECT a.id, a.section_id, b.item_name, a.item_price, a.item_desc, a.item_note, e.start_time, e.end_time
                FROM md_item_description a, md_items b, md_section c, md_menu d, td_date_time e
                WHERE a.item_id=b.id
                AND a.section_id = c.id
                AND a.menu_id = d.id
                AND a.menu_id=e.menu_id
                AND a.restaurant_id = "${res_id}"
                AND e.start_time >= '${st_time}'
                AND e.end_time < '${end_time}'
                AND a.section_id = "${sec_id}"
                GROUP BY a.id
                ORDER BY a.section_id`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            // dt[sec_name] = result;
            resolve(result);
            // dat[dt.section_name] = result;
            // console.log({ a1: dat });
        })
    })

}

module.exports = { PreviewMenu, Test };
