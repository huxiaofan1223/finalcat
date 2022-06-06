<template>
  <div class="main" @click="clickParent">
      <div class="app-left">
        <div class="justify-center" style="margin:10px 0;">
          <el-button size="mini" type="primary" @click.stop="showConfigDialog">新增连接</el-button>
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
            <el-submenu v-for="(item,index) in dbTree" :key="index+''" :index="`${index3}-${index}`" @click.stop.native="()=>{nowDatabase = item.Database}">
              <template slot="title">
                <span style="margin-left:-30px;display:block;" @contextmenu="(e)=>{contextmenu(e,item.Database,item.children)}">
                  <img src="../../assets/database.png" width="12px">
                  {{item.Database}}
                </span>
              </template>
              <el-menu-item v-for="(table,tableIndex) in item.children" :key="tableIndex+''" :index="`${index3}-${index}-${tableIndex}`" @click.stop.native="chooseTable(item.Database,table)">
                <span style="margin-left:-40px;display:block;" @contextmenu="(e)=>{contextmenuTable(e,item.Database,table)}">
                  <img src="../../assets/table.png" width="10px">
                  {{table}}
                </span>
              </el-menu-item>
            </el-submenu>
          <div class="center">
            <el-button size="mini" type="primary" @click="()=>{newDbConfigDialogVisible = true;}">new db</el-button>
          </div>
          </el-submenu>
        </el-menu>
      </template>
      </div>
      <div class="app-right">
        <div id="monaco">
        </div>
        <div class="padding10 between items-center">
          <div>
            <span style="margin-right:20px;">当前连接地址：<font color="#66b1ff">{{chooseOption.host===undefined?'无':chooseOption.host}}</font></span>
            <span style="margin-right:20px;">当前连接数据库：<font color="#66b1ff">{{nowDatabase===''?'无':nowDatabase}}</font></span>
            <span style="margin-right:20px;">table：<font color="#66b1ff">{{nowTable===''?'无':nowTable}}</font></span>
            <span>共<font color="#66b1ff">{{this.tableData.length}}</font>条数据</span>
          </div>
          <el-button type="primary" size="small" @click="handleSubmit">执行</el-button>
        </div>
        <el-table ref="table" :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border>
          <template>
            <el-table-column label="操作" width="50px" v-if="tableData.length!==0&&canDelete">
              <template slot-scope="scope">
                <div style="display:inline-flex;padding:0 10px;">
                  <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="handleRemove(scope.row)" style="padding:3px;"></el-button>
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
                  <div class="table-child single-row" :title="scope.row[item.name]===null?'NULL':scope.row[item.name]" :style="{'color':scope.row[item.name]===null?'#999999':''}" :contenteditable="canDelete" @click.stop="clickRow" @keypress.enter.prevent="(e)=>handleUpdate(item.name,e.target.innerHTML,scope.row)">{{scope.row[item.name]===null?'NULL':scope.row[item.name]}}</div>
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
        title="新增数据库"
        :visible.sync="newDbConfigDialogVisible"
        width="380px"
        :before-close="hideNewDbDialog">
        <el-form :model="newDbForm" :rules="newDbFormRules" ref="newDbForm" size="mini" label-width="80px" label-position="left" class="demo-configForm" @submit.native.prevent @keypress.enter.native="submitNewDbConfig('newDbForm')">
          <el-form-item label="数据库名" prop="name">
            <el-input size="mini" v-model="newDbForm.name" placeholder="数据库名"></el-input>
          </el-form-item>
          <el-form-item label="排序规则" prop="collateVal">
            <collate-select v-model="newDbForm.collateVal"></collate-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="hideNewDbDialog" size="mini">取 消</el-button>
          <el-button type="primary" native-type="submit" @click="submitNewDbConfig('newDbForm')" size="mini" :loading="valideLoading">确 定</el-button>
        </span>
      </el-dialog>


      <CreateOptionDialog
        ref="createOptionForm"
        :form.sync="createOptionForm"
        :visible.sync="configDialogVisible"
        @handleCreateOptionSubmit="handleCreateOptionSubmit"
        />
      <create-table-dialog 
        ref="createTableForm" 
        :form.sync="createTableForm" 
        :createTableDialogVisible.sync="createTableDialogVisible" 
        :createTableChooseDb="createTableChooseDb" 
        @handleCreateTableSubmit="handleCreateTableSubmit"
      ></create-table-dialog>
      <edit-table-dialog 
        ref="editTableForm" 
        :form.sync="editTableForm"
        :createTableDialogVisible.sync="editTableDialogVisible" 
        :createTableChooseDb="editTableChooseDb" 
        @handleDropColumn="handleDropColumn"
        @handleChangeColumn="handleChangeColumn"
        @handleModifyColumn="handleModifyColumn"
        @handleRenameTable="handleRenameTable"
      ></edit-table-dialog>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
