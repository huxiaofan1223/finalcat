<template>
  <div class="main" @click="clickParent">
      <div class="app-left">
        <div class="justify-center" style="margin:10px 0;">
          <el-button size="mini" type="primary" @click.stop="showConfigDialog">新增数据库</el-button>
        </div>
      <div class="justify-center" style="padding:100px 0;" v-if="$store.state.Db.dbList.length===0">
        暂无数据库
      </div>
      <template v-else>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :unique-opened="true">
          <el-submenu v-for="(db,index3) in $store.state.Db.dbList" :key="index3" :index="index3+''" @click.stop.native="(e)=>{getDbTree(db)}">
            <template slot="title">
              <span style="margin-left:-15px;">
                <i @click.stop="handleDelConfig(db)" class="el-icon-delete" style="font-size:13px;color:red;width:20px;margin-right:0;"></i>{{db.name}} 
                <font color="#999999" size="2">
                  {{db.host}}:{{db.port}}
                </font>
              </span>
            </template>
            <el-submenu v-for="(item,index) in dbTree" :key="index+''" :index="`${index3}-${index}`" @click.native="()=>{nowDatabase = item.Database}">
              <template slot="title">
                <span style="margin-left:-30px;">
                  <img src="../../assets/database.png" width="12px">
                  {{item.Database}}
                </span>
              </template>
              <el-menu-item v-for="(item2,index2) in item.children" :key="index2+''" :index="`${index3}-${index}-${index2}`" @click.native="(e)=>{chooseTable(item.Database,item2)}">
                <span style="margin-left:-40px;">
                  <img src="../../assets/table.png" width="10px">
                  {{item2}}
                </span>
              </el-menu-item>
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
            <span style="margin-right:20px;">当前连接地址：<font color="#66b1ff">{{chooseOptions.host===undefined?'无':chooseOptions.host}}</font></span>
            <span style="margin-right:20px;">当前连接数据库：<font color="#66b1ff">{{nowDatabase===''?'无':nowDatabase}}</font></span>
            <span style="margin-right:20px;">table：<font color="#66b1ff">{{nowTable===''?'无':nowTable}}</font></span>
            <span>共<font color="#66b1ff">{{this.tableData.length}}</font>条数据</span>
          </div>
          <el-button type="primary" size="small" @click="sendSql">执行</el-button>
        </div>
        <el-table ref="table" :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border>
          <template>
            <el-table-column label="操作" width="50px" v-if="tableData.length!==0&&canDelete">
              <template slot-scope="scope">
                <div style="display:inline-flex;padding:0 10px;">
                  <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="removeRow(scope.row)"></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column :min-width="`${item.name} ${item.COLUMN_TYPE}`.length*8" v-for="(item,index) in fields" :key="`${item.db}-${item.table}-${item.name}`">
              <template #header>
                {{fields[index].name}}
                <font color="#555555">{{fields[index].COLUMN_TYPE}}</font>
                <p style="font-size:12px;color:red;line-height:14px;">{{fields[index].COLUMN_COMMENT}}</p>
              </template>
              <template slot-scope="scope">
                  <div class="table-child single-row" :title="scope.row[item.name]===null?'NULL':scope.row[item.name]" :style="{'color':scope.row[item.name]===null?'#999999':''}" :contenteditable="canDelete" @click.stop="clickRow" @keypress.enter.prevent="(e)=>updateRow(e.target,item.name,JSON.stringify(e.target.innerHTML),item.type,scope.row)">{{scope.row[item.name]===null?'NULL':scope.row[item.name]}}</div>
              </template>
            </el-table-column>
          </template>
        </el-table>

        <div class="between" style="padding:10px;">
          <div>
            <el-button type="primary" size="small" @click="handleInsert">新增</el-button>
          </div>
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
        width="400px"
        :before-close="hideConfigDialog">
        <el-form :model="configForm" :rules="rules" ref="configForm" label-width="55px" class="demo-configForm" @submit.native.prevent @keypress.enter.native="submitConfig('configForm')">
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
          <el-button @click="hideConfigDialog" size="mini">取 消</el-button>
          <el-button type="primary" native-type="submit" @click="submitConfig('configForm')" size="mini" :loading="valideLoading">确 定</el-button>
        </span>
      </el-dialog>

      <!-- {{JSON.stringify(this.fields)}} -->
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
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
            port: "",
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
          },
          valideLoading:false,
          canDelete:false
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
      });
    },
    methods:{
      type2value(dataType){
        if(dataType.indexOf('int')>-1){
          return 0;
        } else {
          return ''
        }
      },
      async handleInsert(){
        let pri = null;
        const valueArr = this.fields.map(item=>{
          if(item.COLUMN_DEFAULT === null){
            if(item.IS_NULLABLE === 'YES'){
              return null;
            } else {
              if(item.COLUMN_KEY === 'PRI'){
                pri = item.COLUMN_NAME;
                return null;
              }
              return this.type2value(item.DATA_TYPE);
            }
          }
          return item.COLUMN_DEFAULT;
        })
        const valuesStr = JSON.stringify(valueArr);
        const length1 = valuesStr.length-1;
        const {nowDatabase,nowTable} = this;
        const values = valuesStr.substring(1,length1);
        const sql = `INSERT INTO ${nowDatabase}.${nowTable} VALUES (${values})`;
        const addRes = await this.resultSql(sql,true);
        this.$message.success('affectedRows Count:'+addRes.data.rows.affectedRows);
        const newObj = {};
        this.fields.forEach((item,index)=>{
          newObj[item.COLUMN_NAME] = valueArr[index];
        })
        if(pri){newObj[pri] = addRes.data.rows.insertId};
        if(addRes.data.rows.affectedRows === 1){
          this.tableData.push(newObj);
        }
        this.pageConfig.total = this.pageConfig.total+1;
      },
      equalsObj(obj1,obj2){
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      },
      async updateCanDelete(){
        let tableArr = Array.from(new Set(this.fields.map(item=>item.table)));
        let dbArr = Array.from(new Set(this.fields.map(item=>item.db)));
        let flag = this.fields.length !== 0 && this.fields[0].db !== "" && this.fields[0].table!=="" && dbArr.length === 1 && tableArr.length === 1;
        if(flag){
          if(this.nowDatabase !== dbArr[0] || this.nowTable !== tableArr[0]){
            this.nowDatabase = dbArr[0];
            this.nowTable = tableArr[0];
          }
        }
        await this.updateHasPrimaryKey();
        this.canDelete = flag && this.hasPrimaryKey;
      },
      async updateHasPrimaryKey(){
        const primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
        if(primaryKey!== null) {
          this.hasPrimaryKey = true;
        } else {
          this.hasPrimaryKey = false;
        }
      },
      async getFields(db,table){
        let sql = `select * from information_schema.COLUMNS where table_name = '${table}' and table_schema = '${db}';`;
        let res = await this.resultSql(sql);
        try{
          return res.data.rows;
        }catch(err){
          console.log('getFields error',err);
        }
      },
      async getFieldCommentType(){
        await this.updateCanDelete();
        let obj = {};
        for(let field of this.fields){
          let key = `${field.db}.${field.table}`;
          if(!obj.hasOwnProperty(key)){
            let t = await this.getFields(field.db,field.table);
            obj[key] = t;
          }
        }
        this.filterDetail2Field(obj);
      },
      filterDetail2Field(obj){
        const arr = [];
        for(let t in obj){
          for(let rowItem of obj[t]){
              this.fields.forEach(field=>{
                if(field.name === rowItem.COLUMN_NAME && field.db === rowItem.TABLE_SCHEMA && field.table === rowItem.TABLE_NAME){
                  const newField = {...field,...rowItem};
                  arr.push(newField)
                }
              })
          }
        }
        this.fields = arr;
        this.$forceUpdate();
      },
      showConfigDialog(){
        this.configDialogVisible = true;
        this.configForm.port = 3306;
      },
      handleDelConfig(config){
        this.$confirm('是否删除此连接？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          this.$store.dispatch('removeDbConfig',config);
          this.$message.success('操作成功');
        })
      },
      hideConfigDialog(){
        this.$refs['configForm'].resetFields();
        this.configForm =  {
          host: "",
          port: "",
          user: "",
          password: "",
          database: ""
        };
        this.configDialogVisible = false;
      },
      submitConfig(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.isConfigExist(this.configForm)){
              this.$message.error('配置已存在');
              return;
            }
            this.valideLoading = true;
            this.$store.dispatch('valideDbConfig',this.configForm).then(res=>{
              this.$store.dispatch('addDbConfig',this.configForm);
              this.$message.success("操作成功");
              this.configForm = {};
              this.configDialogVisible = false;
              this.valideLoading = false;
            }).catch(err=>{
              console.log(err);
              this.valideLoading = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async pageSelect(sql){
        this.monacoInstance.setValue(sql);
        let res = await this.resultSql(sql,true);
        if(res.data.hasOwnProperty("fields")){
          this.tableData = [];
          setTimeout(()=>{
            this.tableData = res.data.rows;
          },0)
          let equalFieldsArr = JSON.parse(JSON.stringify(this.fields));
          equalFieldsArr.forEach(item=>{
            delete item.COLUMN_COMMENT;
            delete item.COLUMN_TYPE;
          })
          if(!this.equalsObj(equalFieldsArr,res.data.fields)){
            this.fields = res.data.fields;
          }
          await this.getFieldCommentType();
        } else {
          this.$message.success(res.data.rows.message.replace("(",""));
        }
      },
      async handleSizeChange(val){
        this.pageConfig.pageSize = val;
        this.pageConfig.pageNum = 1;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        await this.pageSelect(sql);
      },
      async handleCurrentChange(val){
        this.pageConfig.pageNum = val;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        let sql = this.sql+` limit ${start},${this.pageConfig.pageSize}`;
        await this.pageSelect(sql);
      },
      clickParent(){
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
      clickRow(e){
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
      getDbTree(options){
        this.removeChooseClass();
        this.chooseOptions = JSON.parse(JSON.stringify(options));
        let data = options;
        this.$http.post('/dbtree',data).then(res=>{
          this.dbTree = res.data;
        })
      },
      async chooseTable(database,table){
        this.loading = true;
        this.nowTable = table;
        this.nowDatabase = database;
        let sql = `select * from ${this.nowTable}`;
        const limitSql = await this.preFixLimitSql(sql);
        await this.pageSelect(limitSql);
      },
      removeChooseClass(){
        this.rollBackSpan = null;
        let ss = $('.table-child') || [];
        for(let item of ss){
          item.classList.remove('choose-child');
          item.classList.add('single-row');
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
            this.pageConfig.total = this.pageConfig.total-1;
          }
          catch(err){
            console.log("remove_error",err);
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
          this.loading = false;
          return null;
        }
      },
      async sendSql(){
        let sql = this.monacoInstance.getValue();
        if(sql === ''){
          this.$message.error("请输入sql");
          return;
        }
        this.loading = true;
        const limitSql = await this.preFixLimitSql(sql);
        await this.pageSelect(limitSql);
      },
      async preFixLimitSql(sql){
        this.pageConfig.pageNum = 1;
        this.pageConfig.total = 0;
        this.sql = JSON.parse(JSON.stringify(sql));
        if(this.isLimitSql(sql)){
          this.hasLimit = false;
        } else {
          let total = await this.getTableCount(sql);
          this.pageConfig.total = total;
          if(this.pageConfig.pageSize<total){
              let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
              sql = sql +` limit ${start},${this.pageConfig.pageSize}`;
              this.hasLimit = true;
          } else {
            this.hasLimit = false;
          }
        }
        return sql;
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
        } else {
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
      },
      isConfigExist(config){
        let temp = JSON.parse(JSON.stringify(config));
        delete temp.name;
        return this.$store.state.Db.dbList.map(item=>{
          let tempItem = JSON.parse(JSON.stringify(item));
          delete tempItem.name;
          return JSON.stringify(tempItem);
        }).indexOf(JSON.stringify(temp)) !== -1;
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
    width:260px;
    overflow: auto;
    overflow-x:hidden;
    ::v-deep.el-menu-item{
      height:30px;
      line-height: 30px;
    }
    ::v-deep.el-submenu__title{
      height:30px;
      line-height: 30px;
    }
  }
  .app-right{
    height:100%;
    width:calc(100% - 260px);
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
    ::v-deep.el-table td .cell{
      padding-left:0;
      padding-right:0;
      line-height:18px;
    }
    ::v-deep.el-table th .cell{
      padding-left:0;
      padding-right:0;
      line-height:18px;
    }
    ::v-deep .el-table__body{
      padding-bottom:15px;
    }
    ::v-deep.el-table td{
      padding: 0!important;
    }
    ::v-deep.el-table th{
      padding: 0!important;
    }
    ::v-deep.el-table::before{
      height:0;
    }
    ::v-deep.el-table th>.cell{
      padding:8px 5px;
      font-weight: normal;
      color:#222222;
    }
  }
}
</style>