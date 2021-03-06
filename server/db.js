const mysql = require("mysql")

let query = (options,sql)=>{
    const dateStrings = true;
    const multipleStatements = true;
    let connection = mysql.createConnection({...options,dateStrings,multipleStatements});
    return new Promise((resolve,reject)=>{
        connection.connect((err) => {
            if (err) { 
                reject(err);
            }
            else { 
                connection.query(sql, (err,rows,fields) => {
                    connection.end();
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
let test = (options)=>{
    let connection = mysql.createConnection(options);
    return new Promise((resolve,reject)=>{
        connection.connect((err) => {
            if(err){
                reject(err);
            } else {
                connection.end();
                resolve(true);
            }
        })
    })
}
const db = {
    query,test
}
export default db