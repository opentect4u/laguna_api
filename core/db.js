const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'laguna_local_shop',
    password: 'Laguna#2021',
    database: 'laguna_local_shop'
});

db.getConnection((err, connection) => {
    if (err) console.log(err);
    connection.release();
    return;
})

module.exports = db;