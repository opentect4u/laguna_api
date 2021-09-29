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
    // var breakfast_st = '08:00:00',
    //     breakfast_end = '10:59:00',
    //     lunch_st = '11:00:00',
    //     lunch_end = '15:59:00',
    //     dinner_st = '16:00:00',
    //     dinner_end = '24:00:00';
    var breakfast_st = '',
        breakfast_end = '',
        lunch_st = '',
        lunch_end = '',
        dinner_st = '',
        dinner_end = '';
    var date = dateFormat(now, "dddd"),
        menu_date = data[date];;
    let sql = `SELECT * FROM td_date_time WHERE restaurant_id = "${res_id}" AND month_day = "${menu_date}"`;
    // console.log(sql);
    var dt_data = await F_Select(sql);
    console.log(dt_data.msg);
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
            special_st = dt_data.msg[i].start_time;
            special_end = dt_data.msg[i].end_time;
        }
    }

    var st_time = '';
    var end_time = '';
    var greet = '';

    let curr_time = dateFormat(now, "HH:MM:ss");

    if (curr_time >= breakfast_st && curr_time < lunch_st) {
        st_time = breakfast_st;
        end_time = breakfast_end;
        greet = 'Good Morning';
    } else if (curr_time >= lunch_st && curr_time < dinner_st) {
        st_time = lunch_st;
        end_time = lunch_end;
        greet = 'Good Afternoon';
    } else {
        st_time = dinner_st;
        end_time = dinner_end;
        greet = 'Good Evening';
    }

    var result = await MenuData(res_id, st_time, end_time, menu_id = 0, menu_date);
    console.log(result);
    res.send(result);
})

MenuRouter.get('/check_menu', async (req, res) => {
    var res_id = req.query.id,
        st_time = req.query.st_time,
        end_time = req.query.end_time;
    var data = await CheckMenu(res_id, st_time, end_time);
    res.send(data);
})


module.exports = { MenuRouter }