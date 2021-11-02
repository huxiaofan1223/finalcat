<template>
  <div class="main">
      <div class="app-left">
        左边123456
      </div>
      <div class="app-right">
        <div id="monaco">
        </div>
      </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
export default {
    data(){
        return {
          monacoInstance:null
        }
    },
    mounted(){
      this.monacoInstance = monaco.editor.create(document.getElementById("monaco"),{
          value:`select * from users`,
          language:"sql"
      })
    },
    methods:{
      
    }
}
</script>

<style scoped lang="scss">
.main{
  display: flex;
  padding:1rem;
  min-height:100vh;
  .app-left{
    min-height:100vh;
    flex:1;
  }
  .app-right{
    min-height:100vh;
    flex:3;
    #monaco{
      min-height:100px;
      border:1px solid #999999;
      padding:1rem 0;
    }
  }
}
</style>