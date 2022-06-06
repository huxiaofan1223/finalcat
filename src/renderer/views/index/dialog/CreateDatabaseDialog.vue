<template>
    <el-dialog
    title="新增数据库"
    :visible.sync="visible"
    width="380px"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px" label-position="left" class="demo-configForm" @submit.native.prevent @keypress.enter.native="handleSubmit('form')">
        <el-form-item label="数据库名" prop="name">
        <el-input size="mini" v-model="form.name" placeholder="数据库名"></el-input>
        </el-form-item>
        <el-form-item label="排序规则" prop="collateVal">
            <collate-select v-model="form.collateVal" :charset="form.charset"></collate-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmit('form')" size="mini" :loading="loading">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
import CollateSelect from '../../components/CollateSelect';
const defaultForm = {
    name:'',
    collateVal:'utf8mb4_general_ci',
    charset:''
}
export default {
    components:{
        CollateSelect
    },
    props:{
        form:{
            type:Object,
            required:true
        },
        visible:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            editFlag:false,
            loading:false,
            rules:{
                name: [
                { required: true, message: '请输入数据库名', trigger: 'blur' },
                ],
                collateVal: [
                { required: true, message: '请选择排序规则', trigger: 'change' },
                ]
            },
        }
    },
    methods:{
        getEditMode(){
            return this.editFlag;
        },
        setEditMode(val){
            this.editFlag = val;
        },
        startLoading(){
            this.loading = true;
        },
        stopLoading(){
            this.loading = false;
        },
        handleSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.$emit('handleCreateDatabaseSubmit',this.form);
                }
            })
        },
        handleClose(){
            this.$emit('update:form',this.deepClone(defaultForm));
            this.$emit('update:visible',false);
            this.$nextTick(()=>{
                this.$refs.form.resetFields();
                this.setEditMode(false);
            })
        }
    }
}
</script>