const mysql = require("mysql")

var query = (options,sql)=>{
    let dateStrings = true;
    const connection = mysql.createConnection({...options,dateStrings});
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
const db = {
    query
}
export default db