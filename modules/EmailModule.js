const db = require('../core/db');
const dateFormat = require('dateformat');
const { F_Select } = require('./MenuSetupModule');
const nodemailer = require('nodemailer');

const ConfirmMenu = async (res_id, email_id) => {
    let qr_sql = `SELECT * FROM md_url WHERE restaurant_id = "${res_id}"`;
    let qr = await F_Select(qr_sql);
    let con_sql = `SELECT * FROM td_contacts WHERE id = "${res_id}"`;
    let con = await F_Select(con_sql);
    let parm_sql = `SELECT * FROM md_parm_value`;
    let param = await F_Select(parm_sql);
    var img = qr.msg[0].image,
        con_name = con.msg[0].contact_name,
        pro_name = param.msg[0].param_value,
        email_name = param.msg[1].param_value;
    console.log({ pro_name, email_name, con_name });
    var data = await send_email(email_id, img, con_name, pro_name, email_name);
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
            to: email_id,
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
                + '<a href="#" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600;'
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

module.exports = { ConfirmMenu };