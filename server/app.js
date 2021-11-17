const express = require('express')
const app = express()
import db from './db'
const server = function(){
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.all("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
      res.send(200);
    else
      next();
  });
  const port = 3000
  async function getDbTree(options){
    try {
      let dbsql = "show databases";
      let {rows} = await db.query(options,dbsql);
      let tableSql = `
        SELECT 
        table_schema,table_name
        FROM
          information_schema.tables 
        WHERE table_type = 'base table' or table_type ='system view'
      `;
      let data = await db.query(options,tableSql);
      for(let i of rows){
        i.children = [];
        for(let j of data.rows){
          if(j.table_schema === i.Database){
            i.children.push(j.table_name);
          }
        }
      }
      return rows;
    } catch (error) {
      console.log(error);
    }
  }
  app.get('/', async(req, res) => {
    return "服务已启动";
  })
  app.post('/dbtree', async(req, res) => {
    try {
      let options = req.body;
      let data = await getDbTree(options);
      res.json({msg:"操作成功",data,code:200});
    } catch (msg) {
      res.json({msg,code:400});
    }
  })
  app.post('/sendsql', async(req, res) => {
    try {
      let sql = req.body.sql;
      let options = req.body.options;
      let data = await db.query(options,sql);
      res.json({msg:"操作成功",data,code:200});
    } catch (msg) {
      res.json({msg,code:400});
    }
  })
  app.post('/valideconfig', async(req, res) => {
    try {
      let option = req.body;
      let data = await db.test(option);
      res.json({msg:"操作成功",data,code:200});
    } catch (msg) {
      res.json({msg,code:400});
    }
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}
export default server