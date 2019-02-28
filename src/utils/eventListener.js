// 事件类
class Events {
  constructor(type) {
    this.type = type
    this.callbacks = []
  }
  checkFn(fn) {
    if (fn && typeof fn === 'function') {
      return true
    } else {
      throw new Error('the param fn is not function')
    }
  }
  init() {
    // do something init
  }
  on(fn) {
    this.checkFn(fn)
    this.callbacks.push(fn)
  }
  unbind(fn) {
    this.checkFn(fn)
    const _index = this.callbacks.findIndex(item => {
      return item === fn
    })
    if (_index > -1) {
      this.callbacks.splice(_index, 1)
    }
  }
  unbindAll() {
    this.callbacks = []
  }
  trigger(...params) {
    this.callbacks.map(fn => {
      fn(...params)
    })
  }
}
export default Events
