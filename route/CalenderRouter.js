const express = require('express');
const { F_Select } = require('../modules/MenuSetupModule');
const CalenderRouter = express.Router();

CalenderRouter.get('/calender_dtls', async (req, res) => {
    var res_id = req.query.id,
        sql = '',
        data = '';
    if (res_id > 0) {
        sql = `SELECT * FROM td_calender WHERE restaurant_id = ${res_id}`;
    } else {
        sql = `SELECT * FROM md_calender`;
    }
    data = await F_Select(sql);
    res.send(data);
})

CalenderRouter.get('/check_calender', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT restaurant_id, event_calendar FROM td_order_items WHERE  restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

module.exports = {CalenderRouter}
