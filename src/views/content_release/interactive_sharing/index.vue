<template>
  <div class="app-container calendar-list-container">
     <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <!-- <ctr-detail :config="detailConfig"></ctr-detail> -->
    <ctr-review :config="reviewConfig"></ctr-review>
    <ctr-publish :config="publishConfig"></ctr-publish>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import enums from '@/utils/enums'
import apiList from '@/api/list.js'
import tools from '@/utils/tools.js'
import btnTools from '@/utils/btns.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrReview from '@/views/template/controller/review'
import CtrPublish from '@/views/template/controller/publish'
// import CtrEdit from '@/views/template/controller/edit'
import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'

export default {
  data() {
    return {
      resource_name: 'cms_interaction',
      fieldsMap: {
        member_name: {
          type: 'input',
          label: '会员名'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        category: {
          type: 'select',
          label: '互动分类',
          children: []
        },
        link_tel: {
          type: 'string',
          label: '联系方式'
        },
        detail_context: {
          type: 'text',
          label: '内容'
        },
        time: {
          type: 'date',
          label: '提交时间'
        },
        examine_status: {
          type: 'select',
          label: '审核状态',
          children: [{
            value: 'true',
            label: '已审核'
          }, {
            value: 'false',
            label: '未审核'
          }]
        },
        examine_result: {
          type: 'select',
          label: '审核结果',
          children: [{
            value: 'true',
            label: '通过'
          }, {
            value: 'false',
            label: '不通过'
          }]
        },
        examine_context: {
          type: 'text',
          label: '审核回复'
        },
        new_sort: {
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
        fields: tools.getFields(['member_name', 'examine_status', 'examine_result'], this.fieldsMap),
        btns: btnTools.getBtns(['search'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['member_name', 'detail_context', 'time', 'examine_status', 'examine_result', 'new_sort'], this.fieldsMap).map(item => {
          return Object.assign(item, { type: 'string' })
        }),
        btns: btnTools.getBtns(['publish', 'review', 'delete'])
      }
    },
    reviewConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '基本信息',
          layers: [{
            fields: tools.getFields(['member_name', 'category', 'link_tel'], this.fieldsMap).map(item => {
              return Object.assign(item, { type: 'string' })
            }),
            cols: 3
          }, {
            fields: tools.getFields(['time', 'new_sort'], this.fieldsMap).map(item => {
              return Object.assign(item, { type: 'string' })
            }),
            cols: 3
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['detail_context'], this.fieldsMap).map(item => {
              return Object.assign(item, { type: 'string' })
            }),
            cols: 1
          }]
        },
        {
          label: '审核',
          layers: [{
            fields: tools.getFields(['examine_status', 'examine_result', 'examine_context'], this.fieldsMap).map(item => {
              if (item.field !== 'examine_context') {
                return Object.assign(item, { type: 'string' })
              } else {
                return item
              }
            }),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['examine_context'], this.fieldsMap)
      }
    },
    publishConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '发布信息',
          layers: [{
            fields: tools.getFields(['publish_channel'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['publish_channel'], this.fieldsMap)
      }
    }
  },
  components: {
    CtrTable,
    CtrSearch,
    // CtrEdit,
    CtrPublish,
    CtrEditLanguage,
    CtrReview
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      this.getCateGory()
      const actions = tools.getActions()
      this.setAction(actions)
    },
    async getCateGory() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'InteractiveCategory'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.category.children = res.data.data.map(item => {
          return {
            value: item.code,
            label: item.name
          }
        })
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
