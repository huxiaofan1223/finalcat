<template>
  <el-select :value="value" @change="handleChange" style="width:100%;" :placeholder="placeholder" v-bind="$attrs">
    <el-option v-for="option in options" :key="option" :value="option" :label="option"></el-option>
  </el-select>
</template>

<script>
export default {
  props:{
    value:{
      type:String,
      default:'int'
    },
    placeholder:{
      type:String,
      default:''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data(){
    return {
      options:['InnoDB','MRG_MYISAM','MEMORY','BLACKHOLE','MyISAM','CSV','ARCHIVE']
    }
  },
  methods:{
    handleChange(val){
      this.$emit('change',val);
    }
  }
}
</script>