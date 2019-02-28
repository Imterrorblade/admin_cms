import btnAction from '@/config/btnAction.js'
import store from '@/store/index.js'

const freeBtns = ['search', 'detail']
const permissionCheck = window.permissionCheck
export default {
  getBtns(btns) {
    if (permissionCheck.isCheckBtns()) {
      this.getBtns = function(btns) { // 按钮权限校验
        const btnsPermission = store.getters.btnPermission.map(btn => {
          return btn.rightCode
        })
        return btns.map(key => {
          if (typeof btnAction[key] === 'object') {
            return {
              action: key,
              label: btnAction[key].label,
              icon: btnAction[key].icon,
              type: btnAction[key].type
            }
          } else {
            return {
              action: key,
              label: btnAction[key]
            }
          }
        }).filter(btn => {
          if (freeBtns.indexOf(btn.action) > -1) {
            return true
          }
          if (btnsPermission.indexOf(btn.action) > -1) {
            return true
          }
          return false
        })
      }
    } else { // 按钮权限不校验
      this.getBtns = function(btns) {
        return btns.map(key => {
          if (typeof btnAction[key] === 'object') {
            return {
              action: key,
              label: btnAction[key].label,
              icon: btnAction[key].icon,
              type: btnAction[key].type
            }
          } else {
            return {
              action: key,
              label: btnAction[key]
            }
          }
        })
      }
    }
    return this.getBtns(btns)
  }
}
