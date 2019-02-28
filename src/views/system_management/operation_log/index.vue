<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <ctr-detail :config="editConfig"></ctr-detail>
    <!-- <ctr-edit :config="editConfig"></ctr-edit> -->
    <!-- <ctr-publish :config="publishConfig"></ctr-publish> -->
  </div>
</template>
<script>

import { mapActions } from 'vuex'
// import enums from '@/utils/enums'
import tools from '@/utils/tools.js'
import btnTools from '@/utils/btns.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrEdit from '@/views/template/controller/edit'
import CtrDetail from '@/views/template/controller/detail'

export default {
  data() {
    return {
      resource_name: 'operate_log',
      fieldsMap: {
        user_name: {
          type: 'input',
          label: '操作用户'
        },
        uri: {
          type: 'string',
          label: '接口uri'
        },
        request_ip: {
          type: 'input',
          label: '接口ip'
        },
        operate: {
          type: 'input',
          label: '操作'
        },
        create_time: {
          type: 'date',
          label: '时间'
        },
        module_name: {
          type: 'string',
          label: '模块'
        },
        request: {
          type: 'string',
          label: '请求参数'
        },
        response: {
          type: 'string',
          label: '返回参数'
        },
        sort: {
          type: 'number',
          label: '排序',
          min: 0
        }
      }
    }
  },
  computed: {
    searchConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['user_name', 'operate', 'request_ip', 'create_time'], this.fieldsMap),
        btns: btnTools.getBtns(['search'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['user_name', 'operate', 'uri', 'request_ip', 'create_time'], this.fieldsMap).map(item => {
          return Object.assign(item, { type: 'string' })
        }),
        btns: btnTools.getBtns(['detail'])
      }
    },
    editConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '基本信息',
          layers: [{
            fields: tools.getFields(['user_name', 'operate', 'create_time', 'uri', 'request_ip', 'module_name'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['request', 'response'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules([], this.fieldsMap)
      }
    }
  },
  components: {
    CtrTable,
    CtrSearch,
    CtrDetail,
    CtrEdit
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      const actions = tools.getActions()
      actions.get('search').getService().featchInterceptor(data => {
        delete data.querydata.sort
        return data
      })
      this.setAction(actions)
    }
  },
  created() {
    this.init()
  }
}
</script>
