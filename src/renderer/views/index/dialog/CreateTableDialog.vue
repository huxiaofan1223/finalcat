<template>
      <el-dialog
        title="新建表"
        :visible.sync="createTableDialogVisible"
        width="1200px"
        :before-close="handleClose">
            <el-form class="form" size="mini" label-position="top" :model="form" :rules="rules" ref="form" v-loading="loading" element-loading-text="loading...">
                <el-row>
                    <el-col :span="4" style="padding-right:10px;">
                        <el-form-item label="表名" prop="tableName">
                            <el-input v-model="form.tableName" placeholder="表名"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4" style="padding-right:10px;">
                        <el-form-item label="表注释">
                            <el-input v-model="form.comment" placeholder="表注释"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4" style="padding-right:10px;">
                        <el-form-item label="排序规则">
                            <collate-select v-model="form.collateVal" :charset="form.charset" placeholder="排序规则"></collate-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4">
                        <el-form-item label="存储引擎">
                            <engine-select v-model="form.engine" placeholder="存储引擎"></engine-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-bottom:10px;">
                    <el-col :span="3">名字</el-col>
                    <el-col :span="2">类型</el-col>
                    <el-col :span="1">长度</el-col>
                    <el-col :span="2">默认</el-col>
                    <el-col :span="3">排序规则</el-col>
                    <el-col :span="3">属性</el-col>
                    <el-col :span="1">可为空</el-col>
                    <el-col :span="3">索引</el-col>
                    <el-col :span="1">自增</el-col>
                    <el-col :span="4">备注</el-col>
                </el-row>
                <el-row v-for="(item,index) in form.fields" :key="item.key" style="text-align:center;">
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item :prop="'fields.' + index + '.COLUMN_NAME'" :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
                            <el-input v-model="item.COLUMN_NAME" placeholder="名字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <type-select v-model="item.DATA_TYPE" placeholder="类型"></type-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-input v-model="item.length" placeholder="长度"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <el-select v-model="item.COLUMN_DEFAULT"
                                filterable
                                allow-create
                                default-first-option placeholder="默认">
                                <el-option label="无" value=""></el-option>
                                <el-option label="CURRENT_TIMESTAMP" value="CURRENT_TIMESTAMP"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <collate-select v-model="item.COLLATION_NAME" placeholder="排序规则"></collate-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <el-select v-model="item.EXTRA" placeholder="属性">
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
                            <el-checkbox v-model="item.IS_NULLABLE" true-label="YES" false-label="NO" placeholder="可为空"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="3">
                        <el-form-item>
                            <el-col :span="16">
                            <el-select v-model="item.index" placeholder="索引" @change="handleIndexChange(item)" @focus="handleSaveBak">
                                <el-option label="---" value=""></el-option>
                                <el-option label="PRIMARY" value="PRIMARY"></el-option>
                                <el-option label="UNIQUE" value="UNIQUE"></el-option>
                                <el-option label="INDEX" value="INDEX"></el-option>
                                <el-option label="FULLTEXT" value="FULLTEXT"></el-option>
                                <el-option label="SPATIAL" value="SPATIAL"></el-option>
                            </el-select>
                            </el-col>
                            <el-col :span="8" style="cursor:pointer;color:#409EFF;" @click.native="handleIndexClick(item)">{{formatIndexName(item)}}</el-col>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.AI" placeholder="自增" @change="handleAutoChange(item)"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="padding-right:10px;">
                        <el-form-item>
                            <el-input v-model="item.COLUMN_COMMENT" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item>
                            <el-button icon="el-icon-top" size="mini" circle style="padding:3px;" @click="handleToTop(index)" :disabled="index===0"></el-button>
                            <el-button icon="el-icon-bottom" size="mini" circle style="padding:3px;" @click="handleToBottom(index)" :disabled="index===form.fields.length-1"></el-button>
                            <el-button size="mini" icon="el-icon-delete" circle style="padding:3px;" type="danger" @click="handleRemove(index)" :disabled="index===0"></el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button type="primary" size="mini" @click="handleAddField">新增字段</el-button>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="mini">取 消</el-button>
                <el-button @click="handleSee" size="mini">查看SQL</el-button>
                <el-button type="primary" native-type="submit" @click="handleSubmit" size="mini">确 定</el-button>
            </span>

            <indexes-dialog 
                :visible.sync="indexDialogVisible" 
                :indexType="indexType"
                :isSingle.sync="isSingle"
                :concatKeyGroup="concatKeyGroup"
                :indexName.sync="indexName"
                @confirm="handleIndexConfirm"
                @cancel="handleIndexCancel"
                ref="IndexesDialog">
            </indexes-dialog>
      </el-dialog>
</template>


