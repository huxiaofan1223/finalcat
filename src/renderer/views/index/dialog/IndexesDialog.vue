<template>
    <el-dialog
    title="索引编辑"
    :visible.sync="visible"
    width="380px"
    top="300px"
    :before-close="handleClose">
        <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item label="索引名称">
                <el-input v-model="form.name" placeholder="索引名称"></el-input>
            </el-form-item>
            <el-form-item label="索引选择">
                {{indexType}}
            </el-form-item>
        </el-form>
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
        }
    },
    data(){
        return {
            form:{
                name:''
            }
        }
    },
    methods:{
        handleClose(){
            this.$emit('update:visible',false);
        }
    }
}
</script>


<style scoped lang="scss">

</style>