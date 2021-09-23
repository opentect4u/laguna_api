const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');
const nodemailer = require('nodemailer');

const ConfirmMenu = async (res_id) => {
    let qr_sql = `SELECT * FROM md_url WHERE restaurant_id = "${res_id}"`;
    let qr = await F_Select(qr_sql);
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let parm_sql = `SELECT * FROM md_parm_value`;
    let param = await F_Select(parm_sql);
    var img = qr.msg[0].image,
        con_name = con.msg[0].contact_name,
        email = con.msg[0].email,
        pro_name = param.msg[0].param_value,
        email_name = param.msg[1].param_value;
    console.log({ pro_name, email_name, con_name });
    var data = await send_email(email, img, con_name, pro_name, email_name);
    return data;
    // console.log(qr.msg[0].image);
}

const send_email = async (email_id, img, con_name, pro_name, email_name) => {
    // const { email_id } = args;
    // var password = 'password';
    // const pass = bcrypt.hashSync(password, 10);
    // var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // var sql = `UPDATE md_users SET password = "${pass}", modified_by = "${email_id}", modified_dt = "${datetime}" WHERE user_id = "${email_id}"`;
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'synergicbbps@gmail.com',
                pass: 'Signature@123'
            }
        });

        var mailOptions = {
            from: 'support@synergicportal.in',
            to: 'sumanmitra0096@gmail.com', //email_id,
            subject: 'SynergicPortal',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
                + '<title>ShopLocal</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px;border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Hi ' + con_name + ',</h2>'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Congratulations</h2>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">We are pleased to confirm that we have completed the building of your Digital Menu!</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">There is now just one final step before it can golive..you must approve the Menu</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:22px; padding-bottom:15px; margin:0;">To do this please scan the QR Code below which will take you to the Menu. Go through the entire Menu and when you have finished click on the button blow to confirm your approval or reject it if there are any errors.</p>'
                + '<p style="padding-bottom:15px; margin:0;"><img src="https://eporiseva.com/' + img + '" width="128" height="128" alt=""></p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:400; line-height:19px; padding-bottom:15px; margin:0;"><strong>Your Sincerely</strong>,<br>'
                + email_name + '<br>'
                + pro_name + '</p>'
                + '<p style="font-family:Arial, Helvetica, sans-serif; padding-top:20px; padding-bottom:20px; margin:0;">'
                + '<a href="http://localhost:4200/confirmation/11" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
                + 'padding: 8px 15px; margin: 0; background: #3fb048; text-decoration: none; color: #fff; border-radius: 34px; width: 100%; display: inline-block; text-align: center; box-sizing: border-box;">Approve Menu</a>'
                + '</p></td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { success: 0, message: 'Mail Not Sent Successfully' };
            } else {
                console.log('Email sent: ' + info.response);
                data = { success: 1, message: 'Mail Sent Successfully' };
            }
        });

        resolve(data);
    })
}

const ApproveMenu = async (data) => {
    var res_id = data[0].res_id,
        apr_flag = data[0].apr_flag,
        menu_list = data[0].menu_id,
        desc = data[0].desc;
    if (apr_flag == 'U') {
        await SendAdminUnapproveMail(res_id, apr_flag, menu_list, desc);
    } else if (apr_flag == 'A') {
        var datetime = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        var sql = `UPDATE md_url SET approval_flag = "${apr_flag}", approved_by = "${res_id}", approved_date = "${datetime}" 
        WHERE restaurant_id = "${res_id}"`;
        // console.log(sql);
        return new Promise((resolve, reject) => {
            db.query(sql, (err, lastId) => {
                if (err) {
                    console.log(err);
                    data = { success: 0, message: JSON.stringify(err) };
                } else {
                    data = { success: 0, message: 'Success' };
                }
            })
        })
    }
}

