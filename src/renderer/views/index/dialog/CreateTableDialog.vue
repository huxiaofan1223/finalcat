<template>
      <el-dialog
        title="新建表"
        :visible.sync="createTableDialogVisible"
        width="1200px"
        :before-close="handleClose">
            <el-form size="mini" label-position="top">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="表名" prop="tableName">
                            <el-input v-model="form.tableName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="padding-bottom:10px;">
                    <el-col :span="4">名字</el-col>
                    <el-col :span="4">类型</el-col>
                    <el-col :span="2">长度</el-col>
                    <el-col :span="4">默认</el-col>
                    <el-col :span="4">排序规则</el-col>
                    <el-col :span="1">可为空</el-col>
                    <el-col :span="1">自增</el-col>
                    <el-col :span="4">备注</el-col>
                </el-row>
                <el-row v-for="item in form.fields" :key="item.key" style="text-align:center;">
                    <el-col style="padding-right:10px;" :span="4">
                        <el-form-item>
                            <el-input v-model="item.COLUMN_NAME" placeholder="名字"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="4">
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
                            <el-input v-model="item.COLUMN_DEFAULT" placeholder="默认"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="4">
                        <el-form-item>
                            <collate-select v-model="form.COLLATION_NAME" placeholder="排序规则"></collate-select>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.IS_NULLABLE" placeholder="可为空"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col style="padding-right:10px;" :span="1">
                        <el-form-item>
                            <el-checkbox v-model="item.AI" placeholder="自增"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="item.Comment" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
                            DATA_TYPE:'',
                            CHARACTER_MAXIMUM_LENGTH:'',
                            COLUMN_DEFAULT:'',
                            COLLATION_NAME:'',
                            IS_NULLABLE:'YES',
                            EXTRA:'',
                            AI:false,
                            Comment:''
                        },
                        {
                            key:new Date().getTime(),
                            COLUMN_NAME:'',
                            DATA_TYPE:'',
                            CHARACTER_MAXIMUM_LENGTH:'',
                            COLUMN_DEFAULT:'',
                            COLLATION_NAME:'',
                            IS_NULLABLE:'YES',
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

        }
    },
    methods:{
        handleClose(){
            this.$emit('update:createTableDialogVisible',false);
        },

    }
}
</script>

<style scoped lang="scss">

</style>