//Branch backend
// EXPORTING MODULES //
const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    db = require('./core/db'),
    cors = require("cors"),
    port = process.env.PORT || 3000;

// USING CORS //
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(express.static('uploads'));

// CALLING ROUTER MODULE FOLDER LOCATION //
const { RegRouter } = require('./route/RegistrationRoute');
const { AdmRouter } = require('./route/AdminRouter');
const { LogRouter } = require('./route/LoginRouter');
const { MenuSetRouter } = require('./route/MenuSetupRouter');
const { TestRouter } = require('./route/TestRoute');
const { EmailRouter } = require('./route/EmailRouter');
const { MenuRouter } = require('./route/MenuRouter');
const { SpecialRouter } = require('./route/SpecialRouter');
///////////////////////////////////////////

// REGISTRATION ROUTER RegistrationRouter.js FOLDER //
app.use(RegRouter);

// ADMIN ROUTER AdminRouter.js FOLDER //
app.use(AdmRouter);

// LOGIN ROUTER LoginRouter.js FOLDER //
app.use(LogRouter);

// MENU SETUP ROUTER LoginRouter.js FOLDER //
app.use(MenuSetRouter);

app.use(TestRouter);

app.use(EmailRouter);

app.use(MenuRouter);

app.use(SpecialRouter);


app.get('/', (req, res) => {
    // var date = ;
    var d = new Date().toLocaleTimeString({
        timeZone: 'America/Managua'
    })
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Tokyo'
    });
    console.log(req.header.host);
    res.send('Success')
})

// CREATE EXPRESS SERVER //
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`App is Running at PORT - ${port}`);
})