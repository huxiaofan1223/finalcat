<template>
  <div class="main" @click="parentClick">
      <div class="app-left">
        <div class="justify-center" style="margin:10px 0;">
          <el-button size="mini" type="primary" @click="addConfig">新增数据库</el-button>
        </div>
      <div class="justify-center" style="padding:100px 0;" v-if="$store.state.Db.dbList.length===0">
        暂无数据库
      </div>
      <template v-else>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :unique-opened="true">
          <el-submenu v-for="(db,index3) in $store.state.Db.dbList" :key="index3" :index="index3+''" @click.native="(e)=>{getDbTree(db)}">
            <template slot="title">
              <!-- <i class="el-icon-setting" style="font-size:13px;"></i> -->
              <span>{{db.name}}</span>
            </template>
            <el-submenu v-for="(item,index) in dbTree" :key="index+''" :index="`${index3}-${index}`" @click.native="()=>{nowDatabase = item.Database}">
              <template slot="title">
                <!-- <i class="el-icon-setting" style="font-size:13px;"></i> -->
                <span>{{item.Database}}</span>
              </template>
              <el-menu-item v-for="(item2,index2) in item.children" :key="index2+''" :index="`${index3}-${index}-${index2}`" @click.native="(e)=>{chooseTable(item.Database,item2)}">{{item2}}</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </template>
      </div>
      <div class="app-right">
        <div id="monaco">
        </div>
        <div class="padding10 between items-center">
          <div>
            <span style="margin-right:20px;">当前连接地址：<font color="blue">{{chooseOptions.host===undefined?'无':chooseOptions.host}}</font></span>
            <span style="margin-right:20px;">当前连接数据库：<font color="blue">{{nowDatabase===''?'无':nowDatabase}}</font></span>
            <span>共<font color="blue">{{this.tableData.length}}</font>条数据</span>
          </div>
          <el-button type="primary" size="small" @click="sendSql">执行</el-button>
        </div>
        <el-table :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border>
          <template v-if="canDelete">
            <el-table-column label="DEL" width="70px">
              <template slot-scope="scope">
                <div style="display:inline-flex;padding:0 10px;">
                  <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="removeRow(scope.row)"></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column :min-width="`${item.COLUMN_NAME} ${item.COLUMN_TYPE}`.length*8" v-for="(item,index) in tableNames" :key="index" :label="`${item.COLUMN_NAME} ${item.COLUMN_TYPE} ${item.COLUMN_COMMENT}`">
              <template slot="header">
                {{item.COLUMN_NAME}}
                <font color="#555555">{{item.COLUMN_TYPE}}</font>
                <p style="font-size:12px;color:red;line-height:14px;">{{item.COLUMN_COMMENT}}</p>
              </template>
              <template slot-scope="scope">
                  <div class="table-child single-row" :title="scope.row[item.COLUMN_NAME]===null?'NULL':scope.row[item.COLUMN_NAME]" :style="{'color':scope.row[item.COLUMN_NAME]===null?'#999999':''}" :contenteditable="canDelete" @click.stop="notRow" @keydown.enter.prevent="(e)=>updateRow(e.target,item.COLUMN_NAME,JSON.stringify(e.target.innerHTML),item.type,scope.row)">{{scope.row[item.COLUMN_NAME]===null?'NULL':scope.row[item.COLUMN_NAME]}}</div>
              </template>
            </el-table-column>
          </template>

          <template v-else>
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
            :page-sizes="[10,20, 30, 50, 100 ,200,500]"
            :page-size="pageConfig.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageConfig.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        title="添加配置"
        :visible.sync="configDialogVisible"
        width="400px">
        <el-form :model="configForm" :rules="rules" ref="configForm" label-width="55px" class="demo-configForm">
          <el-form-item label="名称" prop="name">
            <el-input size="small" v-model="configForm.name"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="14">
              <el-form-item label="地址" prop="host">
                <el-input size="small" v-model="configForm.host"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="端口" prop="port">
                <el-input size="small" v-model.number="configForm.port"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="账号" prop="user">
            <el-input size="small" v-model="configForm.user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input size="small" type="password" v-model="configForm.password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideConfig('configForm')" size="mini">取 消</el-button>
          <el-button type="primary" @click="submitConfig('configForm')" size="mini">确 定</el-button>
        </span>
      </el-dialog>
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
          sql:"",
          hasPrimaryKey:false,
          configForm: {
            host: "",
            port: 3306,
            user: "",
            password: "",
            database: ""
          },
          chooseOptions:{},
          configDialogVisible:false,
          rules: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' },
            ],
            host: [
              { required: true, message: '请输入地址', trigger: 'blur' },
            ],
            port: [
              { required: true, message: '请输入端口', trigger: 'blur' },
            ],
            user: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            ],
          }
        }
    },
    computed:{
      canDelete(){
        let tableArr = Array.from(new Set(this.fields.map(item=>item.table)));
        let dbArr = Array.from(new Set(this.fields.map(item=>item.db)));
        let flag = this.fields.length!==0 && this.fields[0].db!=="" && this.fields[0].table!==0 && dbArr.length === 1&& tableArr.length === 1;
        return flag && this.hasPrimaryKey;
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
    },
    methods:{
      addConfig(){
        this.configDialogVisible = true;
        this.configForm.port = 3306;
      },
      hideConfig(form){
        this.$refs[form].resetFields();
        this.configForm = {};
        this.configDialogVisible = false;
      },
      submitConfig(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.isConfigExist(this.configForm)){
              this.$message.error('配置已存在');
              return;
            }
            this.$store.dispatch('valideDbConfig',this.configForm).then(res=>{
              this.$store.dispatch('addDbConfig',this.configForm);
              this.$message.success("操作成功");
              this.configForm = {};
              this.configDialogVisible = false;
            }).catch(err=>{
              console.log(err);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      isConfigExist(config){
        let temp = JSON.parse(JSON.stringify(config));
        delete temp.name;
        return this.$store.state.Db.dbList.map(item=>{
          let tempItem = JSON.parse(JSON.stringify(item));
          delete tempItem.name;
          return JSON.stringify(tempItem);
        }).indexOf(JSON.stringify(temp)) !== -1;
      },
      async handleSizeChange(val){
        this.pageConfig.pageSize = val;
        this.pageConfig.pageNum = 1;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        this.monacoInstance.setValue(sql);
        let res = await this.resultSql(sql,true);
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
      async handleCurrentChange(val){
        this.pageConfig.pageNum = val;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        this.monacoInstance.setValue(sql);
        let res = await this.resultSql(sql,true);
        if(res.data.hasOwnProperty("fields")){
          this.tableData = [];
          this.fields = [];
          setTimeout(() => {
            this.tableData = res.data.rows;
            this.fields = res.data.fields;
          }, 0);
        } else {
          this.$message.success(res.data.rows.message.replace("(",""));
        }
      },
      parentClick(e){
        if(this.rollBackSpan!==null&&$('.choose-child')!==null){
          $('.choose-child').innerHTML = this.rollBackSpan;
          this.rollBackSpan = null;
        }
        let ss = $('.table-child');
        if(ss){
          if(Object.prototype.toString.call(ss) === '[object NodeList]'){
            for(let item of ss){
              item.classList.remove('choose-child');
              item.classList.add('single-row');
            }
          } else {
              ss.classList.remove('choose-child');
              ss.classList.add('single-row');
          }
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
      getDbTree(options){
        this.chooseOptions = JSON.parse(JSON.stringify(options));
        let data = options;
        this.$http.post('/dbtree',data).then(res=>{
          this.dbTree = res.data;
        })
      },
      async chooseTable(database,table){
        this.loading = true;
        this.pageConfig.pageNum = 1;
        this.nowTable = table;
        this.nowDatabase = database;
        let sql = `select * from ${this.nowTable}`;
        this.sql = JSON.parse(JSON.stringify(sql));
        const primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
        if(primaryKey!== null) {
          this.hasPrimaryKey = true;
        } else {
          this.hasPrimaryKey = false;
        }
        let rows = await this.getFields(database,table);
        if(this.isLimitSql(sql)){
          this.hasLimit = false;
        } else {
          let total = await this.getTableCount(sql);
          this.pageConfig.total = total;
          if(this.pageConfig.pageNum<total){
              let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
              sql = sql +` limit ${start},${this.pageConfig.pageSize}`;
              this.hasLimit = true;
          } else {
            this.hasLimit = false;
          }
        }
        this.monacoInstance.setValue(sql);
        let res = await this.resultSql(sql,true);
        if(res.data.hasOwnProperty("fields")){
          this.tableNames = [];
          this.tableData = [];
          this.fields = [];
          setTimeout(() => {
            this.tableNames = rows;
            this.tableData = res.data.rows;
            this.fields = res.data.fields;
          }, 0);
        } else {
          this.$message.success(res.data.rows.message.replace("(",""));
        }
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
      async resultSql(sql,loading){
        if(this.chooseOptions.host === undefined){
          this.$message.error('请选择连接');
          this.loading = false;
          return;
        }
        let {chooseOptions} = this;
        chooseOptions.database = this.nowDatabase;
        let data = {
          sql,
          options:chooseOptions
        }
        try{
          loading&& (this.loading = true);
          let res = await this.$http.post('/sendsql',data);
          loading&& (this.loading = false);
          return res;
        }catch(err){
          console.log('get_sqlResult_error',err);
          loading&& (this.loading = false);
          return null;
        }
      },
      async sendSql(){
        this.loading = true;
        this.pageConfig.pageNum = 1;
        this.pageConfig.total = 0;
        let sql = this.monacoInstance.getValue();
        if(this.isLimitSql(sql)){
          this.hasLimit = false;
        } else {
          this.sql = JSON.parse(JSON.stringify(sql));
          let total = await this.getTableCount(sql);
          this.pageConfig.total = total;
          if(this.pageConfig.pageNum<total){
              let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
              sql = sql +` limit ${start},${this.pageConfig.pageSize}`;
              this.monacoInstance.setValue(sql);
              this.hasLimit = true;
          } else {
            this.hasLimit = false;
          }
        }
        let res = await this.resultSql(sql,true);
        if(res.data.hasOwnProperty("fields")){
          this.tableData = [];
          this.fields = [];
          setTimeout(() => {
            this.tableData = res.data.rows;
            this.fields = res.data.fields;
          }, 0);
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
        let countSql =  `select count(1) as total from (${sql}) as t${new Date().getTime()}`;
        if(type === 'select'){
          if(!this.isCountSql(sql))
            countSql = sql.replace(/select (.*?) from/i,'select count(1) as total from');
          else{
            countSql = sql;
          }
        } else if(type==='delete'||type==='update'||type==='insert'||type==='explain'){
          return 0;
        } else if(type === 'show'||type==='explain'){
          return 0;
        }
        let res = await this.resultSql(countSql);
        return res.data.rows[0].total;
      },
      isLimitSql(sql){
        return /.*limit.*?\d+$/i.test(sql);
      },
      isCountSql(sql){
        return /^select count\(.*?\)((?!,).)*? from/i.test(sql);
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
    /deep/.el-table th .cell{
      padding-left:0;
      padding-right:0;
      line-height:18px;
    }
    /deep/ .el-table__body{
      padding-bottom:15px;
    }
    /deep/.el-table td{
      padding: 0!important;
    }
    /deep/.el-table th{
      padding: 0!important;
    }
    /deep/.el-table::before{
      height:0;
    }
    /deep/.el-table th>.cell{
      padding:8px 5px;
      font-weight: normal;
      color:#222222;
    }
  }
}
</style>