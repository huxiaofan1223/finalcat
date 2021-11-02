// 创建数据库连接
const mysql = require("mysql")
const options = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "bytetest"
}

const query = (options,sql,callback)=>{
    const connection = mysql.createConnection(options);
    connection.connect((err) => {
        if (err) { 
            callback(err,[]);
         }
        else { 
            connection.query(sql, (err, rows) => {
                callback(err, rows);
            });
         }
    })
}

exports.query = query