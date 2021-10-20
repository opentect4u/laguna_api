const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');

const InsertCalender = async (data) => {
    var res = '',
        sql = '';
    var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    var chk_sql = `SELECT COUNT(id) as count_dt FROM td_calendar WHERE restaurant_id = ${data.res_id} AND event_date = "${data.event_date}"`;
    var chk_dt = await F_Select(chk_sql);
    if (chk_dt.msg[0].count_dt > 0) {
        sql = `UPDATE td_calendar SET event_name="${data.event_name}", event_time="${data.event_time}", event_title="${data.event_title}", tkt_url="${data.tkt_url}", description="${data.description}", modified_by="${data.user}", modified_dt="${datetime}"
        WHERE restaurant_id = ${data.res_id} AND event_date = "${data.event_date}"`;
    } else {
        sql = `INSERT INTO td_calendar (restaurant_id, event_date, event_name, event_time, event_title, tkt_url, description, created_by, created_dt) 
        VALUES (${data.res_id}, "${data.event_date}", "${data.event_name}", "${data.event_time}", "${data.event_title}", "${data.tkt_url}", "${data.description}", "${data.user}", "${datetime}")`;
    }
    return new Promise((resolve, reject) => {
        db.query(sql, (error, insertId) => {
            if (error) {
                console.log(error);
                res = { suc: 0, msg: JSON.stringify(error) };
            } else {
                res = { suc: 1, msg: "Success !!" }
            }
            resolve(res);
        })
    })
}

module.exports = { InsertCalender };