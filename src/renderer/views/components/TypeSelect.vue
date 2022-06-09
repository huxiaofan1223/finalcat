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
      options:[]
    }
  },
  mounted(){
    setTimeout(() => {
      this.options = Object.freeze(["int", "bigint", "varchar", "text", "date", "datetime", "tinyint", "smallint", "float", "double", "decimal", "char", "tinyblob", "tinytext", "blob", "mediumblob", "mediumtext", "longblob", "longtext", "time", "year", "timestamp"]);
    },0);
  },
  methods:{
    handleChange(val){
      this.$emit('input',val);
    }
  }
}
</script>