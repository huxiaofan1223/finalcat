<template>
      <el-dialog
        title="修改表"
        :visible.sync="createTableDialogVisible"
        width="1200px"
        :before-close="handleClose">
            <el-form class="form" size="mini" label-position="top" :model="form" :rules="rules" ref="form" v-loading="loading" element-loading-text="loading...">
                <el-row>
                    <el-col :span="3" style="padding-right:10px;">
                        <el-form-item label="表名" prop="tableName">
                            <el-input v-model="form.tableName" placeholder="表名" :readonly="!editTableNameFlag"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="操作">
                            <el-button icon="el-icon-edit" size="mini" circle style="padding:3px;" @click="handleChangeTableName" v-if="!editTableNameFlag"></el-button>
                            <template v-else>
                                <el-button icon="el-icon-check" size="mini" circle style="padding:3px;" @click="handleChangeTableNameConfirm"></el-button>
                                <el-button icon="el-icon-close" size="mini" circle style="padding:3px;" @click="handleChangeTableNameCancel"></el-button>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-bottom:10px;">
                    <el-col :span="3">名字</el-col>
                    <el-col :span="2">类型</el-col>
                    <el-col :span="2">长度</el-col>
                    <el-col :span="3">默认</el-col>
                    <el-col :span="3">排序规则</el-col>
                    <el-col :span="3">属性</el-col>
                    <el-col :span="1">可为空</el-col>
                    <el-col :span="1">自增</el-col>
                    <el-col :span="4">备注</el-col>
                </el-row>
                <el-row v-for="(item,index) in form.fields" :key="item.key" style="text-align:center;">
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item :prop="'fields.' + index + '.COLUMN_NAME'" :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
                            <el-input v-model="item.COLUMN_NAME" placeholder="名字" :readonly="editIndex!==index"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <type-select v-model="item.DATA_TYPE" placeholder="类型" :disabled="editIndex!==index"></type-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <el-input v-model="item.length" placeholder="长度" :readonly="editIndex!==index"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <el-select v-model="item.COLUMN_DEFAULT"
                                filterable
                                allow-create
                                default-first-option placeholder="默认"
                                :disabled="editIndex!==index">
                                <el-option label="无" value=""></el-option>
                                <el-option label="CURRENT_TIMESTAMP" value="CURRENT_TIMESTAMP"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <collate-select v-model="item.COLLATION_NAME" placeholder="排序规则" :disabled="editIndex!==index"></collate-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <el-select v-model="item.EXTRA" placeholder="属性" :disabled="editIndex!==index">
                                <el-option label="无" value=""></el-option>
                                <el-option label="BINARY" value="BINARY"></el-option>
                                <el-option label="UNSIGNED" value="UNSIGNED"></el-option>
                                <el-option label="UNSIGNED ZEROFILL" value="UNSIGNED ZEROFILL"></el-option>
                                <el-option label="on update CURRENT_TIMESTAMP" value="on update CURRENT_TIMESTAMP"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.IS_NULLABLE" true-label="YES" false-label="NO" placeholder="可为空" :disabled="editIndex!==index"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.AI" placeholder="自增" :disabled="editIndex!==index"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="padding-right:10px;">
                        <el-form-item>
                            <el-input v-model="item.COLUMN_COMMENT" placeholder="备注" :readonly="editIndex!==index"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-button v-if="!item.insert" icon="el-icon-top" size="mini" circle style="padding:3px;" @click="handleModify(index,true)" :disabled="index===0"></el-button>
                            <el-button v-if="!item.insert" icon="el-icon-bottom" size="mini" circle style="padding:3px;" @click="handleModify(index,false)" :disabled="index===form.fields.length-1"></el-button>
                            <template v-if="index===editIndex">
                                <el-button icon="el-icon-check" size="mini" circle style="padding:3px;" @click="handleEditConfirm(item)"></el-button>
                                <el-button icon="el-icon-close" size="mini" circle style="padding:3px;" @click="handleEditCancel(index)"></el-button>
                            </template>
                            <el-button icon="el-icon-edit" size="mini" circle style="padding:3px;" @click="handleEdit(index)" v-else></el-button>
                            <el-button size="mini" icon="el-icon-delete" circle style="padding:3px;" v-if="!item.insert&&editIndex!==index" type="danger" @click="handleRemove(index,item.COLUMN_NAME)"></el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    插入在
                    <el-select v-model.number="insertIndex" size="mini">
                        <el-option v-for="field in insertOptions" :key="field.index" :value="field.index" :label="field.name"></el-option>
                    </el-select>
                    <el-button type="primary" size="mini" @click="handleAddField" :disabled="!canInsert">新增字段</el-button>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="mini">取 消</el-button>
                <!-- <el-button @click="handleSee" size="mini">查看SQL</el-button> -->
                <!-- <el-button type="primary" native-type="submit" @click="handleSubmit" size="mini">确 定</el-button> -->
            </span>
      </el-dialog>

