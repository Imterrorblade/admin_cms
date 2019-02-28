import defalutModel from '@/model/default'
import { extendObj } from '@/utils/index'
export function modelMap(model) {
  const modelMap = Object.assign({}, model)
  model.default_query.searchFilter.map(field => {
    if (typeof field === 'string') {
      model.default_query.list_query.query_data[field] = ''
    } else if (typeof field === 'object') {
      if (!model.default_query.list_query.query_data[field.type]) {
        model.default_query.list_query.query_data[field.type] = {}
      }
      model.default_query.list_query.query_data[field.type][field.value] = ''
    }
  })
  modelMap.fieldsMap = {}
  modelMap.fields.map((item) => { // 将所有的模型字段映射到modelMap.fields 并设置相应字段默认配合
    const fieldMap = {}
    item = typeof item === 'object' ? item : { name: item }
    extendObj(true, fieldMap, defalutModel.fields[0], { lang: 'table.common.' + item.name }, item)
    modelMap.fieldsMap[item.name] = fieldMap
  })
  return modelMap
}

/*
  获取模型 @pamam modelname string
*/
export function getModel(modelName) {
  return new Promise((resolve, reject) => {
    try {
      const model = require('@/model/' + modelName).default
      resolve(model)
    } catch (err) {
      reject(err)
    }
  })
}

// 获去字段的表单布局
export function getLayoutFromModel(layout) {
  return extendObj(true, [], defalutModel.view.layout.col_style, layout.col_style)
}
