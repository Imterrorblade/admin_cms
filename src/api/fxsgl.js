import qs from 'qs'
import request from '@/utils/request'
// 得到分销商的二维码
export function getQrCode(distributor_id) {
  var url = '/api/cms/marketing/getQrCode?distributor_id=' + distributor_id
  console.log('useqrcode', url)
  window.open(url)
}
export function createArticle(query) {
  const data = qs.stringify(query)
  return request({
    url: 'cms/marketing/addDistributor',
    method: 'post',
    data
  })
}
export function updateArticle(query) {
  const data = qs.stringify(query)
  console.log('发送的数据是：', data)
  return request({
    url: 'cms/marketing/addDistributor',
    method: 'post',
    data
  })
}
export function delArticle(id) {
  const data = qs.stringify({
    id
  })
  return request({
    url: 'cms/marketing/delDistributor',
    method: 'post',
    data
  })
}
export default {
  // fetchList,
  createArticle,
  updateArticle,
  delArticle
}
