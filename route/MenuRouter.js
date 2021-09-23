const express = require('express');
const { PreviewMenu, Test } = require('../modules/MenuModule');
const MenuRouter = express.Router();

MenuRouter.get('/preview_menu', async (req, res) => {
    let res_id = req.query.id,
        str_time = req.query.st_time,
        end_time = req.query.end_time;
    var data = await PreviewMenu(res_id, str_time, end_time);
    res.send(data);
})

MenuRouter.get('/test', async (req, res) => {
    await Test();
})

module.exports = { MenuRouter }