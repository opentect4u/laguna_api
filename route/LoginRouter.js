const express = require('express');
const { Login } = require('../modules/LoginModule');
const LogRouter = express.Router();

LogRouter.post('/login', async (req, res) => {
    var data = await Login(req.body);
    res.send(data);
})

module.exports = { LogRouter };