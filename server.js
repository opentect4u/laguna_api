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
app.use(express.urlencoded({ extended: true }));

// CALLING ROUTER MODULE FOLDER LOCATION //
const { RegRouter } = require('./route/RegistrationRoute');
const { AdmRouter } = require('./route/AdminRouter');
const { LogRouter } = require('./route/LoginRouter');
const { MenuSetRouter } = require('./route/MenuSetupRouter');
const { TestRouter } = require('./route/TestRoute');
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

// CREATE EXPRESS SERVER //
app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`App is Running at PORT - ${port}`);
})