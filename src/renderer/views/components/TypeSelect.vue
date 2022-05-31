<template>
  <el-select :value="value" @change="handleChange" style="width:100%;" :placeholder="placeholder">
    <el-option v-for="option in options" :key="option" :value="option" :label="option"></el-option>
  </el-select>
</template>

<script>
export default {
  props:{
    value:{
      type:String,
      required:true
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
      options:[
        'TINYINT','SMALLINT','INT','BIGINT','FLOAT','DOUBLE','DECIMAL',
        
        'CHAR','VARCHAR','TINYBLOB','TINYTEXT','BLOB','TEXT','MEDIUMBLOB','MEDIUMTEXT','LONGBLOB','LONGTEXT',

        'DATE','TIME','YEAR','DATETIME','TIMESTAMP',
      ]
    }
  },
  methods:{
    handleChange(val){
      this.$emit('change',val);
    }
  }
}
</script>