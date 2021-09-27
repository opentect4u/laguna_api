const express = require('express');
const { PackageSave, GetPackageData, PromoSave, GetResult, HolderClingSave, UpdateApproval } = require('../modules/AdminModule');
const { F_Select } = require('../modules/MenuSetupModule');
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

AdmRouter.get('/update_approval', async (req, res) => {
    var data = await UpdateApproval(req.query.flag, req.query.res_id);
    res.send(data);
})

AdmRouter.get('/res_menu', async (req, res) => {
    var sql = `SELECT a.menu_id, b.menu_description as menu_name FROM td_other_image a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${req.query.id}"`;
    var data = await F_Select(sql);
    res.send(data);
})

module.exports = { AdmRouter };