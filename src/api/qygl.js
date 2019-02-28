import qs from 'qs'
import request from '@/utils/request'
export function createArticle(query) {
  const data = qs.stringify(query)
  return request({
    url: '/cms/marketing/addArea',
    method: 'post',
    data
  })
}
export function updateArticle(query) {
  const data = qs.stringify(query)
  console.log('数据：', data)
  console.log('发送的数据是：', data)
  return request({
    url: '/cms/marketing/addArea',
    method: 'post',
    data
  })
}
export function delArticle(id) {
  const data = qs.stringify({
    id
  })
  return request({
    url: 'cms/marketing/delAreaDistributor',
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
