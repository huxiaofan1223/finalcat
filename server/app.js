const express = require('express')
const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

const port = 3000
let db=require("./db")
const options = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "qinqingyyds",
  database: "mysql"
}
async function getDbTree(options){
  let dbsql = "show databases";
  let {rows} = await db.query(options,dbsql);
  tableSql = `
    SELECT 
    table_schema,table_name
    FROM
      information_schema.tables 
    WHERE table_type = 'base table' or table_type ='system view'
  `;
  let data = await db.query(options,tableSql);
  console.log(data.rows);
  for(let i of rows){
    i.children = [];
    for(let j of data.rows){
      if(j.table_schema === i.Database){
        i.children.push(j.table_name);
      }
    }
  }
  return rows;
}
app.get('/', async(req, res) => {
  try {
    let rows = await getDbTree(options);
    res.json({rows});
  } catch (msg) {
    res.json({msg});
  }
})
app.get('/dbtree', async(req, res) => {
  try {
    let data = await getDbTree(options);
    res.json({msg:"操作成功",data,code:200});
  } catch (msg) {
    res.json({msg,code:400});
  }
})
app.post('/sendsql', async(req, res) => {
  try {
    let sql = req.body.sql;
    let data = await db.query(options,sql);
    res.json({msg:"操作成功",data,code:200});
  } catch (msg) {
    res.json({msg,code:400});
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})