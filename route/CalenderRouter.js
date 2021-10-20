const express = require('express');
const { InsertCalender } = require('../modules/CalenderModule');
const { F_Select } = require('../modules/MenuSetupModule');
const CalenderRouter = express.Router();

CalenderRouter.get('/calender_dtls', async (req, res) => {
    var res_id = req.query.id,
        sql = '',
        data = '';
    // if (res_id > 0) {
    sql = `SELECT * FROM td_calendar WHERE restaurant_id = ${res_id}`;
    // } else {
    //     sql = `SELECT * FROM md_calender`;
    // }
    data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/check_calender', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT restaurant_id, event_calendar FROM td_order_items WHERE  restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/get_res_dtls', async (req, res) => {
    var res_id = req.query.id;
    let whr = res_id > 0 ? `AND a.id = "${res_id}"` : '';
    let sql = `SELECT a.*, c.setup_fee, c.monthly_fee FROM td_contacts a
                JOIN td_order_items b ON a.id=b.restaurant_id
                JOIN md_package c ON b.package_id=c.pakage_name
                WHERE b.event_calendar = 'Y' ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.post('/calender_dtls', async (req, res) => {
    var data = req.body;
    var dt = await InsertCalender(data);
    res.send(dt);
})

module.exports = { CalenderRouter }