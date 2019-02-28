<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <ctr-detail :config="editConfig"></ctr-detail>
    <ctr-edit :config="editConfig"></ctr-edit>
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
      resource_name: 'dictionary_item',
      fieldsMap: {
        code: {
          type: 'input',
          label: '编码'
        },
        name: {
          type: 'input',
          label: '名称'
        },
        parent_id: {
          type: 'select',
          label: '类型',
          children: [{
            value: 'PolularScience',
            label: '科普类目'
          }, {
            value: 'Information',
            label: '资讯类目'
          }, {
            value: 'StrategyLabel',
            label: '攻略标签'
          }, {
            value: 'TavelsLabel',
            label: '游记标签'
          }, {
            value: 'CourseCategory',
            label: '课程分类'
          }, {
            value: 'InstructorRank',
            label: '讲师职级'
          }, {
            value: 'OuterchainCategory',
            label: '外链分类'
          }, {
            value: 'ConsultingCategory',
            label: '旅游咨询分类'
          }, {
            value: 'AttractionsLabel',
            label: '景点标签'
          }, {
            value: 'InteractiveCategory',
            label: '互动分类'
          }/* , {
            value: 'PlayCharges',
            label: '收费标准'
          } */]
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
        fields: tools.getFields(['name', 'parent_id'], this.fieldsMap),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['code', 'name', 'parent_id'], this.fieldsMap).map(item => {
          return Object.assign(item, { type: 'string' })
        }),
        btns: btnTools.getBtns(['detail', 'edit', 'delete'])
      }
    },
    editConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '基本信息',
          layers: [{
            fields: tools.getFields(['code', 'name', 'parent_id'], this.fieldsMap),
            cols: 3
          }]
        }],
        rules: tools.getRequiredRules(['code', 'name', 'parent_id'], this.fieldsMap)
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
