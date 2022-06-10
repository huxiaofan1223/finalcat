

<template>
  <div id="monaco"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';

function noop() { }
export default {
  props:{
    value:{type:String,required:true}
  },
  methods:{

  },
  data(){
    return {
      monacoInstance:null
    }
  },
  watch:{
    value(val){
      if(val!==this.monacoInstance.getValue()){
        this.monacoInstance.setValue(val);
      }
    }
  },
  mounted(){
    const value = this.value;
    this.monacoInstance = monaco.editor.create(document.getElementById("monaco"),{
        value,
        language:"sql",
        automaticLayout: true
    });
    this.monacoInstance.onDidChangeModelContent(event => {
          this.$emit('input',this.monacoInstance.getValue());
    });
  }
}

</script>

<style scoped>
#monaco{
    border:1px solid #f7f7f7;
    padding:1rem 0;
    height:30%;
}
</style>