<template>
  <!-- 封装弹框 -->
  <el-dialog
    custom-class="DialogPopup"
    :title="dialogTitle"
    :visible.sync="dialogPopVisible"
    :width="popupWidth"
    :before-close="onBeforeClose">
    <div v-highlight>
        <pre><code v-html="code" class="language-sql" style="background:rgb(246,248,250);padding:16px;line-height:1.3;"></code></pre>
    </div>
    <div style="text-align: right;margin-top:20px;"><el-button type="primary" @click="Save" size="mini">确 定</el-button></div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DialogPopup',
  data () {
    return {
      title: '',
      dialogPopVisible: false,
      width: '1000px'
    }
  },
  computed: {
    popupWidth: function () {
      return this.width || '550px'
    },
    dialogTitle: function () {
      return this.title || '标题'
    }
  },
  methods: {
    Cancel () {
      this.dialogPopVisible = false
      this.cancelClick()
    },
    Save () {
      this.dialogPopVisible = false
    //   this.saveClick(this.option)
    },
    onBeforeClose (done) {
      done()
    }
  }
}
</script>

<style lang="scss">

</style>

