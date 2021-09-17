const express = require('express');
const { BreakfastSave } = require('../modules/MenuSetupModule');
const MenuSetRouter = express.Router();

MenuSetRouter.post('/breakfast', BreakfastSave)

module.exports = { MenuSetRouter };