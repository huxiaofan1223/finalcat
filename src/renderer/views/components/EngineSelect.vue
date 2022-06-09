<template>
  <el-select :value="value" @change="handleChange" style="width:100%;" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="option in options" :key="option" :value="option" :label="option"></el-option>
  </el-select>
</template>

<script>
export default {
  props:{
    value:{
      type:String,
      default:'int'
    }
  },
  data(){
    return {
      options:['InnoDB','MRG_MYISAM','MEMORY','BLACKHOLE','MyISAM','CSV','ARCHIVE']
    }
  },
  methods:{
    handleChange(val){
      this.$emit('input',val);
    }
  }
}
</script>