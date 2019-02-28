import BMap from 'BMap'
import Events from '@/utils/eventListener.js'
import MapLike from '@/utils/typeExtend/MapLike.js'

const eventsType = ['search', 'searchComplete']
function SearchControl() {
  // 设置默认停靠位置和偏移量
  this.defaultAnchor = 0
  this.defaultOffset = new BMap.Size(10, 10)
  this.events = eventsType.reduce((map, type) => {
    return map.set(type, new Events('type'))
  }, new MapLike())
}

// 通过JavaScript的prototype属性继承于BMap.Control
SearchControl.prototype = new BMap.Control()

SearchControl.prototype.initialize = function(map) {
  // 创建一个DOM元素
  const input = document.createElement('input')
  input.id = `search_${Date.now()}`
  this.target = input.id
  // 设置样式
  input.style.textIndent = '10px'
  input.style.zIndex = '5000'
  input.style.width = 'auto'
  input.style.height = '35px'
  input.className = 'el-input__inner'
  input.placeholder = '请输入位置'
  // 绑定事件，点击一次放大两级
  // 添加DOM元素到地图中
  map.getContainer().appendChild(input)
  this.initSearch(map)
  return input
}
// 初始化搜索提示
SearchControl.prototype.initSearch = function(map) {
  this.search = new BMap.Autocomplete({
    input: this.target,
    location: map
  })
  this.bindEvents(map)
}
// 搜索提示事件绑定
SearchControl.prototype.bindEvents = function(map) {
  this.search.addEventListener('onhighlight', (e) => {
  })
  this.search.addEventListener('onconfirm', (e) => {
    const _value = e.item.value
    const value = _value.province + _value.city + _value.district + _value.street + _value.business
    this.searchPlace(value, map)
  })
}
// 执行搜索
SearchControl.prototype.searchPlace = function(place, map) {
  const __self = this
  const local = new BMap.LocalSearch(map, { // 智能搜索
    onSearchComplete: () => {
      const pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
      __self.events.searchComplete.trigger(pp)
      map.centerAndZoom(pp, 18)
      map.addOverlay(new BMap.Marker(pp)) // 添加标注
    }
  })
  local.search(place)
}
SearchControl.prototype.addEventListener = function(type, fn) {
  this.events[type].on(fn)
}
export default SearchControl
