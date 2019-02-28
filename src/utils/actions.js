import btnAction from '@/config/btnAction.js'
const actionsType = Object.keys(btnAction).concat(Object.keys(btnAction).map(key => {
  return `click_${key}`
}))

class Actions {
  constructor() {
    this.actions = actionsType.reduce((pre, cur) => {
      pre[cur]
      return pre
    }, {})
  }
  checkType(type) {
    if (actionsType.includes(type)) {
      return true
    } else {
      throw new Error(`the ${type} type is not defined in class Actions`)
    }
  }
  fire(type, data) {
    // this.actions[type].map(fn => {
    //   fn && fn(data)
    // })
    this.actions[type] && this.actions[type](data)
  }
  subscribe(type, fn) {
    this.checkType(type)
    if (fn && typeof fn === 'function') {
      this.actions[type] = fn
    } else {
      throw new Error(`the param ${fn} must be a function type`)
    }
  }
  unsubscribe(type, fn) {
    this.checkType(type)
    this.actions[type] = undefined
    // if (this.actions[type].includes(fn)) {
    //   this.actions[type].splice(this.actions[type].findIndex(item => item === fn), 1)
    // }
  }
  unsubscribeAll(type) {
    this.checkType(type)
    this.actions[type] = undefined
  }
}
export default Actions
