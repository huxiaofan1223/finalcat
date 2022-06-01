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
      default:'INT'
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
        'INT','BIGINT','VARCHAR','TEXT','DATE','DATETIME',

        'TINYINT','SMALLINT','FLOAT','DOUBLE','DECIMAL',
        
        'CHAR','TINYBLOB','TINYTEXT','BLOB','MEDIUMBLOB','MEDIUMTEXT','LONGBLOB','LONGTEXT',

        'TIME','YEAR','TIMESTAMP',
      ].map(item=>item.toLowerCase())
    }
  },
  methods:{
    handleChange(val){
      this.$emit('change',val);
    }
  }
}
</script>