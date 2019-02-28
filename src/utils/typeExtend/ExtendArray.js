// 定义原型的方法
const methods = {
  constructor: ExtendArray,
  replace(fn, item) {
    const index = this.findIndex(fn)
    this.splice(index, 1, item)
    return this
  },
  findAndReplace(fn, item) {
    const index = this.findIndex(fn)
    this.splice(index, 1, item)
    return this
  },
  findAndMerge(fn, item) {
    const index = this.findIndex(fn)
    Object.assign(this[index], item)
    return this
  }
}

// 数组继承类，解决babel 不能处理es6直接继承原生数组的问题
function ExtendArray(...param) {
  // 注意这里调用 Array.call(this, ...param)没有将数组的属性复制到我的this 实例上，具体原因不太清除
  const arr = new Array(...param)
  // 继承数组实例的属性
  Object.assign(this, arr)
  Object.defineProperty(this, 'length', {
    value: arr.length,
    enumerable: false// 定义length属性为不可枚举
  })
}
const prototype = Object.create(Array.prototype)
// 定义原型上的方法， 并且不能枚举
Object.keys(methods).map(key => {
  Object.defineProperty(prototype, key, {
    value: methods[key],
    enumerable: false// 不可枚举
  })
})
// 设定原型
ExtendArray.prototype = prototype

export default ExtendArray
