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
                            <el-input v-model="form.tableName" placeholder="表名" @blur="handleTableNameChange" @keyup.enter.native="handleTableNameChange"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="padding-right:10px;">
                        <el-form-item label="表注释">
                            <el-input v-model="form.comment" placeholder="表注释" @blur="handleCommentChange"  @keyup.enter.native="handleCommentChange"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="padding-right:10px;">
                        <el-form-item label="排序规则">
                            <collate-select v-model="form.collateVal" :charset="form.charset" placeholder="排序规则" @change="handleCollateChange"></collate-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="存储引擎">
                            <engine-select v-model="form.engine" placeholder="存储引擎" @change="handleEngineChange"></engine-select>
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
                <div style="max-height:500px;overflow: auto;">
                    <div v-for="(item,index) in form.fields" :key="item.key" style="text-align:center;">
                        <edit-table-column-item :item="item" :index="index" @handleColumnChange="handleColumnChange" @handleRemove="handleRemove"></edit-table-column-item>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer between">
                <el-row>
                    插入在
                    <el-select v-model.number="insertIndex" size="mini">
                        <el-option v-for="field in insertOptions" :key="field.index" :value="field.index" :label="field.name"></el-option>
                    </el-select>
                    <el-button type="primary" size="mini" @click="handleAddField" :disabled="!canInsert">新增字段</el-button>
                </el-row>
                <el-button @click="handleClose" size="mini">取 消</el-button>
                <!-- <el-button @click="handleSee" size="mini">查看SQL</el-button> -->
                <!-- <el-button type="primary" native-type="submit" @click="handleSubmit" size="mini">确 定</el-button> -->
            </span>
      </el-dialog>

</template>


<script>
import TypeSelect from '../../components/TypeSelect';
import CollateSelect from '../../components/CollateSelect';
import EngineSelect from '../../components/EngineSelect';
import EditTableColumnItem from './EditTableColumnItem.vue';
const defaultForm = {
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
            COLUMN_COMMENT:'',
            insert:false
        }
    ]
}
let bacConfig = {};
export default {
    components:{
        TypeSelect,
        CollateSelect,
        EngineSelect,
        EditTableColumnItem
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
            required:true
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
        setBacConfig(){
            bacConfig = this.deepClone(this.form);
        },
        handleTableNameChange(){
            const oldTableName = bacConfig.tableName;
            const newTableName = this.form.tableName;
            if(oldTableName === newTableName){return}
            const db = this.createTableChooseDb;
            const sql = `alter table ${db}.${oldTableName} rename to ${newTableName}`;
            this.$emit('handleRenameTable',sql,db,oldTableName,newTableName);
        },
        handleCommentChange(){
            const oldComment = bacConfig.comment;
            const newComment = this.form.comment;
            if(oldComment === newComment){return}
            const table = this.form.tableName;
            const db = this.createTableChooseDb;
            const sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} COMMENT = '${newComment}'`;
            this.$emit('handleChangeColumn',sql);
        },
        handleCollateChange(val){
            const table = this.form.tableName;
            const db = this.createTableChooseDb;
            const sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} COLLATE ${val}`;
            this.$emit('handleChangeColumn',sql);
        },
        handleEngineChange(val){
            const table = this.form.tableName;
            const db = this.createTableChooseDb;
            const sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} ENGINE = ${val}`;
            this.$emit('handleChangeColumn',sql);
        },
        handleChangeTableName(){
            if(this.editIndex !== ''){
                const hasChange = !this.equals(bacConfig,this.form);
                if(hasChange){this.$emit('update:form',bacConfig)};
            }
            this.$nextTick(()=>{
                this.editTableNameFlag = true;
                this.editIndex = '';
                bacConfig = this.deepClone(this.form);
            })
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
        hasNotChange(){
            return this.equals(this.form,bacConfig);
        },
        handleColumnChange(field,index){
            console.log('handleColumnChange');
            if(this.hasNotChange()){return};
            const isInsert = field.insert;
            const db = this.createTableChooseDb;
            const table = this.form.tableName;
            const fieldString = this.item2Field(field);
            if(isInsert){
                let sql="";
                if(this.insertIndex===''){
                    sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} ADD ${fieldString}`;
                } else {
                    if(this.insertIndex===-1){
                        sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} ADD ${fieldString} first`;
                    } else {
                        const beforeColumnName = bacConfig.fields[this.insertIndex].COLUMN_NAME;
                        console.log(this.insertIndex);
                        sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} ADD ${fieldString} after ${beforeColumnName}`;
                    }
                }
                this.$emit('handleChangeColumn',sql,db,table,isInsert);
            } else {
                const beforeColumn = bacConfig.fields[index];
                const beforeName = beforeColumn.COLUMN_NAME;
                const sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} CHANGE ${beforeName} ${fieldString}`;
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
                sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} modify ${fieldString} first`
            } else {
                const beforeColumnName = this.form.fields[targetIndex].COLUMN_NAME;
                sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} modify ${fieldString} after ${beforeColumnName}`;
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
            const extra = this.isEmpty(field.EXTRA)?'':' '+field.EXTRA;
            const length = this.isEmpty(field.length) ? '':`(${field.length})`;
            const nullable = field.IS_NULLABLE==='YES'?' NULL':' NOT NULL';
            let defaultVal = this.isEmpty(field.COLUMN_DEFAULT)?'':` DEFAULT '${field.COLUMN_DEFAULT}'`;
            const collateVal = this.isEmpty(field.COLLATION_NAME)?'':` COLLATE ${field.COLLATION_NAME}`;
            const ai = field.AI?' AUTO_INCREMENT':'';
            const comment = this.isEmpty(field.COLUMN_COMMENT)?'':` COMMENT '${field.COLUMN_COMMENT}'`;
            if(field.COLUMN_DEFAULT === 'CURRENT_TIMESTAMP') defaultVal=' DEFAULT CURRENT_TIMESTAMP';
            return `${this.formatVal(field.COLUMN_NAME)} ${field.DATA_TYPE}${length}${extra}${collateVal}${nullable}${defaultVal}${ai}${comment}`;
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
            const before = Date.now();
            this.$emit('update:form',form);
            this.$emit('update:createTableDialogVisible',false);
            this.$nextTick(()=>{
                const after = Date.now();
                console.log(after-before);
            })
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
            return `CREATE TABLE ${this.formatVal(db)}.${this.formatVal(tableName)} (${fieldString} ${primaryString})`;
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
            const sql = `ALTER TABLE ${this.formatVal(db)}.${this.formatVal(table)} DROP ${this.formatVal(name)}`;
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