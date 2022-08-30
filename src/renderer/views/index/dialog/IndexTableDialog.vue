<template>
    <el-dialog
    title="索引"
    :visible.sync="visible"
    width="900px"
    :before-close="handleClose"
    append-to-body>
        <el-table :data="tableData" border>
            <el-table-column label="键名" prop="Key_name"></el-table-column>
            <el-table-column label="类型" prop="Index_type"></el-table-column>
            <el-table-column label="唯一">
                <template slot-scope="scope">
                    {{scope.row.Non_unique===0?'是':'否'}}
                </template>
            </el-table-column>
            <el-table-column label="字段" prop="Column_name"></el-table-column>
            <el-table-column label="基数" prop="Cardinality"></el-table-column>
            <el-table-column label="排序规则" prop="Collation"></el-table-column>
            <el-table-column label="空" prop="NULL"></el-table-column>
            <el-table-column label="注释" prop="Comment"></el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleRemove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <indexes-dialog 
            :visible.sync="indexDialogVisible" 
            :indexType="indexType"
            :isSingle.sync="isSingle"
            :concatKeyGroup="concatKeyGroup"
            :indexName.sync="indexName"
            @submit="handleIndexConfirm"
            @cancel="handleIndexCancel"
            ref="IndexesDialog">
        </indexes-dialog>
    </el-dialog>
</template>

<script>
export default {
    props:{
        visible:{
            type:Boolean,
            required:true
        },
        tableData:{
            type:Array,
            required:true
        }
    },
    data(){
        return {
            indexType:'',
            concatKeyGroup:'',
            indexName:'',
            isSingle:'',
            indexDialogVisible:''
        }
    },
    methods:{
        getIndexType(row){
            if(row.Key_name==='PRIMARY'){
                return '';
            }
            if(row.Non_unique === 1){
                return 'UNIQUE'
            }
            if(row.Index_type === 'FULLTEXT'){
                return 'FULLTEXT'
            }
            if(row.Index_type === 'FULLTEXT'){
                return 'FULLTEXT'
            }
        },
        handleIndexConfirm(){

        },
        handleIndexCancel(){

        },
        handleEdit(row){
            console.log(row);
        },
        handleClose(){
            this.$emit('update:visible',false);
        },
        handleRemove(row){
            this.$confirm(`是否删除索引${this.formatVal(row.Key_name)}？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {
                this.$emit('handleRemoveIndex',row.Key_name);
            })
        }
    }
}
</script>


<style scoped lang="scss">

</style>