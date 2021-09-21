const express = require('express');
const { Login } = require('../modules/LoginModule');
const { F_Select } = require('../modules/MenuSetupModule');
const LogRouter = express.Router();

LogRouter.post('/login', async (req, res) => {
    var data = await Login(req.body);
    res.send(data);
})

LogRouter.get('/check_menu_setup', async (req, res) => {
    let res_id = req.query.id;
    var sql = `SELECT a.restaurant_id, a.email_id, a.pwd, b.restaurant_name, b.contact_name, b.phone_no,
            (SELECT group_concat(DISTINCT c.menu_id separator ',') FROM td_menu_image c WHERE a.restaurant_id=c.restaurant_id GROUP BY a.restaurant_id) as menu,
            (SELECT e.no_of_menu FROM td_order_items d JOIN md_package e ON d.package_id=e.pakage_name WHERE a.restaurant_id=d.restaurant_id GROUP BY a.restaurant_id) as menu_name
            FROM td_users a, td_contacts b
            WHERE a.restaurant_id=b.id AND a.restaurant_id = "${res_id}"`;
    var data = F_Select(sql);
    res.send(data);
})

module.exports = { LogRouter };