<template>
    <el-dialog
    :title="editFlag?'编辑配置':'新增配置'"
    :visible.sync="visible"
    width="380px"
    :before-close="handleClose">
    <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="55px" label-position="left" @submit.native.prevent @keypress.enter.native="handleSubmit('form')">
        <el-form-item label="名称" prop="name">
            <el-input size="small" v-model="form.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-row>
        <el-col :span="14">
            <el-form-item label="地址" prop="host">
            <el-input size="small" v-model="form.host" placeholder="地址"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="10">
            <el-form-item label="端口" prop="port">
            <el-input size="small" v-model.number="form.port" placeholder="端口"></el-input>
            </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="账号" prop="user">
        <el-input size="small" v-model="form.user" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
        <el-input size="small" type="password" v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="mini">取 消</el-button>
        <el-button type="primary" native-type="submit" @click="handleSubmit('form')" size="mini" :loading="loading">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
const defaultForm = {
    name:"",
    host: "",
    port: 3306,
    user: "",
    password: "",
    database: ""
}
export default {
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
            loading:false,
            rules: {
                name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                host: [
                { required: true, message: '请输入地址', trigger: 'blur' },
                ],
                port: [
                { required: true, message: '请输入端口', trigger: 'blur' },
                ],
                user: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                ]
            },
            editFlag:false
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
                    if(!this.editFlag){
                        if(this.isConfigExist(this.form)){
                            this.$message.error('配置已存在');
                            return;
                        }
                        this.loading = true;
                        this.$emit('handleCreateOptionSubmit',this.form);
                    } else {
                        this.loading = true;
                        this.$emit('handleCreateOptionSubmit',this.form);
                    }
                }
            })
        },
        handleClose(){
            this.$refs.form.resetFields();
            this.loading = false;
            this.$nextTick(()=>{
                const form = this.deepClone(defaultForm);
                this.$emit('update:form',form);
                this.$emit('update:visible',false);
                this.editFlag = false;
            })
        },
        isConfigExist(config){
            let temp = this.deepClone(config);
            delete temp.name;
            return this.$store.state.Db.dbList.map(item=>{
            let tempItem = this.deepClone(item);
            delete tempItem.name;
            return JSON.stringify(tempItem);
            }).indexOf(JSON.stringify(temp)) !== -1;
        }
    }
}
</script>