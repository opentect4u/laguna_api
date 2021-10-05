const express = require('express');
const AdmZip = require('adm-zip');
const fs = require('fs');
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
    var sql = `SELECT a.menu_id, b.menu_description as menu_name, a.active_flag FROM td_other_image a, md_menu b WHERE a.menu_id=b.id AND a.restaurant_id = "${req.query.id}" AND a.active_flag="Y"`;
    var data = await F_Select(sql);
    res.send(data);
})

AdmRouter.get('/download_section', async (req, res) => {
    var res_id = req.query.id,
        menu_id = req.query.menu_id;
    let res_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let res_dtls = await F_Select(res_sql);
    var res_name = res_dtls.msg[0].restaurant_name,
        downloadFileName = res_name + '_' + menu_id + '_' + Date.now() + '.zip';
    const zip = new AdmZip();
    var sql = `SELECT * FROM td_section_image_request WHERE restaurant_id = "${res_id}" AND menu_id = "${menu_id}"`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(dt => {
                var path = "uploads/" + dt.sec_img;
                zip.addLocalFile(path);
                // console.log(path);
            })
            // const downloadFileName = `${req.query.id}.zip`;

            fs.writeFileSync(downloadFileName, zip.toBuffer());
            res.send(zip.toBuffer());
            // res.download(downloadFileName, (err) => {
            //     if (err) {
            //         console.log(err);
            //         res.send('Frror');
            //     }
            // })
        }
    })
})

AdmRouter.get('/download_cov', async (req, res) => {
    var res_id = req.query.id;
    let res_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let res_dtls = await F_Select(res_sql);
    var res_name = res_dtls.msg[0].restaurant_name,
        downloadFileName = res_name + '_' + Date.now() + '.zip';
    const zip = new AdmZip();
    var logo_sql = `SELECT * FROM td_logo WHERE restaurant_id = "${res_id}"`,
        logo_dt = await F_Select(logo_sql),
        logo_path = 'uploads/' + logo_dt.msg[0].logo_path;
    zip.addLocalFile(logo_path);
    var sql = `SELECT * FROM td_other_image WHERE restaurant_id = "${res_id}"`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(dt => {
                var cov_path = "uploads/" + dt.cover_page_img,
                    top_path = "uploads/" + dt.top_image_img;
                zip.addLocalFile(cov_path);
                zip.addLocalFile(top_path);
                // console.log(path);
            })
            // const downloadFileName = `${req.query.id}.zip`;

            fs.writeFileSync(downloadFileName, zip.toBuffer());
            res.send(zip.toBuffer());
            // res.download(downloadFileName, (err) => {
            //     if (err) {
            //         console.log(err);
            //         res.send('Frror');
            //     }
            // })
        }
    })
})

module.exports = { AdmRouter };