<template>
    <el-dialog
    title="索引编辑"
    :visible.sync="visible"
    width="380px"
    :before-close="handleClose"
    append-to-body>
        <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item label="索引类型" v-if="indexType!=='PRIMARY'">
                <el-radio-group v-model="indexType3" @change="handleChange">
                    <el-radio label="single">单列索引</el-radio>
                    <el-radio label="multi" :disabled="indexGroup.length===0">复合索引</el-radio>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="复合索引" v-if="indexType3==='multi'">
                <el-radio-group v-model="concatKey">
                    <el-radio v-for="(item,index) in indexGroup" :key="index" :label="item">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="索引名称">
                <el-input :value="indexType==='PRIMARY'?'PRIMARY':indexName" @input="hanldeIndexNameInput" placeholder="索引名称" :readonly="indexType==='PRIMARY'"></el-input>
            </el-form-item>
            <el-form-item label="索引选择">
                {{indexType}}
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="mini">取 消</el-button>
            <el-button type="primary" native-type="submit" @click="handleSubmit" size="mini">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props:{
        visible:{
            type:Boolean,
            required:true
        },
        indexType:{
            type:String,
            required:true
        },
        indexType2:{
            type:String,
            required:true
        },
        indexGroup:{
            type:Array,
            required:true
        },
        indexName:{
            type:String,
            required:true
        }
    },
    watch:{
        indexType2(val){
            this.indexType3 = val;
        }
    },
    data(){
        return {
            indexType3:this.indexType2,
            indexArr:[],
            concatKey:''
        }
    },
    methods:{
        handleConcatKeyChange(val){
            this.$emit('update:',val);
        },
        hanldeIndexNameInput(val){
            this.$emit('update:indexName',val);
        },
        handleChange(val){
            this.$emit('update:indexType2',val);
        },
        handleClose(){
            this.$emit('handleRecoveryBak');
            this.$emit('update:visible',false);
        },
        handleSubmit(){
            this.$emit('submit',this.deepClone([this.indexName,this.indexType3,this.concatKey,this.indexType]));
            this.$nextTick(()=>{
                this.concatKey = '';
            })
            this.$emit('update:visible',false);
        }
    }
}
</script>


<style scoped lang="scss">

</style>