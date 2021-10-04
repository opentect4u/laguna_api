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
    var res_id = req.query.id;
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
    var st_time = '';
    var end_time = '';
    var greet = '';
    var date = dateFormat(now, "dddd"),
        menu_date = data[date];

    // GET USER TIMEZONE AND SET TIME AS LOCAL TIME ZONE //
    var date_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    var con_dt = await F_Select(date_sql);
    var zone = con_dt.msg[0].time_zone;
    // console.log({ zone });
    let loc_time = zone != '' ? new Date().toLocaleString('en-US', { timeZone: zone }) : new Date();
    let curr_time = dateFormat(loc_time, "HH:MM:ss");

    // GET START TIME AND END TIME WITH CURRENT MONTH_DAY //
    let sql = `SELECT * FROM td_date_time WHERE restaurant_id = "${res_id}" AND month_day = "${menu_date}"`;
    // console.log(sql);
    var dt_data = await F_Select(sql);
    console.log(dt_data.msg);

    // SET START TIME AND END TIME WITH MENU ID //
    for (let i = 0; i < dt_data.msg.length; i++) {
        if (dt_data.msg[i].menu_id == 1) {
            breakfast_st = dt_data.msg[i].start_time;
            breakfast_end = dt_data.msg[i].end_time;
        } else if (dt_data.msg[i].menu_id == 2) {
            lunch_st = dt_data.msg[i].start_time;
            lunch_end = dt_data.msg[i].end_time;
        } else if (dt_data.msg[i].menu_id == 3) {
            dinner_st = dt_data.msg[i].start_time;
            dinner_end = dt_data.msg[i].end_time;
        } else if (dt_data.msg[i].menu_id == 4) {
            brunch_st = dt_data.msg[i].start_time;
            brunch_end = dt_data.msg[i].end_time;
        }
    }

    breakfast_st = breakfast_st;
    breakfast_end = breakfast_end;
    lunch_st = lunch_st ? lunch_st : (breakfast_end ? breakfast_end : curr_time);
    lunch_end = lunch_end ? lunch_end : (dinner_st ? dinner_st : '');
    dinner_st = dinner_st ? dinner_st : (lunch_end ? lunch_end : curr_time);
    dinner_end = dinner_end;
    brunch_st = brunch_st;
    brunch_end = brunch_end;
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
    var result = await MenuData(res_id, st_time = curr_time, end_time = curr_time, menu_id = 0, menu_date, greet);
    console.log(result);
    res.send(result);
    //res.send({breakfast_st, breakfast_end, lunch_st, lunch_end, curr_time, dinner_st, dinner_end, greet})
})

MenuRouter.get('/check_menu', async (req, res) => {
    var res_id = req.query.id,
        st_time = req.query.st_time,
        end_time = req.query.end_time;
    var data = await CheckMenu(res_id, st_time, end_time);
    res.send(data);
})


module.exports = { MenuRouter }