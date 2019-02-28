import MapLike from '@/utils/typeExtend/MapLike.js'

/**
 *
 *
 * @class Action
 * @extends {MapLike}
 */
class Action extends MapLike {
  constructor(type) {
    super(type)
    this.type = type
    this.service // Service 类型
  }

  /**
   *
   *
   * @param {*} service
   * @returns
   * @memberof Action
   */
  setService(service) {
    return this.set('service', service)
  }
  getService() {
    return this.get('service')
  }
  checkFn(fn) {
    if (fn && typeof fn === 'function') {
      return true
    } else {
      throw new Error('the param fn is not a function type in the methond checkFn')
    }
  }
  // subscribe(fn) {
  //   if (fn && typeof fn === 'function') {
  //     return this.set('callback', fn)
  //   } else {
  //     throw new Error('the method of subscribe need a param "fn" that must to be a function type')
  //   }
  // }
  fire(data) {
    if (this.get('beforeFireFn')) {
      this.beforeFireFn()
    }
    this.fetch(data)
    if (this.get('afterFireFn')) {
      this.afterFireFn()
    }
    return this
  }
  async fetch(data) {
    try {
      const res = await this.service.fetch(data)
      if (this.get('beforeRenderFn')) {
        this.beforeRenderFn(res)
      }
      if (this.get('renderFn')) {
        this.renderFn(res)
      }
      if (this.get('afterRenderFn')) {
        this.afterRenderFn(res)
      }
    } catch (err) {
      console.log(err)
    }
  }
  render(fn) {
    this.checkFn(fn)
    return this.set('renderFn', fn)
  }
  beforeFire(fn) {
    this.checkFn(fn)
    return this.set('beforeFireFn', fn)
  }
  afterFire(fn) {
    this.checkFn(fn)
    return this.set('afterFireFn', fn)
  }
  beforeRender(fn) {
    this.checkFn(fn)
    return this.set('beforeRenderFn', fn)
  }
  afterRender(fn) {
    this.checkFn(fn)
    return this.set('afterRenderFn', fn)
  }
}
export default Action
