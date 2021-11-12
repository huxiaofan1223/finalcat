<template>
  <div class="main" @click="parentClick">
      <div class="app-left">
        <div class="justify-center">
          数据库
        </div>
        <at-menu :active-name="1">
          <at-submenu v-for="(item,index) in dbTree" :key="index">
            <template slot="title"><i class="icon icon-life-buoy"></i>{{item.Database}}</template>
              <at-menu-item v-for="(item2,index2) in item.children" :key="index2" :name="`${index}-${index2}`" @click.native="(e)=>{chooseTable(item.Database,item2)}">{{item2}}</at-menu-item>
          </at-submenu>
        </at-menu>
      </div>
      <div class="app-right">
        <div id="monaco">
        </div>
        <div class="padding10 between items-center">
          <div>
            <span style="margin-right:20px;">当前连接数据库：<font color="blue">{{nowDatabase}}</font></span>
            <span>当前连接表：<font color="blue">{{nowTable}}</font></span>
          </div>
          <at-button type="primary" @click="sendSql">执行</at-button>
        </div>
        <el-table
          :data="tableData" style="overflow:auto;" v-loading="loading">
          <el-table-column :min-width="`150px`" v-for="(item,index) in fields" :key="index" :label="item.name+' '+getType(item.type)+'('+item.length+')'">
            <template slot-scope="scope">
                <div class="table-child single-row" :style="{'color':scope.row[item.name]===null?'#999999':''}" contenteditable="true" @click.stop="notRow" @keydown.enter.prevent="(e)=>submitUpdate(e.target,item.name,JSON.stringify(e.target.innerHTML),item.type,scope.row)">{{scope.row[item.name]===null?'NULL':scope.row[item.name]}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
import fieldsTypes from '../../utils/types'
export default {
    data(){
        return {
          monacoInstance:null,
          nowDatabase:"",
          nowTable:"",
          dbTree:"",
          tableData: [],
          fields:[],
          loading:false,
          rollBackSpan:null
        }
    },
    created(){
        window.$ = function(a){
          let arr = document.querySelectorAll(a);
          if(arr.length === 0){
            return null
          } else if(arr.length === 1){
            return arr[0]
          } else {
            return arr;
          }
        }
    },
    mounted(){
      this.monacoInstance = monaco.editor.create(document.getElementById("monaco"),{
          value:``,
          language:"sql",
          minimap:false
      });
      this.getDbTree();
    },
    methods:{
      parentClick(e){
        if(this.rollBackSpan!==null){
          $('.choose-child').innerHTML = this.rollBackSpan;
          this.rollBackSpan = null;
        }
        let ss = $('.table-child');
        if(ss)
          for(let item of ss){
            item.className = 'table-child single-row'
          }
      },
      notRow(e){
        if(this.rollBackSpan!==null && $('.choose-child') && e.target.className.indexOf('choose-child') === -1&&$('.choose-child').innerHTML!==this.rollBackSpan){
          $('.choose-child').innerHTML = this.rollBackSpan;
          this.rollBackSpan = null;
        } else {
          this.rollBackSpan = JSON.parse(JSON.stringify(e.target.innerHTML));
        }
        setTimeout(() => {
          let ss = $('.table-child')
          for(let item of ss){
            item.className = 'table-child single-row'
          }
          e.target.className="table-child choose-child";
        }, 0);
      },
      getType(type){
        return fieldsTypes[type].toLowerCase();
      },
      getDbTree(){
        this.$http.get('/dbtree').then(res=>{
          this.dbTree = res.data;
        })
      },
      chooseTable(database,table){
        this.nowTable = table;
        this.nowDatabase = database;
        let sql = `select * from ${this.nowDatabase}.${this.nowTable}`;
        this.monacoInstance.setValue(sql);
        this.sendSql();
      },
      async submitUpdate(target,key,value,type,row){
        try{
          let primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
          value = value.replace(/\"(.*)\"/,(all,mat)=>{return `'${mat}'`});

          let sql = `update ${this.nowDatabase}.${this.nowTable} set ${key} = ${value} where ${primaryKey} = ${row[primaryKey]}`;
          let updateRes = await this.resultSql(sql);
          if(!updateRes.data.hasOwnProperty("fields")){
            this.$message.success(updateRes.data.rows.message.replace("(",""));
            let ss = $('.table-child')
            for(let item of ss){
              item.className = 'table-child single-row'
            }
          } else {
            console.log("update_success");
            this.rollBackSpan = null;
          }
        }
        catch(err){
          console.log("update_error");
          // this.rollBackSpan = JSON.parse(JSON.stringify(row[key]));
        }
      },
      async getPrimaryKey(db,table){
        let sql = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE CONSTRAINT_SCHEMA = '${db}' and TABLE_NAME='${table}'`;
        let result = await this.resultSql(sql);
        try{
          return result.data.rows[0].COLUMN_NAME;
        }catch(err){
          console.log('get_primaryKey_error',err);
          return null;
        }
      },
      async resultSql(sql){
        let data = {
          sql
        }
        let res = await this.$http.post('/sendsql',data);
        try{
          return res;
        }catch(err){
          console.log('get_sqlResult_error',err);
          return null;
        }
      },
      sendSql(){
        let sql = this.monacoInstance.getValue();
        let data = {
          sql
        }
        this.loading = true;
        this.$http.post('/sendsql',data).then(res=>{
          if(res.data.hasOwnProperty("fields")){
            this.tableData = [];
            setTimeout(() => {
              this.tableData = res.data.rows;
            }, 0);
            this.fields = res.data.fields;
          } else {
            this.$message.success(res.data.rows.message.replace("(",""));
          }
          this.loading = false;
        }).catch(err=>{
          this.loading = false;
        })
      }
    }
}
</script>

<style scoped lang="scss">
.main{
  display: flex;
  height:100vh;
  width:100vw;
  overflow: hidden;
  .app-left{
    height:100%;
    width:240px;
    overflow: auto;
  }
  .app-right{
    height:100%;
    width:calc(100% - 240px);
    display: flex;
    flex-direction: column;
    #monaco{
      min-height:100px;
      border:1px solid #f7f7f7;
      padding:1rem 0;
    }
    .table-child{
      font-size:13px;
      padding:5px;
    }
    .single-row{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      outline: none;
      border:1px solid transparent;
      padding:5px;
    }
    .choose-child{
      outline: none;
      white-space: pre-line;
      background:white;
    }
    .choose-child:focus{
      border: 1px dashed #777777;
    }
    /deep/.el-table td .cell{
      padding-left:0;
      padding-right:0;
      line-height:18px;
    }
    /deep/ .el-table__body{
      padding-bottom:50px;
    }
    /deep/.el-table td, .el-table th{
      padding: 0!important;
    }
  }
}
</style>