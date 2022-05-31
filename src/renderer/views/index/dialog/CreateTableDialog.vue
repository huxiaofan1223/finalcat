<template>
      <el-dialog
        title="新建表"
        :visible.sync="createTableDialogVisible"
        width="1200px"
        :before-close="handleClose">
            <el-form size="mini" label-position="top" :model="form" :rules="rules" ref="form">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="表名" prop="tableName">
                            <el-input v-model="form.tableName" placeholder="表名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-bottom:10px;">
                    <el-col :span="4">名字</el-col>
                    <el-col :span="2">类型</el-col>
                    <el-col :span="2">长度</el-col>
                    <el-col :span="4">默认</el-col>
                    <el-col :span="3">排序规则</el-col>
                    <el-col :span="3">属性</el-col>
                    <el-col :span="1">可为空</el-col>
                    <el-col :span="1">自增</el-col>
                    <el-col :span="4">备注</el-col>
                </el-row>
                <el-row v-for="(item,index) in form.fields" :key="item.key" style="text-align:center;">
                    <el-col style="padding-right:10px;" :span="4">
                        <el-form-item :prop="'fields.' + index + '.COLUMN_NAME'" :rules="{required: true, message: '字段名不能为空', trigger: 'blur'}">
                            <el-input v-model="item.COLUMN_NAME" placeholder="名字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <type-select v-model="item.DATA_TYPE" placeholder="类型"></type-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="2">
                        <el-form-item>
                            <el-input v-model="item.CHARACTER_MAXIMUM_LENGTH" placeholder="长度"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="4">
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
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.AI" placeholder="自增"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="padding-right:10px;">
                        <el-form-item>
                            <el-input v-model="item.Comment" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-button size="mini" type="danger" @click="handleRemove(index)" :disabled="index===0">删除</el-button>
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
      </el-dialog>

</template>


<script>
import TypeSelect from '../../components/TypeSelect';
import CollateSelect from '../../components/CollateSelect';
export default {
    components:{
        TypeSelect,
        CollateSelect
    },
    props:{
        form:{
            type:Object,
            default:()=>{
                return {
                    tableName:'',
                    fields:[
                        {
                            key:new Date().getTime(),
                            COLUMN_NAME:'',
                            DATA_TYPE:'INT',
                            CHARACTER_MAXIMUM_LENGTH:'',
                            COLUMN_DEFAULT:'',
                            COLLATION_NAME:'',
                            IS_NULLABLE:'NO',
                            EXTRA:'',
                            AI:false,
                            Comment:''
                        }
                    ]
                }
            }
        },
        createTableDialogVisible:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            rules:{
                tableName:[
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        item2Field(field){
            const extra = field.EXTRA === ''?'':field.EXTRA;
            const length = field.CHARACTER_MAXIMUM_LENGTH==='' ? '':`(${field.CHARACTER_MAXIMUM_LENGTH})`;
            const nullable = field.IS_NULLABLE==='YES'?'NULL':'NOT NULL';
            let defaultVal = field.COLUMN_DEFAULT === ''?'':`DEFAULT '${field.COLUMN_DEFAULT}'`;
            const collateVal = field.COLLATION_NAME === ''?'':`COLLATE field.COLLATION_NAME`;
            const ai = field.AI?'AUTO_INCREMENT':'';
            const comment = field.Comment===''?'':`COMMENT '${field.Comment}'`;
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
        handleClose(){
            this.$emit('update:createTableDialogVisible',false);
        },
        handleSubmit(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const sql = this.fields2Sql(this.form);
                    this.$emit('handleCreateTableSubmit',sql);
                }
            });
        },
        fields2Sql(form){
            const tableName = form.tableName;
            const fieldString = form.fields.map(item=>this.item2Field(item)).join(',');
            const primaryString = this.getPrimaryString(form.fields);
            return `CREATE TABLE ${tableName} (${fieldString} ${primaryString})`;
        },
        handleSee(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    const sql = this.fields2Sql(this.form);
                    this.$message({
                        duration:100000,
                        showClose:true,
                        message:sql
                    })
                }
            });
        },
        handleAddField(){
            const field = {
                key:new Date().getTime(),
                COLUMN_NAME:'',
                DATA_TYPE:'INT',
                CHARACTER_MAXIMUM_LENGTH:'',
                COLUMN_DEFAULT:'',
                COLLATION_NAME:'',
                IS_NULLABLE:'NO',
                EXTRA:'',
                AI:false,
                Comment:''
            }
            this.form.fields.push(field);
        },
        handleRemove(index){
            console.log(index);
            this.form.fields.splice(index,1);
        }
    }
}
</script>

<style scoped lang="scss">

</style>