import Vue from 'vue'
import ShowSqlDialog from './ShowSqlDialog.vue'
let instance
let iscoexist
const PopupBox = Vue.extend(ShowSqlDialog)
ShowSqlDialog.install = function (data) {
  if (data.coexist) {
    iscoexist = new PopupBox({
      data
    }).$mount()
    document.body.appendChild(iscoexist.$el)
    Vue.nextTick(() => {
      iscoexist.dialogPopVisible = true
    })
  } else {
    if (iscoexist) {
      iscoexist.dialogPopVisible = false
      document.body.removeChild(iscoexist.$el)
      iscoexist = null
    }
    if (instance) {
      instance.dialogPopVisible = false
      document.body.removeChild(instance.$el)
      instance = null
    }
    instance = new PopupBox({
      data
    }).$mount()
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.dialogPopVisible = true
    })
  }
}
export default ShowSqlDialog