import CollateSelect from '../components/CollateSelect';
import CreateTableDialog from './dialog/CreateTableDialog';
import EditTableDialog from './dialog/EditTableDialog';
import CreateOptionDialog from './dialog/CreateOptionDialog';
export default {
    components:{
      CollateSelect,
      EditTableDialog,
      CreateTableDialog,
      CreateOptionDialog
    },
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
          chooseOption:{},
          createOptionForm: {
            name: "",
            host: "",
            port: 3306,
            user: "",
            password: "",
            database: ""
          },
          configDialogVisible:false,
          valideLoading:false,
          canDelete:false,
          newDbConfigDialogVisible:false,
          newDbForm:{
            name:'',
            collateVal:'utf8mb4_general_ci',
          },
          newDbFormRules:{
            name: [
              { required: true, message: '请输入数据库名', trigger: 'blur' },
            ],
            collateVal: [
              { required: true, message: '请选择排序规则', trigger: 'change' },
            ]
          },
          createTableDialogVisible:false,
          createTableChooseDb:'',
          createTableForm:{
              tableName:'',
              fields:[
                  {
                      key:new Date().getTime(),
                      COLUMN_NAME:'',
                      DATA_TYPE:'int',
                      length:'',
                      COLUMN_DEFAULT:'',
                      COLLATION_NAME:'',
                      IS_NULLABLE:'NO',
                      EXTRA:'',
                      AI:false,
                      COLUMN_COMMENT:''
                  }
              ]
          },
          editTableDialogVisible:false,
          editTableChooseDb:'',
          editTableForm:{
              tableName:'',
              fields:[
                  {
                      key:new Date().getTime(),
                      COLUMN_NAME:'',
                      DATA_TYPE:'int',
                      length:'',
                      COLUMN_DEFAULT:'',
                      COLLATION_NAME:'',
                      IS_NULLABLE:'NO',
                      EXTRA:'',
                      AI:false,
                      COLUMN_COMMENT:''
                  }
              ]
          }
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
      async handleRenameTable(sql,db,oldTableName,newTableName){
        try{
          this.$refs.editTableForm.startLoading();
          await this.pageSelect(sql);
          this.editTableForm.tableName = newTableName;
          this.$refs.editTableForm.resetEditIndex();
          this.$refs.editTableForm.stopLoading();
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleModifyColumn(sql,db,table,index,toTop){
        try{
          this.$refs.editTableForm.startLoading();
          await this.pageSelect(sql);
          this.$refs.editTableForm.stopLoading();
          toTop?this.$refs.editTableForm.ColumnModifyToTop(index):this.$refs.editTableForm.ColumnModifyToBottom(index);
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleChangeColumn(sql){
        try{
          this.$refs.editTableForm.startLoading();
          await this.pageSelect(sql);
          this.$refs.editTableForm.stopLoading();
          this.$refs.editTableForm.resetEditIndex();
          this.editTableForm.fields.forEach(item=>item.insert=false);
          this.$forceUpdate();
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleDropColumn(sql,index){
        try{
          await this.pageSelect(sql);
          this.editTableForm.fields.splice(index,1);
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleCreateTableSubmit(sql){
        try{
          await this.pageSelect(sql);
          this.$refs.createTableForm.handleClose();
        } catch(err) {
          this.$refs.createTableForm.stopLoading();
        }
      },
      handleDelTable(val){
        this.$confirm('是否删除此表('+val+')？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const sql = `drop table ${val}`;
          await this.pageSelect(sql);
        })
      },
      async handleDelDb(val){
        this.$confirm('是否删除此数据库('+val+')？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const sql = `drop database ${val}`;
          await this.pageSelect(sql);
        })
      },
      // int(2)=>2
      columnType2Length(val){
        const mt = val.match(/.*\((\d+)\)/);
        if(mt!==null){
          return mt[1];
        } else {
          return '';
        }
      },
      async contextmenuTable(event,db,table){
        this.$contextmenu({
          items: [
            {
              icon: "el-icon-edit",
              label: "修改表结构",
              onClick: () => {
                    this.$refs.editTableForm.startLoading();
                    this.editTableDialogVisible = true;
                    const tableName = table;
                    this.editTableChooseDb = db;
                    setTimeout(()=>{
                      this.getFields(db,table).then(columns=>{
                        columns.forEach((field,index)=>{
                          field.key = index;
                          field.length = this.columnType2Length(field.COLUMN_TYPE);
                          if(field.EXTRA==='auto_increment')
                            field.AI=true;
                          else
                            field.AI=false;
                        })
                        const fields = columns.map(item=>{
                          const {key,COLUMN_NAME,DATA_TYPE,length,COLUMN_DEFAULT,COLLATION_NAME,IS_NULLABLE,EXTRA,AI,COLUMN_COMMENT} = item;
                          return {key,COLUMN_NAME,DATA_TYPE,length,COLUMN_DEFAULT,COLLATION_NAME,IS_NULLABLE,EXTRA,AI,COLUMN_COMMENT};
                        })
                        console.log(fields);
                        this.editTableForm = {tableName,fields};
                        this.$forceUpdate();
                        this.$refs.editTableForm.stopLoading();
                      }).catch(err=>{
                        console.log('getFieldsError',err);
                        this.$refs.editTableForm.stopLoading();
                      })
                    },100)
              }
            },
            {
              icon: "el-icon-delete",
              label: "删除表",
              onClick: () => {
                this.handleDelTable(table);
              }
            }
          ],
          event,
          customClass: "custom-class",
          zIndex: 3,
          minWidth:100
        });
        return false;
      },
      renameDatabaseName(oldName,newName){
        const sql = `
          CREATE DATABASE new_db_name;
          RENAME TABLE db_name.table1 TO new_db_name.table1,
          db_name.table2 TO new_db_name.table2;
          DROP DATABASE db_name;
        `
      },
      contextmenu(event,db,tables) {
        this.$contextmenu({
          items: [
            {
              icon: "el-icon-plus",
              label: "新建表",
              onClick: () => {
                this.createTableChooseDb = db;
                this.createTableDialogVisible = true;
              }
            },
            {
              icon: "el-icon-edit",
              label: "修改数据库",
              onClick: () => {
                
              }
            },
            {
              icon: "el-icon-delete",
              label: "删除数据库",
              onClick: () => {
                this.handleDelDb(db);
              }
            }
          ],
          event,
          customClass: "custom-class",
          zIndex: 3,
          minWidth:100
        });
        return false;
      },
      type2value(dataType){
        if(dataType.indexOf('int')>-1){
          return 0;
        } else{
          return '';
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
              if(item.DATA_TYPE === 'datetime') return '1999-02-06 05:00:00';
              return this.type2value(item.DATA_TYPE);
            }
          }
          return item.COLUMN_DEFAULT;
        })
        const valuesStr = JSON.stringify(valueArr);
        const length1 = valuesStr.length-1;
        const {nowDatabase,nowTable} = this;
        const values = valuesStr.substring(1,length1);
        const insertSql = `INSERT INTO ${nowDatabase}.${nowTable} VALUES (${values})`;
        const newSql = insertSql.replace(/,"CURRENT_TIMESTAMP"/g,',CURRENT_TIMESTAMP');
        const addRes = await this.resultSql(newSql);
        this.$message.success('affectedRows Count:'+addRes.data.rows.affectedRows);

        const newRowSql = `select * from ${nowDatabase}.${nowTable} where ${pri}=${addRes.data.rows.insertId}`;
        const newRowRes = await this.resultSql(newRowSql);

        if(addRes.data.rows.affectedRows === 1){
          const tempArr = this.deepClone(this.tableData);
          this.tableData = [];
          setTimeout(()=>{
            this.tableData = tempArr;
            this.tableData.unshift(newRowRes.data.rows[0]);
          },0)
          $('.el-table__body-wrapper').scrollTop = 0;
          this.pageConfig.total = this.pageConfig.total+1;
        }
      },
      equalsObj(obj1,obj2){
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      },
      async updateCanDelete(){
        let tableArr = Array.from(new Set(this.fields.map(item=>item.table)));
        let dbArr = Array.from(new Set(this.fields.map(item=>item.db)));
        let flag = this.fields.length !== 0 && this.fields[0].db !== "" && this.fields[0].table!=="" && dbArr.length === 1 && tableArr.length === 1;
        console.log('only one table bool',flag);
        if(flag){
          if(this.nowDatabase !== dbArr[0] || this.nowTable !== tableArr[0]){
            this.nowDatabase = dbArr[0];
            this.nowTable = tableArr[0];
          }
        }
        console.log(dbArr);
        console.log(tableArr);
        await this.updateHasPrimaryKey();
        this.canDelete = flag && this.hasPrimaryKey;
      },
      async updateHasPrimaryKey(){
        const primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
        console.log('updateHasPrimaryKey',primaryKey);
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
        console.log(obj);
        this.filterDetail2Field(obj);
      },
      filterDetail2Field(obj){
        const arr = this.deepClone(this.fields);
        for(let t in obj){
          for(let rowItem of obj[t]){
              arr.forEach((field,index)=>{
                if(field.name === rowItem.COLUMN_NAME && field.db === rowItem.TABLE_SCHEMA && field.table === rowItem.TABLE_NAME){
                  arr[index] = {...field,...rowItem};
                }
              })
          }
        }
        this.fields = arr;
        console.log('fields',this.fields);
        this.$forceUpdate();
      },
      showConfigDialog(){
        this.configDialogVisible = true;
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
      hideNewDbDialog(){
        this.$refs['newDbForm'].resetFields();
        this.newDbConfigDialogVisible = false;
      },
      async submitNewDbConfig(formName){
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            const {name,collateVal} = this.newDbForm;
            const sql = `create database ${name} collate ${collateVal}`;
            await this.pageSelect(sql);
            this.getDbTree(this.chooseOption);
            this.hideNewDbDialog();
          }
        });
      },
      handleCreateOptionSubmit(configForm){
          this.$store.dispatch('valideDbConfig',configForm).then(res=>{
            this.$store.dispatch('addDbConfig',configForm);
            this.$message.success("操作成功");
            this.$refs.createOptionForm.stopLoading();
            this.$refs.createOptionForm.handleClose();
          }).catch(err=>{
            this.$refs.createOptionForm.stopLoading();
          })
      },
      async pageSelect(sql){
        this.monacoInstance.setValue(sql);
        const type = this.getSqlType(sql);
        let res = await this.resultSql(sql,true);
        if(type !== 'select'){
          this.canDelete = false;
        }
        if(res.data.hasOwnProperty("fields")){
          console.log('tableData',res.data.rows);
          this.tableData = [];
          setTimeout(()=>{
            this.tableData = res.data.rows;
          },0)
          let equalFieldsArr = this.deepClone(this.fields);
          equalFieldsArr.forEach(item=>{
            delete item.COLUMN_COMMENT;
            delete item.COLUMN_TYPE;
          })
          if(!this.equalsObj(equalFieldsArr,res.data.fields)){
            this.fields = res.data.fields;
          }
          if(type === 'select')
          await this.getFieldCommentType();
        } else {
          if(type === 'drop' || type === 'create' || type === 'alter'){
            const option = {...this.chooseOption};
            option.database = '';
            this.getDbTree(option);
          }
          if(res.data.rows.message===''){this.$message.success('操作成功');}
          else {this.$message.success(res.data.rows.message.replace("(",""));}
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
          this.rollBackSpan = e.target.innerHTML;
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
        console.log('dbtreeOption',options);
        this.removeChooseClass();
        this.chooseOption = this.deepClone(options);
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
      async handleRemove(row){
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
              const tempArr = this.deepClone(this.tableData);
              this.tableData = [];
              setTimeout(()=>{
                this.tableData = tempArr;
                this.tableData.splice(index,1);
              },0)
            }
            this.pageConfig.total = this.pageConfig.total-1;
          }
          catch(err){
            console.log("remove_error",err);
          }
        }).catch(() => {});
      },
      async handleUpdate(key,value,row){
        try{
          let primaryKey = await this.getPrimaryKey(this.nowDatabase,this.nowTable);
          let sql = `update ${this.nowDatabase}.${this.nowTable} set ${key} = '${value}' where ${primaryKey} = ${row[primaryKey]}`;
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
          console.log('get_primaryKey_error');
          return null;
        }
      },
      async resultSql(sql,loading){
        if(this.chooseOption.host === undefined){
          this.$message.error('请选择连接');
          this.loading = false;
          return;
        }
        let {chooseOption} = this;
        chooseOption.database = this.nowDatabase;
        let data = {
          sql,
          options:chooseOption
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
      async handleSubmit(){
        let sql = this.monacoInstance.getValue();
        if(sql === ''){
          this.$message.error("请输入sql");
          return;
        }
        if(this.chooseOption.host === undefined){
          this.$message.error('请选择连接');
          return;
        }
        this.loading = true;
        let limitSql = sql;
        if(this.getSqlType(sql) === 'select'){
          limitSql = await this.preFixLimitSql(sql);
        }
        await this.pageSelect(limitSql);
      },
      getSqlType(sql){
        const type = sql.split(" ")[0].toLowerCase();
        return type;
      },
      async preFixLimitSql(sql){
        this.pageConfig.pageNum = 1;
        this.pageConfig.total = 0;
        this.sql = this.deepClone(sql);
        if(this.isLimitSql(sql)){
          this.hasLimit = false;
        } else {
          let total = await this.getSqlRowCount(sql);
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
      async getSqlRowCount(sql){
        let type = sql.split(" ")[0].toLowerCase();
        let countSql =  `select count(1) as total from (${sql}) as t${new Date().getTime()}`;
        if(type === 'select'){
          // if(!this.isCountSql(sql))
          //   countSql = sql.replace(/select (.*?) from/i,'select count(1) as total from');
          // else{
          //   countSql = sql;
          // }
          if(sql.indexOf(';')>-1){
            return 0;
          }
          if(this.isCountSql(sql))
            countSql = sql;
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
    ::v-deep.el-menu{
      border-right:none;
    }
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