const SendAdminUnapproveMail = async (res_id, apr_flag, menu_list, desc) => {
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let con_name = con.msg[0].contact_name;
    let res_name = con.msg[0].restaurant_name;
    let res_email = con.msg[0].email;
    var app_chk = apr_flag == "A" ? "checked" : "",
        unap_chk = apr_flag == "U" ? "checked" : "",
        brk_chk = menu_list[0].dt > 0 ? 'checked="checked"' : "",
        lun_chk = menu_list[1].dt > 0 ? 'checked="checked"' : "",
        din_chk = menu_list[2].dt > 0 ? 'checked="checked"' : "",
        bru_chk = menu_list[3].dt > 0 ? 'checked="checked"' : "";
    // spe_chk = menu_list[4].dt > 0 ? 'checked="checked"' : "";
    console.log({ ab: menu_list[0].dt, brk_chk, lun_chk, din_chk });
    return new Promise(async (resolve, reject) => {
        // FOR LOCAL
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'synergicbbps@gmail.com',
                pass: 'Signature@123'
            }
        });

        var mailOptions = {
            from: 'support@synergicportal.in',
            to: 'sumanmitra0096@gmail.com', //res_email,
            subject: 'SynergicPortal',
            html: '<!DOCTYPE html>'
                + '<html>'
                + '<head>'
                + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'
                + '<title>Untitled Document</title>'
                + '<style type="text/css">'
                + 'body{margin:0; padding:0; font-family:14px; font-family:Arial, Helvetica, sans-serif;}'
                + '</style>'
                + '</head>'
                + '<body>'
                + '<div class="sectionArea" style="max-width:750px; width:100%; margin:2% auto 2% auto; padding:15px; background:#faf9f9; border-radius:15px; border: #ececec solid 1px;">'
                + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
                + '<tr>'
                + '<td align="left" valign="top" class="logoArea" style="padding:0 0 25px 0; text-align:center;"><img src="https://eporiseva.com/sll_logo.png" width="402" height="300" alt="" style="max-width:190px; width:100%; height:auto; margin:0 auto;"></td>'
                + '</tr>'
                + '<tr>'
                + '<td align="left" valign="top">'
                + '<h2 style="font-size:18px; font-weight:700; font-family:Arial, Helvetica, sans-serif;">Digitial Restaurant Menu </h2>'
                + '<form action="" method="get" id="approval">  '
                + '<label for="rest">Restaurant Name:</label>'
                + '<input type="text" id="rest" name="rest" value="' + res_name + '" readonly style="height: 22px; padding: 5px; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #495057; background-color: #fff; background-clip: padding-box; border: 1px solid #ced4da; border-radius: .25rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; margin: 0 !important;"><br><br>'
                + '<label for="contact">Name of person:</label>'
                + '<input type="text" id="contact" name="contact" value="' + con_name + '" readonly style="height: 22px;padding: 5px;font-size: 1rem;font-weight: 400;line-height: 1.5;color: #495057;background-color: #fff;background-clip: padding-box;border: 1px solid #ced4da;border-radius: .25rem;transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;margin: 0 !important;"><br>'
                + '<br>Please signify your approval or request an update of the Menu:<br><br>'
                + '<input type="radio" id="html" name="fav_language" value="HTML" ' + app_chk + ' disabled>'
                + '<label for="html">I have reviewed my MENU platform, and I APPROVE</label><br><br>'
                + '<input type="radio" id="css" name="fav_language" value="CSS" ' + unap_chk + ' disabled>'
                + '<label for="javascript">I have checked my MENU Platform, and would like to request an update:</label><br><br>'
                + 'Which Menu/s require an update?<br><br>'
                + '<label class="container">Breakfast'
                + '<input type="checkbox" ' + brk_chk + ' disabled>'
                + '<span class="checkmark"></span>'
                + '</label>'
                + '<label class="container">Lunch'
                + '<input type="checkbox" ' + lun_chk + ' disabled>'
                + '<span class="checkmark"></span>'
                + '</label>'
                + '<label class="container">Dinner'
                + '<input type="checkbox" ' + din_chk + ' disabled>'
                + '<span class="checkmark"></span>'
                + '</label>'
                + '<label class="container">Brunch'
                + '<input type="checkbox" ' + bru_chk + ' disabled>'
                + '<span class="checkmark"></span>'
                + '</label>'
                // + '<label class="container">Specials'
                // + '<input type="checkbox" ' + spe_chk + ' disabled>'
                // + '<span class="checkmark"></span>'
                // + '</label>'
                + '<br><br>'
                + 'Please describe what requires updating for each Menu.<br> '
                + '<textarea rows="6" cols="60" maxlength="50" readonly style="height:120px; width: 100%;padding: .375rem .75rem;font-size: 1rem; box-sizing: border-box;font-weight: 400;line-height: 1.5;color: #495057;background-color: #fff;background-clip: padding-box;border: 1px solid #ced4da;border-radius: .25rem;transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;margin:15px 0 20px 0 !important;">' + desc + '</textarea>'
                + '</form>'
                + '</td>'
                + '</tr>'
                + '</table>'
                + '</div>'
                + '</body>'
                + '</html>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                data = { success: 0, message: 'Mail Not Sent Successfully' };
            } else {
                console.log('Email sent: ' + info.response);
                data = { success: 1, message: 'Mail Sent Successfully' };
            }
        });

        resolve(data);
    })
}

module.exports = { ConfirmMenu, ApproveMenu };