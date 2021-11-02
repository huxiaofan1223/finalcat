// 创建数据库连接
const mysql = require("mysql")

var query = (options,sql)=>{
    const connection = mysql.createConnection(options);
    return new Promise((resolve,reject)=>{
        connection.connect((err) => {
            if (err) { 
                reject(err);
             }
            else { 
                connection.query(sql, (err,rows,fields) => {
                    if(err){
                        reject(err);
                    } else {
                        resolve({err,rows,fields})
                    }
                });
             }
        })
    })
}
exports.query = query