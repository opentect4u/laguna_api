const express = require('express');
const { ConfirmMenu } = require('../modules/EmailModule');
const EmailRouter = express.Router();

EmailRouter.get('/approve_menu', async (req, res) => {
    let res_id = req.query.id;
    let email_id = req.query.email;
    var data = await ConfirmMenu(res_id, email_id);
    res.send(data);
})

module.exports = { EmailRouter }