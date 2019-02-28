import MapLike from '@/utils/typeExtend/MapLike.js'
/**
 *
 *
 * @class Api
 */
class Api {
  constructor(api) {
    this.api = api
  }
  async fetch(data, interceptor) {
    return this.api(data, interceptor)
  }
}
/* 业务逻辑模块 */
/**
 *
 *
 * @class Service
 * @extends {MapLike}
 */
class Service extends MapLike {
  constructor(api) {
    super()
    if (api) {
      this.api = new Api(api)// 业务调用接口
    }
    this.featchInterceptorFn// 数据发送拦截器
    this.responseInterceptorFn// 数据返回结果拦截器
  }
  setApi(api) {
    return this.set('api', new Api(api))
  }
  async fetch(data) {
    try {
      const res = await this.api.fetch(data, this.featchInterceptorFn)
      return this.response(res)
    } catch (err) {
      console.log(err)
    }
  }
  response(res) {
    return new Promise((resolve, reject) => {
      try {
        if (res) {
          if (this.responseInterceptorFn) {
            res = this.responseInterceptorFn(res)
          }
          resolve(res)
        } else {
          reject('there is no response')
        }
      } catch (err) {
        reject(err)
      }
    })
  }
  checkFn(fn) {
    if (fn && typeof fn === 'function') {
      return true
    } else {
      throw new Error('the param fn is not a function type in the methond checkFn')
    }
  }
  featchInterceptor(fn) {
    this.checkFn(fn) && this.set('featchInterceptorFn', fn)
    return this
  }
  responseInterceptor(fn) {
    this.checkFn(fn) && this.set('responseInterceptorFn', fn)
    return this
  }
}
export default Service
