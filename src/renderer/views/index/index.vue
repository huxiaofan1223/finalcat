<template>
  <div class="main" @click="parentClick">
      <div class="app-left">
        <div class="justify-center">
          数据库
        </div>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo">
        <el-submenu v-for="(item,index) in dbTree" :key="index+''" :index="index+''">
          <template slot="title">
            <i class="el-icon-setting" style="font-size:13px;"></i>
            <span>{{item.Database}}</span>
          </template>
          <el-menu-item v-for="(item2,index2) in item.children" :key="index2+''" :index="`${index}-${index2}`" @click.native="(e)=>{chooseTable(item.Database,item2)}">{{item2}}</el-menu-item>
        </el-submenu>
      </el-menu>
      </div>
      <div class="app-right">
        <div id="monaco">
        </div>
        <div class="padding10 between items-center">
          <div>
            <span style="margin-right:20px;">当前连接数据库：<font color="blue">{{nowDatabase===''?'无':nowDatabase}}</font></span>
            <span style="margin-right:20px;">当前连接表：<font color="blue">{{nowTable===''?'无':nowTable}}</font></span>
            <span>共<font color="blue">{{this.tableData.length}}</font>条数据</span>
          </div>
          <at-button type="primary" @click="sendSql">执行</at-button>
        </div>
        <el-table :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border v-if="canDelete">
          <el-table-column label="delete" width="70px">
            <template slot-scope="scope">
              <div style="display:inline-flex;padding:0 10px;">
                <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="removeRow(scope.row)"></el-button>
              </div>
            </template>
          </el-table-column>
          <template>
            <el-table-column :min-width="`150px`" v-for="(item,index) in tableNames" :key="index" :label="`${item.COLUMN_NAME} ${item.COLUMN_TYPE}`">
              <template slot-scope="scope">
                  <div class="table-child single-row" :title="scope.row[item.COLUMN_NAME]===null?'NULL':scope.row[item.COLUMN_NAME]" :style="{'color':scope.row[item.COLUMN_NAME]===null?'#999999':''}" :contenteditable="canDelete" @click.stop="notRow" @keydown.enter.prevent="(e)=>updateRow(e.target,item.COLUMN_NAME,JSON.stringify(e.target.innerHTML),item.type,scope.row)">{{scope.row[item.COLUMN_NAME]===null?'NULL':scope.row[item.COLUMN_NAME]}}</div>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <el-table :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border v-if="!canDelete">
          <template>
            <el-table-column :min-width="`150px`" v-for="(item,index) in fields" :key="index" :label="item.name">
              <template slot-scope="scope">
                  <div class="table-child single-row" :title="scope.row[item.name]===null?'NULL':scope.row[item.name]" :style="{'color':scope.row[item.name]===null?'#999999':''}" :contenteditable="canDelete" @click.stop="notRow" @keydown.enter.prevent="(e)=>updateRow(e.target,item.name,JSON.stringify(e.target.innerHTML),item.type,scope.row)">{{scope.row[item.name]===null?'NULL':scope.row[item.name]}}</div>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <div class="between" style="padding:10px;" v-if="hasLimit">
          <div></div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageConfig.pageNum"
            :page-sizes="[20, 30, 50, 100]"
            :page-size="pageConfig.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageConfig.total">
          </el-pagination>
        </div>
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
          rollBackSpan:null,
          tableNames:[],
          pageConfig:{
            pageNum:1,
            pageSize:20,
            total:0
          },
          hasLimit:false,
          sql:""
        }
    },
    computed:{
      canDelete(){
        let tableArr = Array.from(new Set(this.fields.map(item=>item.table)));
        let dbArr = Array.from(new Set(this.fields.map(item=>item.db)));
        return this.fields.length!==0 && this.fields[0].db!=="" && this.fields[0].table!==0 && dbArr.length === 1&& tableArr.length === 1;
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
      handleSizeChange(val){
        this.pageConfig.pageSize = val;
        this.pageConfig.pageNum = 1;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        this.monacoInstance.setValue(sql);
        this.sendSql();
      },
      handleCurrentChange(val){
        this.pageConfig.pageNum = val;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        this.monacoInstance.setValue(sql);
        this.sendSql();
      },
      parentClick(e){
        if(this.rollBackSpan!==null&&$('.choose-child')!==null){
          $('.choose-child').innerHTML = this.rollBackSpan;
          this.rollBackSpan = null;
        }
        let ss = $('.table-child');
        if(ss)
          for(let item of ss){
            item.classList.remove('choose-child');
            item.classList.add('single-row');
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
            item.classList.remove('choose-child');
            item.classList.add('single-row');
          }
          e.target.classList.add('choose-child');
          e.target.classList.remove('single-row');
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
      async chooseTable(database,table){
        this.nowTable = table;
        this.nowDatabase = database;
        let sql = `select * from ${this.nowDatabase}.${this.nowTable}`;
        this.sql = JSON.parse(JSON.stringify(sql));
        let rows = await this.getFields(database,table);
        this.tableNames = rows;
        let total = await this.getTableCount(sql);
        this.pageConfig.total = total;
        if(this.pageConfig.pageNum<total){
          if(sql.includes('limit')){
            this.hasLimit = false;
          } else {
            let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
            sql += ` limit ${start},${this.pageConfig.pageSize}`;
            this.hasLimit = true;
          }
        } else {
          this.hasLimit = false;
        }
        this.monacoInstance.setValue(sql);
        this.sendSql();
      },
      async removeRow(row){
        this.$confirm('是否删除此列？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try{
            let primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
            let sql = `delete from ${this.nowDatabase}.${this.nowTable} where ${primaryKey} = ${row[primaryKey]}`;
            let removeRes = await this.resultSql(sql);
            this.$message.success('affectedRows Count:'+removeRes.data.rows.affectedRows);
            if(removeRes.data.rows.affectedRows === 1){
              let index = this.tableData.map(item=>item[primaryKey]).indexOf(row[primaryKey]);
              this.tableData.splice(index,1);
            }
          }
          catch(err){
            console.log("remove_error");
          }
        }).catch(() => {});
      },
      async updateRow(target,key,value,type,row){
        try{
          let primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
          value = value.replace(/\"(.*)\"/,(all,mat)=>{return `'${mat}'`});

          let sql = `update ${this.nowDatabase}.${this.nowTable} set ${key} = ${value} where ${primaryKey} = ${row[primaryKey]}`;
          let updateRes = await this.resultSql(sql);
          if(!updateRes.data.hasOwnProperty("fields")){
            this.$message.success(updateRes.data.rows.message.replace("(",""));
            let ss = $('.table-child')
            for(let item of ss){
              item.classList.remove('choose-child');
              item.classList.add('single-row');
            }
          } else {
            console.log("update_success");
            this.rollBackSpan = null;
          }
        }
        catch(err){
          console.log("update_error");
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
        this.loading = true;
        let res = await this.$http.post('/sendsql',data);
        this.loading = false;
        try{
          return res;
        }catch(err){
          console.log('get_sqlResult_error',err);
          this.loading = false;
          return null;
        }
      },
      async sendSql(){
        let sql = this.monacoInstance.getValue();
        let res = await this.resultSql(sql);
        if(res.data.hasOwnProperty("fields")){
          this.tableData = [];
          setTimeout(() => {
            this.tableData = res.data.rows;
          }, 0);
          this.fields = res.data.fields;
        } else {
          this.$message.success(res.data.rows.message.replace("(",""));
        }
      },
      async getFields(db,table){
        let sql = `select * from information_schema.COLUMNS where table_name = '${table}' and table_schema = '${db}';`;
        let res = await this.resultSql(sql);
        return res.data.rows;
      },
      async getTableCount(sql){
        let type = sql.split(" ")[0].toLowerCase();
        let countSql =  `select count(*) as total from (${sql}) as t${new Date().getTime()}`;
        if(type === 'select'){
          countSql = sql.replace(/select (.*?) from/i,'select count(1) as total from');
          // countSql = sql.replace(/select (.*?) from/i,'select count(1) as total from').replace(/(.*)(limit.*)/i,(all,$1,$2,$3)=>{return $1});
        } else if(type==='delete'||type==='update'||type==='insert'){
          return 0;
        }
        let res = await this.resultSql(countSql);
        return res.data.rows[0].total;
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
    overflow-x:hidden;
    /deep/.el-menu-item{
      height:30px;
      line-height: 30px;
    }
    /deep/.el-submenu__title{
      height:30px;
      line-height: 30px;
    }
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
      border:1px solid transparent;
    }
    .single-row{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      outline: none;
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
      padding-bottom:15px;
    }
    /deep/.el-table td, .el-table th{
      padding: 0!important;
    }
    /deep/.el-table::before{
      height:0;
    }
    /deep/.el-table th>.cell{
      padding-left:5px;
      padding-right:5px;
    }
  }
}
</style>