<script>
import TypeSelect from '../../components/TypeSelect';
import CollateSelect from '../../components/CollateSelect';
import EngineSelect from '../../components/EngineSelect';
import IndexesDialog from './IndexesDialog';
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
            index:'',
            indexName:'',
            indexType:'single',
            concatKey:'',
            concatKeyIndexArr:[]
        }
    ]
}
let bakForm = null;
export default {
    components:{
        TypeSelect,
        CollateSelect,
        EngineSelect,
        IndexesDialog
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
    data(){
        return {
            rules:{
                tableName:[
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ]
            },
            loading:false,
            indexDialogVisible:false,
            indexType:'',
            isSingle:'single',
            concatKeyGroup:[],
            indexItem:null,
            indexName:''
        }
    },
    methods:{
        handleAutoChange(item){
            console.log(item.COLUMN_NAME,item.index,item.AI);
            if(item.AI){
                if(item.index===''){
                    this.indexDialogVisible = true;
                    this.isSingle = 'single';
                    this.indexType = 'PRIMARY';
                    this.indexItem = item;
                }
            }
        },
        getItemByKey(arr,key){
            return arr.find(item=>item.key===key);
        },
        formatIndexName(item){
            if(item.index==='') return;
            if(item.indexType === 'single'){
                return item.indexName || item.COLUMN_NAME;
            } else {
                const concatKey = item.concatKeyIndexArr.map(key=>this.getItemByKey(this.form.fields,key).COLUMN_NAME).join(',');
                return item.indexName || concatKey;
            }
        },
        handleSaveBak(){
            bakForm = this.deepClone(this.form);
        },
        handleIndexCancel(){
            this.$emit('update:form',bakForm);
        },
        handleIndexConfirm([indexName,indexType,concatKey,index]){
            this.indexItem.indexName = indexName;
            this.indexItem.indexType = indexType;
            this.indexItem.index = index;
            const concatKeyArr = concatKey.split(',').remove('');
            const nameArr = this.form.fields.map(item=>item.COLUMN_NAME);
            this.indexItem.concatKey = [...new Set([...concatKeyArr,this.indexItem.COLUMN_NAME])];
            const concatKeyIndexArr = this.indexItem.concatKey.map(item=>this.form.fields[nameArr.indexOf(item)].key);
            this.indexItem.concatKeyIndexArr = concatKeyIndexArr;
            if(indexType === 'multi'){
                this.form.fields.forEach(item=>{
                    if(concatKeyArr.includes(item.COLUMN_NAME)){
                        item.indexType = 'multi';
                        item.concatKey = [...this.indexItem.concatKey];
                        item.indexName = indexName;
                        item.concatKeyIndexArr = concatKeyIndexArr;
                    }
                })
            } else {
                this.form.fields.forEach(item=>{
                    if(item.indexType === 'multi' && item.concatKey.includes(this.indexItem.COLUMN_NAME)){
                        item.concatKey.remove(this.indexItem.COLUMN_NAME);
                        item.concatKeyIndexArr.remove(this.form.fields[nameArr.indexOf(this.indexItem.COLUMN_NAME)].key);
                        item.indexType = item.concatKeyIndexArr.length <2 ?'single':'multi';
                    }
                })
            }
            console.log(this.form.fields);
        },
        handleIndexChange(item){
            this.$refs['form'].validate((valid) => {
                if(valid){
                    if(item.index===''){return}
                    this.indexItem = item;
                    this.indexDialogVisible = true;
                    this.indexType = item.index;
                    const singleArr = this.form.fields.filter(item2=>item2.index===item.index&&!this.equals(item2,item)&&item2.indexType ==='single').map(item3=>item3.COLUMN_NAME);
                    const multiArr = [...new Set(this.form.fields.filter(item2=>item2.index===item.index&&!this.equals(item2,item)&&item2.indexType ==='multi').map(item3=>item3.concatKeyIndexArr.map(key=>this.getItemByKey(this.form.fields,key).COLUMN_NAME).join(',')))];
                    this.concatKeyGroup = [...singleArr,...multiArr];
                    this.isSingle = 'single';
                    this.indexName = '';
                } else {
                    item.index = '';
                }
            })
        },
        handleIndexClick(item){
            this.indexItem = item;
            this.handleSaveBak();
            this.indexDialogVisible = true;
            this.indexType = item.index;
            const singleArr = this.form.fields.filter(item2=>item2.index===item.index&&!this.equals(item2,item)&&item2.indexType ==='single').map(item3=>item3.COLUMN_NAME);
            const multiArr = [...new Set(this.form.fields.filter(item2=>item2.index===item.index&&!this.equals(item2,item)&&item2.indexType ==='multi').map(item3=>item3.concatKeyIndexArr.map(key=>this.getItemByKey(this.form.fields,key).COLUMN_NAME).join(',')))];
            this.concatKeyGroup = [...singleArr,...multiArr];
            console.log(item);
            console.log(item.concatKeyIndexArr);
            this.$refs.IndexesDialog.concatKey = item.concatKeyIndexArr.map(key=>this.getItemByKey(this.form.fields,key).COLUMN_NAME).join(',');
            this.isSingle = item.indexType;
            this.indexName = item.indexName;
        },
        elChangeExForArray(oldIndex, newIndex, array) {
            let temp = array[oldIndex];
            array[oldIndex] = array[newIndex];
            array[newIndex] = temp;
            return array;
        },
        handleToTop(index){
            const fields = this.elChangeExForArray(index-1,index,this.form.fields);
            const form = this.deepClone(this.form);
            form.fields = fields;
            this.$emit('update:form',form);
        },
        handleToBottom(index){
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
            const primaryArr = fields.filter(item=>item.index==='PRIMARY').map(item=>this.formatVal(item.COLUMN_NAME));
            if(primaryArr.length)
                return `,\nPRIMARY KEY (${primaryArr.join(',')})`;
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
            this.$refs.form.resetFields();
            this.$nextTick(()=>{
                this.loading = false;
                const before = Date.now();
                const form = this.deepClone(defaultForm);
                this.$emit('update:form',form);
                this.$emit('update:createTableDialogVisible',false);
                this.$nextTick(()=>{
                    const after = Date.now();
                    console.log(after-before);
                })
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
            const fieldString = form.fields.map(item=>this.item2Field(item)).join(',\n');
            const primaryString = this.getPrimaryString(form.fields);
            const indexString = this.getIndexString(form.fields);
            const db = this.createTableChooseDb;
            const engine = `ENGINE = ${this.form.engine } `;
            const collate = this.isEmpty(this.form.collateVal)?'':`COLLATE ${this.form.collateVal} `;
            const comment = this.isEmpty(this.form.comment)?'':`COMMENT = '${this.form.comment}'`;
            return `CREATE TABLE ${this.formatVal(db)}.${this.formatVal(tableName)} (\n${fieldString}${primaryString}${indexString}\n) ${engine}${collate}${comment}`;
        },
        getIndexString(oldFields){
            const fields = oldFields.filter(item=>item.index!=='' && item.index!=='PRIMARY');
            const singleArr = fields.filter(item=>item.indexType==='single');
            const singleString = singleArr.length === 0 ? '':',\n' + singleArr.map(item=>{return `${item.index} ${this.isEmpty(item.indexName)?'':this.formatVal(item.indexName)+' '}(${this.formatVal(item.COLUMN_NAME)})`}).join(',');
            const multiArr = fields.filter(item=>item.indexType==='multi'&&item.concatKey!=='');
            const multiString = multiArr.length === 0 ? '':',\n' + [...new Set(multiArr.map(item=>{return `${item.index} ${this.isEmpty(item.indexName)?'':this.formatVal(item.indexName)+' '}(${item.concatKeyIndexArr.map(key=>this.formatVal(this.getItemByKey(oldFields,key).COLUMN_NAME))})`}))].join(',');
            const result = singleString+multiString;
            return result;
        },
        handleSee(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const code = this.form2Sql(this.form);
                    this.$ShowSqlDialog({
                        title: `新建表SQL`,
                        coexist: false,
                        code
                    })
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
                index:'',
                indexName:'',
                indexType:'single',
                concatKey:'',
                concatKeyIndexArr:[]
            }
            this.form.fields.push(field);
        },
        computeConcatKeyIndex(){
            // 求差集
            var subSet = function (arr1, arr2) {
                var set2 = new Set(arr2);
                var subset = [];
                arr1.forEach(function(val, index) {
                    if (!set2.has(val)) {
                        subset.push(val);
                    }
                });
                return subset;
            };
            const nameArr = this.form.fields.map(item=>item.COLUMN_NAME);
            this.form.fields.forEach(item=>{
                const removeConcatKeyArr = subSet(item.concatKey,nameArr);
                removeConcatKeyArr.forEach(removeItem=>{
                    item.concatKey.remove(removeItem);
                    item.concatKeyIndexArr = item.concatKey.map(item=>this.form.fields[nameArr.indexOf(item)].key);
                    item.indexType = item.concatKey.length<2?'single':'multi';
                })
            })
        },
        handleRemove(index){
            this.form.fields.splice(index,1);
            this.computeConcatKeyIndex();
        }
    }
}
</script>

<style scoped lang="scss">
.form{
    :deep(.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item){
        margin-bottom:15px;
    }
}
</style>