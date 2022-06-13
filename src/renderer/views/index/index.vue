<template>
  <div class="main">
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
          <el-submenu v-for="(option,index3) in $store.state.Db.dbList" :key="index3" :index="index3+''" @click.stop.native="(e)=>{getDbTree(option)}">
            <template slot="title">
              <span style="margin-left:-15px;display:block;" @contextmenu="(e)=>{handleContextOption(e,option,index3)}">
                <i class="el-icon-menu" style="font-size:13px;width:20px;margin-right:0;"></i>
                {{option.name}} 
                <font color="#999999" size="2">
                  {{option.host}}:{{option.port}}
                </font>
              </span>
            </template>
            <el-submenu v-for="(item,index) in dbTree" :key="index+''" :index="`${index3}-${index}`" @click.stop.native="chooseDatabase(item.Database)">
              <template slot="title">
                <span style="margin-left:-30px;display:block;" @contextmenu="(e)=>{contextmenuDatabase(e,option,item.Database,item.children)}">
                  <img src="../../assets/database.png" width="12px">
                  {{item.Database}}
                </span>
              </template>

              <div v-if="item.children.length===0" class="center" style="padding:5px 0;">
                empty
              </div>
              <template v-else>
                <el-menu-item v-for="(table,tableIndex) in item.children" :key="tableIndex+''" :index="`${index3}-${index}-${tableIndex}`" @click.stop.native="chooseTable(item.Database,table)">
                  <span style="margin-left:-40px;display:block;" @contextmenu="(e)=>{contextmenuTable(e,item.Database,table)}">
                    <img src="../../assets/table.png" width="10px">
                    {{table}}
                  </span>
                </el-menu-item>
              </template>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </template>
      </div>
      <div class="app-right">
        <monaco-sql-editor v-model="sql"></monaco-sql-editor>
        <div class="padding10 between items-center">
          <div>
            <span style="margin-right:20px;">当前连接地址：<font color="#66b1ff">{{chooseOption.host===undefined?'无':chooseOption.host}}</font></span>
            <span style="margin-right:20px;">当前连接数据库：<font color="#66b1ff">{{nowDatabase===''?'无':nowDatabase}}</font></span>
            <span style="margin-right:20px;">table：<font color="#66b1ff">{{nowTable===''?'无':nowTable}}</font></span>
            <span>共<font color="#66b1ff">{{this.tableData.length}}</font>条数据</span>
          </div>
          <el-button type="primary" size="small" @click="handleSubmit">执行</el-button>
        </div>
        <el-table ref="table" :data="tableData" style="overflow:auto;" height="0" v-loading="loading" border element-loading-text="loading...">
          <template>
            <el-table-column label="操作" width="50px" v-if="tableData.length!==0&&canDelete">
              <template slot-scope="scope">
                <div style="display:inline-flex;padding:0 10px;">
                  <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="handleRemove(scope.row)" style="padding:3px;"></el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column :min-width="formatMinwidth(item)" v-for="(item,index) in fields" :key="`${item.db}-${item.table}-${item.name}`">
              <template #header>
                {{fields[index].name}}
                <font color="#555555">{{fields[index].COLUMN_TYPE}}</font>
                <p style="font-size:12px;color:red;line-height:14px;">{{fields[index].COLUMN_COMMENT}}</p>
              </template>
              <template slot-scope="scope"><div class="table-child" :contenteditable="canDelete?'plaintext-only':''" v-html="scope.row[item.name]" @blur="(e)=>{handleUpdate(item.name,e.target.innerHTML,scope.row)}"></div></template>
            </el-table-column>
          </template>
        </el-table>

        <div class="between" style="padding:10px;">
          <div>
            <el-button type="primary" size="small" @click="handleInsert" v-if="canDelete">新增</el-button>
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

      <CreateOptionDialog
        ref="createOptionForm"
        :form.sync="createOptionForm"
        :visible.sync="createOptionVisible"
        @handleCreateOptionSubmit="handleCreateOptionSubmit"
      />
      <CreateDatabaseDialog
        ref="createDatabaseForm"
        :form.sync="createDatabaseForm"
        :visible.sync="createDatabaseVisible"
        @handleCreateDatabaseSubmit="handleCreateDatabaseSubmit"
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
      <input id="fileElem" type="file" style="display: none;" @change="handleFileChange">
  </div>
</template>

