const express = require('express');
const { PreviewMenu, Test } = require('../modules/MenuModule');
const MenuRouter = express.Router();

MenuRouter.get('/preview_menu', async (req, res) => {
    let res_id = req.query.id,
        str_time = req.query.st_time,
        end_time = req.query.end_time;
    var data = await PreviewMenu(res_id, str_time, end_time);
    console.log(data);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    // res.send(data);
})

MenuRouter.get('/test', async (req, res) => {
    var filename = 'app.png';
    let file_ext = filename.split('.')[1]
    res.send(file_ext);
    // await Test();
})

module.exports = { MenuRouter }