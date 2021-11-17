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
    color: #3F536E;
    line-height: 1.3;
    font-family: -apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  *{
    box-sizing:border-box;
    padding:0;
    margin:0;
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
  .el-button{
    border-radius:1px !important;
  }
  .el-button.is-circle{
    border-radius: 50% !important;
  }
  .el-message__content{
    line-height: 1.3!important;
  }
  .el-input__inner{
    border-radius:1px!important;
    padding:0 8px !important;
  }
  .el-dialog__body{
    padding:0 15px!important;
  }

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar
{
	width: 8px;
	height: 8px;
	background-color: #F5F5F5;
}
 
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
	/* border-radius: 10px; */
	background-color: white;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
	border-radius: 4px;
	background-color: #999999;
}
</style>
