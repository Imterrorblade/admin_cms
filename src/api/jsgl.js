import qs from 'qs'
import request from '@/utils/request'
// 结算管理
export function fetchList(query) {
  const data = qs.stringify(query)
  return new Promise((resolve, reject) => {
    return request({
      url: 'cms/marketing/settlementManagement',
      method: 'POST',
      data: data
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}// 分阶添加
export function createArticle(query) {
  const data = qs.stringify(query)
  return request({
    url: 'cms/marketing/addSublevel',
    method: 'post',
    data
  })
}// 分阶修改
export function updateArticle(query) {
  const data = qs.stringify(query)
  console.log('发送的数据是：', data)
  return request({
    url: 'cms/marketing/addSublevel',
    method: 'post',
    data
  })
}
// 结算管理导出功能
export function jsexplot(query) {
  var string = ''
  for (var key in query) {
    string += key + '=' + query[key] + '&'
  }
  var url = '/api/cms/marketing/settlementManagementExcel?' + string
  console.log(url)
  location.href = url
}
// 根据区域ID显示回显数据
export function fetchByAreDetail(params) {
  console.log('转换成的json对象:' + params)
  return new Promise((resolve, reject) => {
    return request({
      url: 'layui/table/term_detail',
      method: 'get',
      params
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
export default {
  fetchList,
  createArticle,
  updateArticle,
  jsexplot,
  fetchByAreDetail
}
