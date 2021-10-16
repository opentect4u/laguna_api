const express = require('express');
const dateFormat = require('dateformat');
const { PreviewMenu, CheckMenu, MenuData } = require('../modules/MenuModule');
const { F_Select } = require('../modules/MenuSetupModule');
const MenuRouter = express.Router();

MenuRouter.get('/preview_menu', async (req, res) => {
    let res_id = req.query.id,
        str_time = req.query.st_time,
        end_time = req.query.end_time,
        menu_id = req.query.menu_id,
        date = 0;
    var data = await PreviewMenu(res_id, str_time, end_time, menu_id, date);
    // console.log(data);
    // res.setHeader('Content-Type', 'application/json');
    res.send(data);
    // res.send(data);
})

MenuRouter.get('/menu_data', async (req, res) => {
    var res_id = req.query.id,
        menu_active_flag = 'N',
        replace_menu_id = 0,
        st_time = '',
        end_time = '',
        reg_menu_flag = '',
        sql = '';
    var now = new Date();
    var data = {
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
        Saturday: 7,
        Sunday: 8,
    };
    var morning_st = '05:00:00',
        morning_end = '11:59:59',
        noon_st = '12:00:00',
        noon_end = '17:59:59';
    var breakfast_st = '',
        breakfast_end = '',
        lunch_st = '',
        lunch_end = '',
        dinner_st = '',
        dinner_end = '',
        brunch_st = '',
        brunch_end = '';
    var greet = '';
    var date = dateFormat(now, "dddd"),
        menu_date = data[date],
        now_date = dateFormat(now, 'yyyy-mm-dd');

    // GET USER TIMEZONE AND SET TIME AS LOCAL TIME ZONE //
    var date_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    var con_dt = await F_Select(date_sql);
    var zone = con_dt.msg[0].time_zone;
    // console.log({ zone });
    let loc_time = zone != '' ? new Date().toLocaleString('en-US', { timeZone: zone }) : new Date();
    let curr_time = dateFormat(loc_time, "HH:MM:ss");

    // CHECK SPECIAL MENU OPERATION //
    var dt = await (CheckSpecialMenu(res_id, menu_date));
    if (dt.res) {
        if (dt.special_dt.day_flag == 'E') {
            sql = `SELECT id, restaurant_id, menu_id, active_flag, regular_menu_flag, day_flag, month_day, menu_date, group_concat(DISTINCT regular_menu_id separator ',') as regular_menu_id, start_time, end_time 
            FROM td_special_date_time WHERE restaurant_id = ${res_id} AND month_day = ${menu_date}`;
            sql_dt = await F_Select(sql);
            if (sql_dt.msg.length > 0) {
                st_time = sql_dt.msg[0].start_time;
                end_time = sql_dt.msg[0].end_time;
                if (curr_time >= st_time && curr_time <= end_time) {
                    menu_active_flag = 'Y';
                    reg_menu_flag = sql_dt.msg[0].regular_menu_flag;
                    replace_menu_id = sql_dt.msg[0].regular_menu_id;
                } else {
                    menu_active_flag = 'N';
                    reg_menu_flag = '';
                    replace_menu_id = 0;
                }
            } else {
                menu_active_flag = 'N';
                reg_menu_flag = '';
                replace_menu_id = 0;
            }
        } else {
            sql = `SELECT id, restaurant_id, menu_id, active_flag, regular_menu_flag, day_flag, month_day, menu_date, group_concat(DISTINCT regular_menu_id separator ',') as regular_menu_id, start_time, end_time
            FROM td_special_date_time WHERE restaurant_id = ${res_id} AND menu_date = "${now_date}"`;
            sql_dt = await F_Select(sql);
            if (sql_dt.msg.length > 0) {
                st_time = sql_dt.msg[0].start_time;
                end_time = sql_dt.msg[0].end_time;
                if (curr_time >= st_time && curr_time <= end_time) {
                    menu_active_flag = 'Y';
                    reg_menu_flag = sql_dt.msg[0].regular_menu_flag;
                    replace_menu_id = sql_dt.msg[0].regular_menu_id;
                } else {
                    menu_active_flag = 'N';
                    reg_menu_flag = '';
                    replace_menu_id = 0;
                }
            } else {
                menu_active_flag = 'N';
                replace_menu_id = 0;
                reg_menu_flag = '';
                st_time = '';
                end_time = '';
            }
        }
    }
    // console.log({ menu_active_flag, replace_menu_id, reg_menu_flag });

    // GET START TIME AND END TIME WITH CURRENT MONTH_DAY //
    // let dt_sql = `SELECT * FROM td_date_time WHERE restaurant_id = "${res_id}" AND month_day = "${menu_date}"`;
    // console.log(sql);
    // var dt_data = await F_Select(dt_sql);
    // console.log(dt_data.msg);

    // SET START TIME AND END TIME WITH MENU ID //
    // for (let i = 0; i < dt_data.msg.length; i++) {
    //     if (dt_data.msg[i].menu_id == 1) {
    //         breakfast_st = dt_data.msg[i].start_time;
    //         breakfast_end = dt_data.msg[i].end_time;
    //     } else if (dt_data.msg[i].menu_id == 2) {
    //         lunch_st = dt_data.msg[i].start_time;
    //         lunch_end = dt_data.msg[i].end_time;
    //     } else if (dt_data.msg[i].menu_id == 3) {
    //         dinner_st = dt_data.msg[i].start_time;
    //         dinner_end = dt_data.msg[i].end_time;
    //     } else if (dt_data.msg[i].menu_id == 4) {
    //         brunch_st = dt_data.msg[i].start_time;
    //         brunch_end = dt_data.msg[i].end_time;
    //     }
    // }

    // breakfast_st = breakfast_st;
    // breakfast_end = breakfast_end;
    // lunch_st = lunch_st ? lunch_st : (breakfast_end ? breakfast_end : curr_time);
    // lunch_end = lunch_end ? lunch_end : (dinner_st ? dinner_st : '');
    // dinner_st = dinner_st ? dinner_st : (lunch_end ? lunch_end : curr_time);
    // dinner_end = dinner_end;
    // brunch_st = brunch_st;
    // brunch_end = brunch_end;
    //let curr_time = dateFormat(now, "HH:MM:ss");

    // CHECK CURRENT TIME WITH START TIME AND END TIME //
    if (curr_time >= morning_st && curr_time <= morning_end) {
        greet = 'Good Morning';
    } else if (curr_time >= noon_st && curr_time < noon_end) {
        greet = 'Good Afternoon';
    } else {
        greet = 'Good Evening';
    }

    // FETCH RESULT FROM MENUMODEL.JS MENUDATA FUNCTION //
    var result = await MenuData(res_id, st_time = curr_time, end_time = curr_time, menu_id = 0, menu_date, greet, menu_active_flag, replace_menu_id, reg_menu_flag);
    // console.log(result);
    res.send(result);
    //res.send({breakfast_st, breakfast_end, lunch_st, lunch_end, curr_time, dinner_st, dinner_end, greet})
})

const CheckSpecialMenu = async (res_id, date) => {
    var cunt_sql = `SELECT id, menu_id, active_flag, regular_menu_flag, day_flag FROM td_special_date_time WHERE restaurant_id = ${res_id} LIMIT 1`;
    var cunt_dt = await F_Select(cunt_sql);
    var special_dt = '',
        dt = '';
    return new Promise((resolve, reject) => {
        if (cunt_dt.msg.length > 0) {
            dt = cunt_dt.msg[0];
            if (dt.active_flag != 'N') {
                special_dt = { id: dt.id, menu_id: dt.menu_id, active_flag: dt.active_flag, regular_menu_flag: dt.regular_menu_flag, day_flag: dt.day_flag };
                res = true;
            } else {
                special_dt = '';
                res = false;
            }
        } else {
            special_dt = '';
            res = false;
        }
        resolve({ res, special_dt });
    })
}

MenuRouter.get('/check_menu', async (req, res) => {
    var res_id = req.query.id,
        st_time = req.query.st_time,
        end_time = req.query.end_time,
        menu_id = req.query.menu_id;
    var data = await CheckMenu(res_id, st_time, end_time, null, menu_id);
    res.send(data);
})


module.exports = { MenuRouter }