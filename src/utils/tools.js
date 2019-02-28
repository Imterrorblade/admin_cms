import btnAction from '@/config/btnAction.js'
import ExtendArray from '@/utils/typeExtend/ExtendArray.js'
import MapLike from '@/utils/typeExtend/MapLike.js'
import actionFactory from '@/utils/action/factory.js'

// 枚举字段映射
const mapFieldFilter = (value, type, selectOpt) => {
  let output = value
  if (type === 'select' || type === 'radio') {
    if (selectOpt instanceof Array) {
      const opt = selectOpt.filter(item => {
        return item === value || item.value === value
      })
      output =
            opt.length > 0 && typeof opt[0] === 'object' ? opt[0].label : value
    }
  } else if (type === 'checkbox') {
    if (selectOpt instanceof Array) {
      if (value) {
        const checkList = value.split(',')
        output = selectOpt.filter(item => {
          return !!checkList.find((li) => {
            return li === item || li === item.value
          })
        }).map(item => {
          return typeof item === 'object' ? item.label : item
        }).join(',')
      } else {
        output = ''
      }
    }
  }
  return output
}

const getFields = (fields, fieldsMap) => {
  return new ExtendArray(...fields.map(field => {
    return Object.assign({
      field: field
    }, fieldsMap[field])
  }))
}

const getFieldsOfDetail = (fields, fieldsMap) => {
  return new ExtendArray(...fields.map(field => {
    return Object.assign({
      field: field
    }, fieldsMap[field], { type: 'string' })
  }))
}

const getRequiredRules = (fields = [], fieldsMap) => {
  return fields.reduce((rule, field) => {
    rule.set(field, [{ required: true, message: `${fieldsMap[field].label}必填`, trigger: 'change' }])
    return rule
  }, new MapLike())
}

const getActions = () => {
  return actionFactory.createActions(Object.keys(btnAction))
}

const getActionsWithLanguage = () => {
  return actionFactory.createActions(Object.keys(btnAction).map(type => {
    if (type !== 'publishSubmit') {
      return {
        type,
        api: `${type}WithLanguage`
      }
    } else {
      return {
        type,
        api: type
      }
    }
  }))
}
export default {
  mapFieldFilter,
  getRequiredRules,
  getFields,
  getFieldsOfDetail,
  getActions,
  getActionsWithLanguage
}
