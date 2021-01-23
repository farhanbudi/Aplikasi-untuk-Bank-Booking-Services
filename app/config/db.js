module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "brimo",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

// var mysql = require('mysql')

// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'brimo'
// })

// module.exports = conn;