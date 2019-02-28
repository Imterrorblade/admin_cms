import Action from '@/utils/action/index.js'
import serviceFactory from '@/utils/service/factory.js'
import MapLike from '@/utils/typeExtend/MapLike.js'
const createAction = (type) => {
  if (typeof type === 'object') {
    const action = new Action(type.type)
    return action.setService(serviceFactory.getService(type.api))
  } else {
    const action = new Action(type)
    return action.setService(serviceFactory.getService(type))
  }
}
const createActions = (types = []) => {
  return types.reduce((map, type) => {
    if (typeof type === 'object') {
      return map.set(type.type, createAction(type))
    }
    return map.set(type, createAction(type))
  }, new MapLike())
}
export default{
  createAction,
  createActions
}
