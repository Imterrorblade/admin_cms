// 商家管理
import qs from 'qs'
import request from '@/utils/request'

export function fetchList(query) {
  return new Promise((resolve, reject) => {
    return request({
      url: 'cms/seller/queryByPage',
      method: 'get',
      params: query
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

export function fetchDetail(id) {
  return request({
    url: 'cms/seller/queryById',
    method: 'get',
    params: {
      id: id
    }
  })
}
export function fetchDetail2(id) {
  return request({
    url: 'cms/seller/queryDetailById',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function save(query) {
  const data = qs.stringify({
    submit_data: JSON.stringify(query)
  })
  return request({
    url: 'cms/seller/save',
    method: 'post',
    data
  })
}

export function update(query) {
  const data = qs.stringify({
    submit_data: JSON.stringify(query)
  })
  return request({
    url: 'cms/seller/update',
    method: 'post',
    data
  })
}

export function delArticle(resource_name, id) {
  const data = qs.stringify({
    resource_name,
    id
  })
  return request({
    url: 'cms/seller/delete',
    method: 'post',
    data
  })
}
