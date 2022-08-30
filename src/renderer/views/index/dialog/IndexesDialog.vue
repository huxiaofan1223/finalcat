<template>
    <el-dialog
    title="索引编辑"
    :visible.sync="visible"
    width="380px"
    :before-close="handleClose"
    append-to-body>
        <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item label="索引" v-if="indexType!=='PRIMARY'">
                <el-radio-group v-model="isSingle2" @change="handleChange">
                    <el-radio label="single">单列索引</el-radio>
                    <el-radio label="multi" :disabled="concatKeyGroup.length===0">复合索引</el-radio>
                </el-radio-group>

            </el-form-item>
            <el-form-item label="复合索引" v-if="isSingle2==='multi'">
                <el-radio-group v-model="concatKey">
                    <el-radio v-for="(item,index) in concatKeyGroup" :key="index" :label="item">{{item}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="索引类型">
                <el-input :value="indexType==='PRIMARY'?'PRIMARY':indexName" @input="hanldeIndexNameInput" placeholder="索引类型" :readonly="indexType==='PRIMARY'"></el-input>
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
        isSingle:{
            type:String,
            required:true
        },
        concatKeyGroup:{
            type:Array,
            required:true
        },
        indexName:{
            type:String,
            required:true
        }
    },
    watch:{
        isSingle(val){
            this.isSingle2 = val;
        }
    },
    data(){
        return {
            isSingle2:this.isSingle,
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
            this.$emit('update:isSingle',val);
        },
        handleClose(){
            this.$emit('cancel');
            this.$emit('update:visible',false);
        },
        handleSubmit(){
            this.$emit('confirm',this.deepClone([this.indexName,this.isSingle2,this.concatKey,this.indexType]));
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