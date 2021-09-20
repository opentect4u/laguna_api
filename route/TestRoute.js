const express = require('express')
const upload = require('express-fileupload')
// const busboyBodyParser = require('busboy-body-parser')
const bodyparser = require('body-parser')
const cors = require('cors');
const fs = require('fs')
const TestRouter = express.Router();
const app = express();

app.use(cors())
app.use(upload())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))
// app.use(busboyBodyParser({ multi: true }));

var dir = 'public';
var subDir = "public/uploads";
app.use(express.static('public'));

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.mkdirSync(subDir);
}

TestRouter.post('/testing', (req, res) => {
    console.log({fi: req.files, dt: req.body, re: req});
})

module.exports = {TestRouter};