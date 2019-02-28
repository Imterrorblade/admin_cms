import qs from 'qs'
import store from '@/store'
import request from '@/utils/request'

export function fetchPublic(url, data, method = 'POST', headers) {
  return request({
    url: url,
    headers,
    method: method,
    data
  })
}

export function fetchFormPublic(url, data, method = 'POST', headers = {
  'Content-type': 'application/x-www-form-urlencoded'
}) {
  const formdata = new FormData()
  Object.keys(data).map(key => {
    formdata.append(key, data[key])
    console.log(key)
  })
  console.log(formdata)
  return request({
    url: url,
    headers,
    method: method,
    data: formdata
  })
}
export function fetchList(query) {
  const data = qs.stringify(query)

  return new Promise((resolve, reject) => {
    return request({
      url: '/layui/table/list_new',
      method: 'POST',
      data
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function fetchDetail({ resource_name, id }) {
  const data = {
    resource_name,
    id
  }
  return request({
    url: '/layui/table/detail',
    method: 'get',
    params: data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function fetchImages(parent_id) {
  const data = qs.stringify({
    parent_id
  })
  return request({
    url: 'cms/images/get_remote_data',
    method: 'post',
    data
  })
}
export function createArticle(query) {
  const data = qs.stringify(query)
  return request({
    url: '/layui/table/save',
    method: 'post',
    data
  })
}

export function updateArticle(query) {
  const data = qs.stringify(query)
  return request({
    url: '/layui/table/save',
    method: 'post',
    data
  })
}

export function delArticle({ resource_name, id }) {
  const data = qs.stringify({
    resource_name,
    id
  })
  return request({
    url: '/layui/table/delete',
    method: 'post',
    data
  })
}

// 更新攻略详情
export function updateTravelGuide(data) {
  return request({
    url: '/commerce/api/travelsCtl/saveStrategy',
    method: 'post',
    data: data
  })
}

export function getTravelGuide(data) {
  return request({
    url: '/commerce/api/travelsCtl/getStrategyDetail',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 更新字典
export function updateDictionary(data) {
  return request({
    url: '/cms/dictionary/addNewItem',
    method: 'post',
    data: data
  })
}

export function getBtnRoles(resource_name, blackListBtn = ['add', 'edit', 'del']) {
  // 初步筛选出当前页面的按钮配置
  const list = store.getters.btnRoles.filter(item => { return item.url === resource_name })

  const roles = { // 定义基础按钮权限
    add: true, // 创建
    edit: true, // 编辑
    del: true, // 删除
    search: true, // 搜索
    export: true, // 导出
    view: true // 查看详情
  }
  // 依据黑名单,计算出实际按钮权限
  blackListBtn.map((item) => {
    roles[item] = list.filter(item_list => { return item_list.name === item }).length > 0
  })

  return new Promise((resolve, reject) => {
    resolve(roles)
  })
}

export default {
  fetchPublic,
  fetchFormPublic,
  fetchList,
  fetchDetail,
  fetchPv,
  fetchImages,
  createArticle,
  updateArticle,
  delArticle,
  getBtnRoles,
  updateTravelGuide,
  updateDictionary,
  getTravelGuide
}
