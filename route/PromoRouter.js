const express = require('express');
const { F_Select } = require('../modules/MenuSetupModule');
const { IntroSave, ConfEmailSave, PouUpSave, QuestionSave, MailingEmailSave, PromoImgSave, StatusSave } = require('../modules/PromoModule');
const PromoRouter = express.Router();

PromoRouter.get('/adm_promo_dt', async (req, res) => {
    let sql = `SELECT * FROM md_promotion_admin`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.get('/res_promo_dt', async (req, res) => {
    var res_id = req.query.id;
    let sql = `SELECT * FROM md_promotion_restaurant WHERE restaurant_id = ${res_id}`;
    var data = await F_Select(sql);
    res.send(data);
})

PromoRouter.post('/intro_save', async (req, res) => {
    var data = req.body;
    var dt = await IntroSave(data);
    res.send(dt);
})

PromoRouter.post('/conf_email_save', async (req, res) => {
    var data = req.body;
    var dt = await ConfEmailSave(data);
    res.send(dt);
})

PromoRouter.post('/pop_save', async (req, res) => {
    var data = req.body;
    var dt = await PouUpSave(data);
    res.send(dt);
})

PromoRouter.post('/qn_save', async (req, res) => {
    var data = req.body;
    var dt = await QuestionSave(data);
    res.send(dt);
})

PromoRouter.post('/mailing_email_save', async (req, res) => {
    var data = req.body;
    var dt = await MailingEmailSave(data);
    res.send(dt);
})

PromoRouter.post('/img_save', async (req, res) => {
    var data = req.body;
    var dt = await PromoImgSave(data);
    res.send(dt);
})

PromoRouter.post('/status_save', async (req, res) => {
    var data = req.body;
    var dt = await StatusSave(data);
    res.send(dt);
})

module.exports = { PromoRouter }