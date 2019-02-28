/**
 * Proxy部分兼容处理
 * 仅支持代理 处理get, set
 * @author chunliang yang
 */

const Proxy = window.Proxy || class Proxy {
  constructor(target, handler) {
    this.init(target, handler)
    this.defineProperty()
  }
  init(target, handler) {
    Object.defineProperties(this, {
      __target: {
        value: target,
        enumerable: false
      },
      __handler: {
        value: handler,
        enumerable: false
      }
    })
  }
  defineProperty() {
    Object.keys(this.__target).map(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.__handler.get(this.__target, key, this)
        },
        set(value) {
          return this.__handler.set(this.__target, key, value, this)
        },
        enumerable: true
      })
    })
  }
}

export default Proxy
