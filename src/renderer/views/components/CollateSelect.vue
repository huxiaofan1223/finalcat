<template>
  <el-select :value="value" @change="handleChange" style="width:100%;" v-bind="$attrs" filterable v-on="$listeners">
    <el-option v-for="option in options" :key="option.Collation" :value="option.Collation" :label="option.Collation"></el-option>
  </el-select>
</template>

<script>
import {CollateOptions} from '../../utils/utils'
export default {
  props:{
    value:{
      type:String|null,
      required:true
    },
    charset:{
      type:String,
      default:''
    }
  },
  data(){
    return {
      options:[]
    }
  },
  mounted(){
    setTimeout(() => {
      this.options = Object.freeze(CollateOptions);
    },0);
  },
  methods:{
    handleChange(val){
      this.$emit('input',val);
    }
  }
}
</script>