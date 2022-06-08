<template>
  <el-select :value="value" @change="handleChange" style="width:100%;" v-bind="$attrs" filterable>
    <el-option v-for="option in $store.state.Db.CollateOptions" :key="option.Collation" :value="option.Collation" :label="option.Collation"></el-option>
  </el-select>
</template>

<script>
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
  model: {
    prop: 'value',
    event: 'change'
  },
  // watch:{
  //   charset:{
  //     immediate:true,
  //     handler(val){
  //       if(this.value){
  //         return;
  //       }
  //       if(this.isEmpty(val)){
  //         return;
  //       } else {
  //         const filterArr = this.options.filter(item=>item.Charset===val);
  //         this.$emit('change',filterArr[0].Collation);
  //       }
  //     }
  //   }
  // },
  methods:{
    handleChange(val){
      this.$emit('change',val);
    }
  }
}
</script>