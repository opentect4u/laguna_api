const express = require('express');
const upload = require('express-fileupload')
const { F_Select } = require('../modules/MenuSetupModule');
const { SaveStockImg, DeleteStockImg, SaveSpecialMenuImg, SpecialMonthDateSave, SaveSpecialCatImg } = require('../modules/SpecialModule');
const SpecialRouter = express.Router();
const fs = require('fs');

SpecialRouter.use(upload());

SpecialRouter.get('/category_list', async (req, res) => {
    let sql = `SELECT * FROM md_special_category`;
    var data = await F_Select(sql);
    res.send(data);
})

SpecialRouter.get('/stock_img', async (req, res) => {
    var cat_id = req.query.cat_id;
    let whr = cat_id ? `WHERE img_catg = ${cat_id}` : '';
    let sql = `SELECT * FROM td_stock_image ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

SpecialRouter.post('/stock_img', async (req, res) => {
    var stock_file_name = '',
        cat_id = req.body.cat_id,
        id = req.body.id > 0 ? req.body.id : 0,
        data = '';
    if (req.body.stock_img) {
        var stock_buffer = req.body.stock_img;
        stock_file_name = req.body.stock_filename;

        // console.log(ext);
        var stock_buffer_dt = stock_buffer.replace(/^data:image\/png;base64,/, "");
        stock_buffer_dt += stock_buffer_dt.replace('+', ' ');
        let stock_binaer_dt = new Buffer(stock_buffer_dt, 'base64').toString('binary');
        fs.writeFile("uploads/stock/" + stock_file_name, stock_binaer_dt, "binary", async (err) => {
            if (err) console.log(err);
            else {
                data = await SaveStockImg(stock_file_name, cat_id, id)
                res.send(data);
                // await LogoSave(data, filename);
            }
        });
    } else {
        data = { suc: 0, msg: 'No Image Selected' };
        res.send(data);
    }
})

SpecialRouter.get('/del_stock_img', async (req, res) => {
    var id = req.query.id;
    var data = await DeleteStockImg(id);
    res.send(data);
})


SpecialRouter.post('/special_date_time', async (req, res) => {
    var data = await SpecialMonthDateSave(req.body);
    var cat_img = await SaveSpecialCatImg(req.body);
    res.send(data);
})

module.exports = { SpecialRouter };