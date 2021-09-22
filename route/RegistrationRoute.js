const express = require('express');
const { F_Select } = require('../modules/MenuSetupModule');
const { ResRegistration, EmailCheck, OrderSave, PaySave } = require('../modules/RegisterModule');
const RegRouter = express.Router();

RegRouter.post('/registration', async (req, res) => {
    const data = await ResRegistration(req.body);
    res.send(data);
})

RegRouter.get('/email_check', async (req, res) => {
    // console.log(req.query);
    const data = await EmailCheck(req.query);
    res.send(data);
})

RegRouter.post('/order', async (req, res) => {
    const data = await OrderSave(req.body);
    res.send(data);
})

RegRouter.post('/pay', async (req, res) => {
    const data = await PaySave(req.body);
    res.send(data);
})

RegRouter.get('/country', async (req, res) => {
    let sql = `SELECT * FROM md_country`;
    var data = await F_Select(sql);
    res.send(data);
})

module.exports = { RegRouter };