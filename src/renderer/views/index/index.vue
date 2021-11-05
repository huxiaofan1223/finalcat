<template>
  <div class="main">
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
          <el-table-column :min-width="`150px`" v-for="(item,index) in fields" :key="index" :label="item.name+'-'+getType(item.type)">
            <template slot-scope="scope">
                <div class="single-row" >
                  <font v-if="scope.row[item.name]===null">NULL</font>
                  <font v-else>{{scope.row[item.name]}}</font>
                </div>
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
          loading:false
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
      getType(type){
        return fieldsTypes[type];
      },
      tttt(row){
        console.log(JSON.stringify(row));
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
      sendSql(){
        let sql = this.monacoInstance.getValue();
        let data = {
          sql
        }
        this.loading = true;
        this.$http.post('/sendsql',data).then(res=>{
          if(res.data.hasOwnProperty("fields")){
            this.tableData = res.data.rows;
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
    .single-row{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-size:13px;
    }
    /deep/.el-table td, .el-table th{
      padding:5px 0;
    }
  }
}
</style>