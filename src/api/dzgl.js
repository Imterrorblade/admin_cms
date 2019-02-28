import qs from 'qs'
import request from '@/utils/request'
// 结算管理
export function fetchList(query) {
  const data = qs.stringify(query)
  return new Promise((resolve, reject) => {
    return request({
      url: 'cms/marketing/Checkbalance',
      method: 'POST',
      data: data
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
// 导出对账
export function getDzgl(query) {
  var string = ''
  for (var key in query) {
    string += key + '=' + query[key] + '&'
  }
  var url = '/api/cms/marketing/ExportCheckbalance?' + string
  console.log(url)
  location.href = url
}
export default {
  fetchList,
  getDzgl
}