</template>


<script>
import TypeSelect from '../../components/TypeSelect';
import CollateSelect from '../../components/CollateSelect';
const defaultForm = {
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
let bacConfig = {};
export default {
    components:{
        TypeSelect,
        CollateSelect
    },
    watch:{
        form:{
            deep:true,
            handler(val){
                if(this.form.fields.some(item=>item.insert)){
                    return;
                }
                this.insertIndex = this.insertOptions.length-2;
            }
        }
    },
    props:{
        form:{
            type:Object,
            default:()=>{
                return this.deepClone(defaultForm);
            }
        },
        createTableDialogVisible:{
            type:Boolean,
            default:false
        },
        createTableChooseDb:{
            type:String,
            default:''
        }
    },
    computed:{
        canInsert(){
            return !this.form.fields.some(item=>item.insert);
        },
        insertOptions(){
            const options = this.form.fields.filter(item=>!item.insert).map((item,index)=>{
                const name = item.COLUMN_NAME+' 之后';
                return {index,name};
            })
            options.unshift({index:-1,name:'表头'});
            return options;
        }
    },
    data(){
        return {
            rules:{
                tableName:[
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ]
            },
            loading:false,
            editIndex:'',
            bacConfig:{},
            insertIndex:'',
            editTableNameFlag:false
        }
    },
    methods:{
        handleChangeTableName(){
            this.editTableNameFlag = true;
            this.editIndex = '';
            bacConfig = this.deepClone(this.form);
        },
        handleChangeTableNameConfirm(){
            const oldTableName = bacConfig.tableName;
            const newTableName = this.form.tableName;
            const db = this.createTableChooseDb;
            const sql = `alter table ${db}.${oldTableName} rename to ${newTableName}`;
            this.$emit('handleRenameTable',sql,db,oldTableName,newTableName);
        },
        handleChangeTableNameCancel(){
            this.editTableNameFlag = false;
            const hasChange = !this.equals(bacConfig,this.form);
            console.log(hasChange);
            if(hasChange){this.$emit('update:form',bacConfig)};
            bacConfig = {};
        },
        resetEditIndex(){
            this.editIndex = '';
            this.editTableNameFlag = false;
        },
        handleEditCancel(){
            this.editIndex = '';
            const hasChange = !this.equals(bacConfig,this.form);
            console.log('cancel',this.form.tableName);
            console.log('cancel',bacConfig);
            if(hasChange){this.$emit('update:form',bacConfig)};
            bacConfig = {};
        },
        handleEdit(index){
            if(this.editTableNameFlag){
                const hasChange = !this.equals(bacConfig,this.form);
                if(hasChange){this.$emit('update:form',bacConfig)};
            }
            this.$nextTick(()=>{
                this.editIndex = index;
                this.editTableNameFlag = false;
                bacConfig = this.deepClone(this.form);
            })
        },
        handleEditConfirm(field){
            const isInsert = field.insert;
            const db = this.createTableChooseDb;
            const table = this.form.tableName;
            const fieldString = this.item2Field(field);
            if(isInsert){
                let sql="";
                if(this.insertIndex===''){
                    sql = `ALTER TABLE ${db}.${table} ADD ${fieldString}`;
                } else {
                    if(this.insertIndex===-1){
                        sql = `ALTER TABLE ${db}.${table} ADD ${fieldString} first`;
                    } else {
                        const beforeColumnName = bacConfig.fields[this.insertIndex].COLUMN_NAME;
                        console.log(this.insertIndex);
                        sql = `ALTER TABLE ${db}.${table} ADD ${fieldString} after ${beforeColumnName}`;
                    }
                }
                this.$emit('handleChangeColumn',sql,db,table,isInsert);
            } else {
                const beforeColumn = bacConfig.fields[this.editIndex];
                const beforeName = beforeColumn.COLUMN_NAME;
                const sql = `ALTER TABLE ${db}.${table} CHANGE ${beforeName} ${fieldString}`;
                this.$emit('handleChangeColumn',sql,db,table,!isInsert);
            }
        },
        elChangeExForArray(index1, index2, array) {
            let temp = array[index1]
            array[index1] = array[index2]
            array[index2] = temp
            return array
        },
        handleModify(index,toTop){
            const targetIndex = toTop? index-2:index+1;
            const db = this.createTableChooseDb;
            const table = this.form.tableName;
            const fieldString = this.item2Field(this.form.fields[index]);
            let sql="";
            if(targetIndex===-1){
                sql = `ALTER TABLE ${db}.${table} modify ${fieldString} first`
            } else {
                const beforeColumnName = this.form.fields[targetIndex].COLUMN_NAME;
                sql = `ALTER TABLE ${db}.${table} modify ${fieldString} after ${beforeColumnName}`;
            }
            this.$emit('handleModifyColumn',sql,db,table,index,toTop);
        },
        ColumnModifyToTop(index){
            const fields = this.elChangeExForArray(index-1,index,this.form.fields);
            const form = this.deepClone(this.form);
            form.fields = fields;
            this.$emit('update:form',form);
        },
        ColumnModifyToBottom(index){
            const fields = this.elChangeExForArray(index+1,index,this.form.fields);
            const form = this.deepClone(this.form);
            form.fields = fields;
            this.$emit('update:form',form);
        },
        item2Field(field){
            const extra = this.isEmpty(field.EXTRA)?'':field.EXTRA;
            const length = this.isEmpty(field.length) ? '':`(${field.length})`;
            const nullable = field.IS_NULLABLE==='YES'?'NULL':'NOT NULL';
            let defaultVal = this.isEmpty(field.COLUMN_DEFAULT)?'':`DEFAULT '${field.COLUMN_DEFAULT}'`;
            const collateVal = this.isEmpty(field.COLLATION_NAME)?'':`COLLATE ${field.COLLATION_NAME}`;
            const ai = field.AI?'AUTO_INCREMENT':'';
            const comment = this.isEmpty(field.COLUMN_COMMENT)?'':`COMMENT '${field.COLUMN_COMMENT}'`;
            if(field.COLUMN_DEFAULT === 'CURRENT_TIMESTAMP') defaultVal='DEFAULT CURRENT_TIMESTAMP';
            return `${field.COLUMN_NAME} ${field.DATA_TYPE}${length} ${extra} ${collateVal} ${nullable} ${defaultVal} ${ai} ${comment}`;
        },
        getPrimaryString(fields){
            const primaryArr = fields.filter(item=>item.AI).map(item=>"`"+item.COLUMN_NAME+"`");
            if(primaryArr.length)
                return `,PRIMARY KEY (${primaryArr.join(',')})`;
            else
                return ''
        },
        startLoading(){
            this.loading = true;
        },
        stopLoading(){
            this.loading = false;
        },
        handleClose(){
            this.loading = false;
            const form = this.deepClone(defaultForm);
            this.$emit('update:form',form);
            this.$emit('update:createTableDialogVisible',false);
        },
        handleSubmit(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const sql = this.form2Sql(this.form);
                    this.$emit('handleCreateTableSubmit',sql);
                }
            });
        },
        form2Sql(form){
            const tableName = form.tableName;
            const fieldString = form.fields.map(item=>this.item2Field(item)).join(',');
            const primaryString = this.getPrimaryString(form.fields);
            const db = this.createTableChooseDb;
            return `CREATE TABLE ${db}.${tableName} (${fieldString} ${primaryString})`;
        },
        handleSee(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const sql = this.form2Sql(this.form);
                    this.$notify({
                        title: 'sql预览',
                        message:sql,
                        duration: 0
                    });
                }
            });
        },
        handleAddField(){
            const field = {
                key:new Date().getTime(),
                COLUMN_NAME:'',
                DATA_TYPE:'int',
                length:'',
                COLUMN_DEFAULT:'',
                COLLATION_NAME:'',
                IS_NULLABLE:'NO',
                EXTRA:'',
                AI:false,
                COLUMN_COMMENT:'',
                insert:true
            }
            bacConfig = this.deepClone(this.form);
            if(this.insertIndex===''){
                this.form.fields.push(field);
                this.editIndex = this.form.fields.length-1;
            } else {
                this.form.fields.splice(this.insertIndex+1,0,field);
                this.editIndex = this.insertIndex+1;
            }
        },
        handleRemove(index,name){
            const db = this.createTableChooseDb;
            const table = this.form.tableName;
            const sql = `ALTER TABLE ${db}.${table} DROP ${name}`;
            this.$confirm('是否删除此字段('+name+')？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                this.$emit('handleDropColumn',sql,index);
            })
        }
    }
}
</script>

<style scoped lang="scss">
.form{
    ::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom:15px;
    }
    ::v-deep .el-input.is-disabled .el-input__inner{
        color:#777777;
    }
}
</style>