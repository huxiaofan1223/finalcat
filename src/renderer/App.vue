<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'finalcat'
  }
</script>

<style>
  /* CSS */
  html,body{
    margin:0;
    padding:0;
    color:#444444;
    line-height: 1.3;
    font-family: PingFangSC-Regular, PingFang SC, 微软雅黑;
    font-size: 15px;
    font-weight: normal;
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
  .el-message{
    border-radius:0 !important;
    border:1px dashed transparent!important;
    padding:8px!important;
    min-width:150px!important;
  }
  .el-message__content{
    line-height: 1.3!important;
    font-size:12.5px!important;
  }
  .el-input__inner{
    border-radius:1px!important;
    padding:0 8px !important;
  }
  .el-dialog__body{
    padding:0 30px!important;
    padding-top:15px !important;
    padding-left:15px !important;
  }
  .el-message-box,.el-dialog{
    border-radius:1px !important;
    box-shadow:none!important;
    border:none!important;
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