<script>
import CreateTableDialog from './dialog/CreateTableDialog';
import EditTableDialog from './dialog/EditTableDialog';
import CreateOptionDialog from './dialog/CreateOptionDialog';
import CreateDatabaseDialog from './dialog/CreateDatabaseDialog';
import mysqldump from 'mysqldump';
import MonacoSqlEditor from './MonacoSqlEditor'
let bacDatabse = {};
export default {
    components:{
      EditTableDialog,
      CreateTableDialog,
      CreateOptionDialog,
      CreateDatabaseDialog,
      MonacoSqlEditor
    },
    data(){
        return {
          nowDatabase:"",
          nowTable:"",
          dbTree:[],
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
          editOptionIndex:'',
          createOptionVisible:false,
          valideLoading:false,
          canDelete:false,
          createDatabaseVisible:false,
          createDatabaseForm:{
            name:'',
            charset:'',
            collateVal:'utf8mb4_general_ci',
          },
          createTableDialogVisible:false,
          createTableChooseDb:'',
          createTableForm:{
              tableName:'',
              comment:'',
              charset:'',
              collateVal:'',
              engine:'MyISAM',
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
              comment:'',
              charset:'',
              collateVal:'',
              engine:'MyISAM',
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
    methods:{
      formatMinwidth(item){
        const {name,COLUMN_TYPE} = item;
        return `${(name+COLUMN_TYPE).length*10}px`;
      },
      async handleRenameTable(sql,db,oldTableName,newTableName){
        try{
          this.$refs.editTableForm.startLoading();
          await this.pageSelect(sql);
          this.editTableForm.tableName = newTableName;
          this.$refs.editTableForm.resetEditIndex();
          this.$refs.editTableForm.stopLoading();
          this.$nextTick(()=>{
            this.$refs.editTableForm.setBacConfig();
          })
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleModifyColumn(sql,db,table,index,targetIndex){
        try{
          this.$refs.editTableForm.startLoading();
          await this.pageSelect(sql);
          this.$refs.editTableForm.stopLoading();
          this.$refs.editTableForm.ColumnModify(index,targetIndex);
          this.$nextTick(()=>{
            this.$refs.editTableForm.setBacConfig();
          })
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
          this.$nextTick(()=>{
            this.$refs.editTableForm.setBacConfig();
          })
        } catch(err) {
          this.$refs.editTableForm.stopLoading();
        }
      },
      async handleDropColumn(sql,index){
        try{
          await this.pageSelect(sql);
          this.editTableForm.fields.splice(index,1);
          this.$nextTick(()=>{
            this.$refs.editTableForm.setBacConfig();
          })
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
          const sql = `DROP TABLE ${this.formatVal(val)}`;
          await this.pageSelect(sql);
        })
      },
      async handleDelDb(val){
        this.$confirm('是否删除此数据库('+val+')？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const sql = `DROP DATABASE ${this.formatVal(val)}`;
          if(this.nowDatabase === this.chooseOption.database){this.nowDatabase = '';}
          await this.pageSelect(sql);
        })
      },
      handleContextOption(event,option,index){
        this.chooseOption = option;
        this.$contextmenu({
          items: [
            {
              icon: "el-icon-plus",
              label: "新建数据库",
              onClick: () => {
                this.createDatabaseVisible = true;
              }
            },
            {
              icon: "el-icon-edit",
              label: "修改配置",
              onClick: () => {
                this.createOptionForm = this.deepClone(option);
                this.createOptionVisible = true;
                this.$refs.createOptionForm.setEditMode(true);
                this.editOptionIndex = index;
              }
            },
            {
              icon: "el-icon-delete",
              label: "删除配置",
              onClick: () => {
                this.handleDelConfig(option);
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
      async contextmenuTable(event,db,table){
        this.$contextmenu({
          items: [
            {
              icon: "el-icon-s-operation",
              label: "查看表结构",
              onClick: async() => {
                const sql = `show create table ${db}.${table}`;
                const res = await this.resultSql(sql);
                const code = res.data.rows[0]['Create Table'];
                this.$ShowSqlDialog({
                  title: `${db}.${table} 表结构`,
                  coexist: false,
                  code
                })
              }
            },
            {
              icon: "el-icon-edit",
              label: "修改表结构",
              onClick: async() => {
                    const {engine,charset,collateVal,comment} = await this.getCharsetAndCollateByTableName(db,table);
                    this.$refs.editTableForm.startLoading();
                    this.editTableDialogVisible = true;
                    const tableName = table;
                    this.editTableChooseDb = db;
                    this.getFields(db,table).then(columns=>{
                      columns.forEach((field,index)=>{
                        field.key = index;
                        field.length = this.columnType2Length(field.COLUMN_TYPE);
                        field.insert = false;
                        if(field.EXTRA==='auto_increment')
                          field.AI=true;
                        else
                          field.AI=false;
                      })
                      const fields = columns.map(item=>{
                        const {key,COLUMN_NAME,DATA_TYPE,length,COLUMN_DEFAULT,COLLATION_NAME,IS_NULLABLE,EXTRA,AI,COLUMN_COMMENT,insert} = item;
                        return {key,COLUMN_NAME,DATA_TYPE,length,COLUMN_DEFAULT,COLLATION_NAME,IS_NULLABLE,EXTRA,AI,COLUMN_COMMENT,insert};
                      })
                      const before = Date.now();
                      setTimeout(()=>{
                        this.editTableForm = {tableName,fields,charset,collateVal,engine,comment};
                        this.$forceUpdate();
                        this.$refs.editTableForm.stopLoading();
                        this.$nextTick(()=>{
                          this.$refs.editTableForm.setBacConfig();
                          console.log(Date.now()-before);
                        })
                      },50)
                    }).catch(err=>{
                      console.log('getFieldsError',err);
                      this.$refs.editTableForm.stopLoading();
                    })
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
      contextmenuDatabase(event,option,db,tables) {
        this.$contextmenu({
          items: [
            {
              icon: "el-icon-plus",
              label: "新建表",
              onClick: async() => {
                this.createTableChooseDb = db;
                this.createTableDialogVisible = true;
                const {charset,collateVal} = await this.getCharsetAndCollateByDbName(db);
                this.createTableForm.charset = charset;
                this.createTableForm.collateVal = collateVal;
              }
            },
            {
              icon: "el-icon-s-operation",
              label: "查看数据库结构",
              onClick: async() => {
                const sql = `show create database ${db}`;
                const res = await this.resultSql(sql);
                const code = res.data.rows[0]['Create Database'];
                this.$ShowSqlDialog({
                  title: `${db} 数据库结构`,
                  coexist: false,
                  code
                })
              }
            },
            {
              icon: "el-icon-edit",
              label: "修改数据库",
              onClick: async() => {
                const {charset,collateVal} = await this.getCharsetAndCollateByDbName(db);
                this.createDatabaseVisible = true;
                const name = db;
                this.createDatabaseForm = this.deepClone({name,collateVal,charset});
                this.$forceUpdate();
                bacDatabse = this.deepClone(this.createDatabaseForm);
                this.$refs.createDatabaseForm.setEditMode(true);
              }
            },
            {
              icon: "el-icon-download",
              label: "导出",
              onClick: async() => {
                const newOption = this.deepClone(option);
                newOption.database = db;
                delete newOption.name;
                const today = new Date().toJSON().substring(0,10).replace(/-/g,'');
                const homeDir = require('os').homedir();
                const desktopDir = `${homeDir}/Desktop`;
                const dumpToFile = `${desktopDir}/${db}_${today}.sql`
                mysqldump({connection: newOption,dumpToFile});
                this.$message.success('导出成功,文件保存在桌面！');
              }
            },
            {
              icon: "el-icon-upload2",
              label: "导入",
              onClick: async() => {
                this.chooseOption = this.deepClone(option);
                this.nowDatabase = db;
                this.handleUploadSql();
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
      handleFileChange(e){
        var reader = new FileReader();
        reader.readAsText(e.target.files[0], "UTF-8");
        reader.onload = async (e2) => {
            const result = e2.target.result;
            try{
              await this.pageSelect(result);
            } catch(err){
              console.log(err);
            }
            this.getDbTree(this.chooseOption);
            document.getElementById("fileElem").value = '';
        }
      },
      handleUploadSql(){
        var ie=navigator.appName=="Microsoft Internet Explorer" ? true : false; 
         if(ie){ 
             document.getElementById("fileElem").click(); 
         }else{
             var a=document.createEvent("MouseEvents");
             a.initEvent("click", true, true);  
             document.getElementById("fileElem").dispatchEvent(a);
         }
      },
      async getCharsetAndCollateByDbName(db){
        // CREATE DATABASE `aaabbbb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */
        const sql = `show create database ${db}`;
        const res = await this.resultSql(sql);
        const createDetail = res.data.rows[0]['Create Database'];
        const matchResult = createDetail.match(/ DEFAULT CHARACTER SET (.*?)( COLLATE (.*?))? /);
        const charset = matchResult[1];
        const collateVal = matchResult[3]||this.getDefaultCollateByCharset(charset);
        return {charset,collateVal};
      },
      async getCharsetAndCollateByTableName(db,table){
        // CREATE TABLE `aaaaaa` (`bbb` int(11) NOT NULL) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
        const sql = `show create table ${db}.${table}`;
        const res = await this.resultSql(sql);
        const createDetail = res.data.rows[0]['Create Table'];
        const matchResult = createDetail.match(/\) ENGINE=(.*?)( AUTO_INCREMENT=\d+)? DEFAULT CHARSET=(.*?)( COLLATE=(.*?))?( COMMENT='(.*)'$)?$/);
        const engine = matchResult[1];
        const charset = matchResult[3];
        const collateVal = matchResult[5]||this.getDefaultCollateByCharset(charset);
        const comment = matchResult[7]||'';
        return {engine,charset,collateVal,comment};
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
        const sql = insertSql.replace(/,"CURRENT_TIMESTAMP"/g,',CURRENT_TIMESTAMP');
        const addRes = await this.resultSql(sql);
        // this.$message.success('affectedRows Count:'+addRes.data.rows.affectedRows);
        this.msgSuccess(addRes.data.rows,sql);
        
        const newRowSql = `select * from ${nowDatabase}.${nowTable} where ${pri}=${addRes.data.rows.insertId}`;
        const newRowRes = await this.resultSql(newRowSql);

        if(addRes.data.rows.affectedRows === 1){
          const tempArr = this.deepClone(this.tableData);
          this.tableData = [];
          setTimeout(()=>{
            this.tableData = tempArr;
            this.tableData.push(newRowRes.data.rows[0]);
          },0)
          $('.el-table__body-wrapper').scrollTop = 0;
          this.pageConfig.total = this.pageConfig.total+1;
        }
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
        this.createOptionVisible = true;
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
      getChildrenByDbName(dbName){
        const filterItem = this.dbTree.filter(item=>item.Database === dbName);
        return filterItem[0].children;
      },
      async handleCreateDatabaseSubmit(form){
        try{
          const editFlag = this.$refs.createDatabaseForm.getEditMode();
          const {name,collateVal} = form;
          let sql = ""
          if(editFlag){
            if(!this.equals(this.createDatabaseForm,bacDatabse)){
              if(this.createDatabaseForm.name === bacDatabse.name){
                if(this.createDatabaseForm.collateVal!==bacDatabse.collateVal){
                  sql = `ALTER DATABASE ${name} COLLATE ${collateVal}`;
                }
              } else {
                sql = this.renameDatabaseName(bacDatabse.name,name,collateVal);
              }
              await this.pageSelect(sql);
            }
          } else {
            sql = `create database ${name} collate ${collateVal}`;
            await this.pageSelect(sql);
          }
          this.$refs.createDatabaseForm.handleClose();
        }catch(err){
          console.log(err);
          this.$refs.createDatabaseForm.stopLoading();
        }
      },
      renameDatabaseName(oldName,newName,collateVal){
        const tableArr = this.getChildrenByDbName(oldName);
        const tableRename = (tableName)=> {return `${oldName}.${tableName} TO ${newName}.${tableName}`};
        const tableRenames = tableArr.map(item=>tableRename(item));
        const renameString = tableRenames.join(',\n');
        if(tableArr.length===0){
          return `CREATE DATABASE ${newName} collate ${collateVal};\nDROP DATABASE ${oldName};`
        } 
        return `CREATE DATABASE ${newName} collate ${collateVal};\nRENAME TABLE ${renameString};\nDROP DATABASE ${oldName};`
      },
      handleCreateOptionSubmit(configForm){
          const flag = this.$refs.createOptionForm.getEditMode();
          const newConfigForm = this.deepClone(configForm);
          this.$store.dispatch('valideDbConfig',newConfigForm).then(res=>{
            if(!flag){
              this.$store.dispatch('addDbConfig',newConfigForm);
            } else {
              if(!this.isEmpty(this.editOptionIndex))
                this.$store.dispatch('changeConfig',newConfigForm,this.editOptionIndex);
            }
            this.$message.success("操作成功");
            this.$refs.createOptionForm.handleClose();
          }).catch(err=>{
            this.$refs.createOptionForm.stopLoading();
          })
      },
      async pageSelect(sql){
        const type = this.getSqlType(sql);
        let res = await this.resultSql(sql,true);
        if(type !== 'select'){
          this.canDelete = false;
        }
        const isMultisql = this.isMultisql(sql);
        if(!isMultisql&&res.data.hasOwnProperty("fields")){
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
          if(!this.equals(equalFieldsArr,res.data.fields)){
            this.fields = res.data.fields;
          }
          if(type === 'select')
          await this.getFieldCommentType();
        } else {
          if(type === 'drop' || type === 'create' || type === 'alter'){
            this.getDbTree(this.chooseOption);
          }
          this.msgSuccess(res.data.rows,sql);
        }
      },
      async handleSizeChange(val){
        this.pageConfig.pageSize = val;
        this.pageConfig.pageNum = 1;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        this.sql = this.sql.replace(/ limit \d+,\d+$/g,(val)=>{ return ` limit ${start},${this.pageConfig.pageSize}`});
        await this.pageSelect(this.sql);
      },
      async handleCurrentChange(val){
        this.pageConfig.pageNum = val;
        let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
        this.sql = this.sql.replace(/ limit \d+,\d+$/g,(val)=>{ return ` limit ${start},${this.pageConfig.pageSize}`});
        await this.pageSelect(this.sql);
      },
      getDbTree(option){
        this.removeChooseClass();
        this.chooseOption = this.deepClone(option);
        let data = option;
        this.$http.post('/dbtree',data).then(res=>{
          this.dbTree = res.data;
        })
      },
      chooseDatabase(database){
        if(this.nowDatabase === database){
          return;
        }
        this.nowDatabase = database;
        this.nowTable='';
        this.tableData = [];
        this.fields = [];
      },
      async chooseTable(database,table){
        this.loading = true;
        this.nowTable = table;
        this.nowDatabase = database;
        let sql = `select * from ${this.nowTable}`;
        await this.preFixLimitSql(sql);
        await this.pageSelect(this.sql);
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
            const db = this.nowDatabase;
            const table = this.nowTable;
            let primaryKey = await this.getPrimaryKey(db,table);
            let sql = `DELETE FROM ${this.formatVal(db)}.${this.formatVal(table)} WHERE ${this.formatVal(primaryKey)} = ${row[primaryKey]}`;
            this.sql = sql;
            let removeRes = await this.resultSql(sql);
            this.msgSuccess(removeRes.data.rows,sql);
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
          if(row[key] == value){
            return;
          }
          const db = this.nowDatabase;
          const table = this.nowTable;
          let primaryKey = await this.getPrimaryKey(db,table);
          let sql = `UPDATE ${this.formatVal(db)}.${this.formatVal(table)} SET ${this.formatVal(key)} = '${this.escape(value)}' WHERE ${this.formatVal(primaryKey)} = ${row[primaryKey]}`;
          this.sql = sql;
          let updateRes = await this.resultSql(sql);
          this.msgSuccess(updateRes.data.rows,sql);
          row[key] = value;
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
        const options = this.deepClone(this.chooseOption);
        options.database = this.nowDatabase;
        let data = {
          sql,
          options
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
        const {sql} = this;
        if(sql === ''){
          this.$message.error("请输入sql");
          return;
        }
        if(this.chooseOption.host === undefined){
          this.$message.error('请选择连接');
          return;
        }
        this.loading = true;
        if(this.getSqlType(sql) === 'select'){
          this.preFixLimitSql(sql);
        }
        await this.pageSelect(sql);
      },
      async preFixLimitSql(sql){
        if(!this.isLimitSql(sql)){
          let total = await this.getSqlRowCount(sql);
          this.pageConfig.total = total;
          let start = (this.pageConfig.pageNum-1)*this.pageConfig.pageSize;
          this.sql = sql +` limit ${start},${this.pageConfig.pageSize}`;
        }
      },
      async getSqlRowCount(sql){
        let type = sql.split(" ")[0].toLowerCase();
        let countSql =  `select count(1) as total from (${sql}) as t${new Date().getTime()}`;
        if(this.isMultisql(sql)){
          return 0;
        }        
        if(type === 'select'){
          // if(!this.isCountSql(sql))
          //   countSql = sql.replace(/select (.*?) from/i,'select count(1) as total from');  TODO  有bug  select distinct columnName from table;
          // else{
          //   countSql = sql;
          // }
          if(this.isCountSql(sql))
            countSql = sql;
        } else if(type==='delete'||type==='update'||type==='insert'||type==='explain'){
          return 0;
        } else {
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
    .table-child{
      font-size:13px;
      padding:5px;
      border:1px solid transparent;
      transition:all .2s;
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
    .table-child:focus{
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