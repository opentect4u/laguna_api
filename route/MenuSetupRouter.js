const express = require('express');
const { BreakfastSave, MenuSave, LogoSave, AboutUsSave, NoticeSave, F_Select, MonthDateSave, SectionSave, ItemSave, ItemPriceSave, GenerateQr } = require('../modules/MenuSetupModule');
const MenuSetRouter = express.Router();

MenuSetRouter.post('/menu_setup', async (req, res) => {
    console.log({ body: req.body[0] });
    var data = await MenuSave(req.body[0]);
    res.send(data);
})

MenuSetRouter.post('/logo', async (req, res) => {
    console.log({ body: req.body });
    var data = await LogoSave(req.body);
    res.send(data);
})

MenuSetRouter.post('/aboutus', async (req, res) => {
    console.log({ body: req.body });
    var data = await AboutUsSave(req.body);
    res.send(data);
})

MenuSetRouter.post('/notice', async (req, res) => {
    console.log({ body: req.body });
    var data = await NoticeSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/menu_setup', async (req, res) => {
    let id = req.query.id;
    let sql = `SELECT b.logo_url, a.menu_id, a.cover_page_url, a.top_img_url, a.active_flag, c.menu_url
        FROM td_other_image a
        left JOIN td_logo b ON a.restaurant_id = b.restaurant_id
        left JOIN td_menu_image c ON a.restaurant_id = c.restaurant_id
        WHERE a.restaurant_id = "${id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/section_image', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let sql = `SELECT menu_id, sec_url FROM td_section_image_request WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}" ORDER BY id`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/date_time', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let sql = `SELECT restaurant_id, menu_id, month_day, start_time, end_time FROM td_date_time WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/date_time', async (req, res) => {
    console.log(req.body);
    var data = await MonthDateSave(req.body[0]);
    res.send(data);
})

MenuSetRouter.get('/aboutus', async (req, res) => {
    let res_id = req.query.id;
    let sql = `SELECT * FROM td_about WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/section', async (req, res) => {
    console.log(req.body);
    var data = await SectionSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/section', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let whr = menu_id > 0 ? `AND menu_id = "${menu_id}"` : ''
    let sql = `SELECT * FROM md_section WHERE restaurant_id = "${res_id}" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/items', async (req, res) => {
    console.log(req.body);
    var data = await ItemSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/items', async (req, res) => {
    let res_id = req.query.id;
    let menu_id = req.query.menu_id;
    let sec_id = req.query.sec_id;
    let whr = menu_id > 0 && sec_id > 0 ? `AND menu_id = "${menu_id}" AND section_id = "${sec_id}"` : ''
    let sql = `SELECT * FROM md_items WHERE restaurant_id = "${res_id}" ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/item_price', async (req, res) => {
    console.log(req.body);
    var data = await ItemPriceSave(req.body);
    res.send(data);
})

MenuSetRouter.get('/item_price', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_item_description WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/notice', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM td_menu_notice WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/res_details', async (req, res) => {
    var res_id = req.query.id;
    let whr = res_id > 0 ? `WHERE id = "${res_id}"` : '';
    let sql = `SELECT a.*, c.setup_fee, c.monthly_fee, d.approval_flag FROM td_contacts a
                LEFT JOIN td_order_items b ON a.id=b.restaurant_id
                LEFT JOIN md_package c ON b.package_id=c.pakage_name
                LEFT JOIN md_url d ON a.id=d.restaurant_id ${whr}`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.get('/get_url', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_url WHERE restaurant_id = "${res_id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

MenuSetRouter.post('/generate_qr', async (req, res) => {
    console.log(req.body);
    var data = await GenerateQr(req.body);
    res.send(data);
})

MenuSetRouter.get('/tes', (req, res) => {
    var b = new Array();
    var dt = {
        coverurl: 'asdsadasd',
        topurl: '123.com',
        MenuUrl: 'asdsad',
        SectionUrl: 'asdsa',
        restaurant_id: '55',
        menu_id: '3',
        break_check: 'Y',
        start_time: '22:11',
        end_time: '22:11',
        month_day: [
            { dt: 2 },
            { dt: 3 },
            { dt: 0 },
            { dt: 5 },
            { dt: 0 },
            { dt: 7 },
            { dt: 8 }
        ]
    }
    console.log(x);
    // console.log(dt.month_day.join(','));
})

module.exports = { MenuSetRouter };