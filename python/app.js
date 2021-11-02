const express = require('express')
const app = express()
const port = 3000
let db=require("./db")

app.get('/', (req, res) => {
  let sql = "show databases";
  const options = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "bytetest"
  }
  db.query(options,sql,(err,rows)=>{
    if(err){
      res.json({msg:"未知错误"})
    } else {
      // console.log(Object.prototype.toString.call(rows[0].createTime));
      res.json({data:rows})
    }
  })
  // res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})