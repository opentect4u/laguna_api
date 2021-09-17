const express = require('express');
const { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave } = require('../modules/AdminModule');
const AdmRouter = express.Router();

AdmRouter.post('/package', async (req, res) => {
    var data = await PackageSave(req.body);
    res.send(data);
});

AdmRouter.get('/package', async (req, res) => {
    var data = await GetPackageData(req.body);
    res.send(data);
})

AdmRouter.post('/promo', async (req, res) => {
    var data = await PromoSave(req.body);
    res.send(data);
})

AdmRouter.get('/promo', async (req, res) => {
    var data = await GetResult(tb_name = 'md_promo_calander');
    res.send(data)
})

AdmRouter.post('/holder_cling', async (req, res) => {
    var data = await HolderClingSave(req.body);
    res.send(data);
})

AdmRouter.get('/holder_cling', async (req, res) => {
    var data = await GetResult(tb_name = 'md_holder_cling');
    res.send(data);
})

module.exports = { AdmRouter };