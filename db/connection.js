const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Lauren93Aggie2015',
        database: 'company'
    },
    console.log ('Connected to the company database')
);

module.exports = db;