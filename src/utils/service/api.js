import api from '@/api/list.js'

const languageStr = 'chinese'
// 点击按钮动作对应的接口调用
const interceptorfn = data => data

// 默认详情查询方法
const getDetailDef = async(data, interceptor = interceptorfn) => {
  return api.fetchDetail(interceptor(data))
}
const submitDef = async(data, interceptor = interceptorfn) => {
  return api.updateArticle(interceptor(data))
}

// 多语言默认方法
const getLanguageDetail = async(data, interceptor = interceptorfn) => {
  try {
    const res = await api.fetchDetail(interceptor(data))
    if (res.data.success) {
      let list = [res.data.data]
      const listQuery = {
        page: 1,
        limit: 100,
        resource_name: data.resource_name,
        querydata: JSON.stringify({
          fuzzy: {
            chinese_id: data.id
          }
        })
      }
      const otherLangaugesRes = await api.fetchList(listQuery)
      if (otherLangaugesRes.data.success) {
        list = list.concat(otherLangaugesRes.data.data)
        return {
          data: {
            success: true,
            data: list
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

// 触发操作和api 的映射
const apiMap = {
  search: async(data, interceptor = interceptorfn) => {
    Object.keys(data.querydata).map(item => {
      if (!data.querydata[item]) {
        delete data.querydata[item]
      }
    })
    data.querydata.sort = {
      new_sort: 'asc'
    }
    data = interceptor(data)
    data.querydata = JSON.stringify(data.querydata)
    return api.fetchList(data)
  },
  delete: async(data, interceptor = interceptorfn) => api.delArticle(interceptor(data)),
  edit: getDetailDef,
  detail: getDetailDef,
  publish: getDetailDef,
  review: getDetailDef,
  async shelves(data, interceptor = interceptorfn) {
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          success: true,
          data: data.data,
          is_shelves: !!((data.data.is_shelves === true || data.data.is_shelves === 'true'))
        }
      })
    })
  },
  submit: submitDef,
  publishSubmit: submitDef,
  reviewSubmit: async(data, interceptor = interceptorfn) => { // 审核业务
    const submit_data = JSON.parse(data.submit_data)
    submit_data.is_audit = data.examine_result
    return api.updateArticle(interceptor({
      resource_name: data.resource_name,
      submit_data: JSON.stringify(submit_data)
    }))
  },
  async add(data, interceptor = interceptorfn) { // 添加动作时，模拟api发送
    return new Promise(resolve => {
      resolve({
        data: {
          success: true,
          data: {
          }
        }
      })
    })
  },
  async addWithLanguage(data, interceptor = interceptorfn) {
    return new Promise(resolve => {
      resolve({
        data: {
          success: true,
          data: [{
            language: languageStr
          }]
        }
      })
    })
  },
  editWithLanguage: getLanguageDetail,
  detailWithLanguage: getLanguageDetail,
  publishWithLanguage: getDetailDef,
  async searchWithLanguage(data, interceptor = interceptorfn) {
    Object.keys(data.querydata).map(item => {
      if (!data.querydata[item]) {
        delete data.querydata[item]
      }
    })
    if (!data.querydata.fuzzy) {
      data.querydata.fuzzy = {
        language: languageStr
      }
    } else {
      data.querydata.fuzzy.language = languageStr
    }
    data.querydata.sort = {
      new_sort: 'asc'
    }
    data = interceptor(data)
    data.querydata = JSON.stringify(data.querydata)
    return api.fetchList(data)
  },
  submitWithLanguage: submitDef,
  async deleteWithLanguage(data, interceptor = interceptorfn) {
    const res = await api.delArticle(interceptor(data))
    if (res.data.success) {
      const resl = await api.fetchList({
        page: 1,
        limit: 1000,
        resource_name: data.resource_name,
        querydata: {
          fuzzy: {
            id: res.data.id
          }
        }
      })
      if (resl.data.success) {
        if (resl.data.data && typeof resl.data.data === Array) {
          resl.data.data.map(item => {
            api.delArticle({
              id: item.id,
              resource_name: data.resource_name
            })
          })
        }
      }
      return res
    }
  }

}
export default apiMap
