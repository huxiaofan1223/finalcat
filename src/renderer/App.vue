<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'download_tools'
  }
</script>

<style>
  /* CSS */
  html,body{
    margin:0;
    padding:0;
    font-family: PingFangSC-Medium, PingFang SC, 微软雅黑;
  }
  *{
    box-sizing:border-box;
  }
  .flex{
    display: flex;
  }
  .items-center{
    display: flex;
    align-items: center;
  }
  .justify-center{
    display: flex;
    justify-content: center;
  }
  .between{
    display: flex;
    justify-content: space-between
  }
  .expand{
    display: flex;
    flex:1;
  }
  .padding10{
    padding:10px;
  }
  .flex-right{
    display: flex;
    justify-content: flex-end;
  }
</style>
