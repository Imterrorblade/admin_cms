import Service from '@/utils/service/index.js'
import apiMap from '@/utils/service/api.js'

export default {
  /* 获取不同操作的业务数据处理 */
  getService(type) {
    const service = new Service(apiMap[type])
    return service
  }
}
