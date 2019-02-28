<template>
  <div class="app-container calendar-list-container">
   <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <!-- <ctr-detail :config="detailConfig"></ctr-detail> -->
    <ctr-edit-language :config="editWidthLanguageConfig"></ctr-edit-language>
    <ctr-detail-language :config="editWidthLanguageConfig"></ctr-detail-language>
    <ctr-publish :config="publishConfig"></ctr-publish>
  </div>
</template>
<script>

import apiList from '@/api/list.js'
import { mapActions } from 'vuex'
import enums from '@/utils/enums'
import tools from '@/utils/tools.js'
import btnTools from '@/utils/btns.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrPublish from '@/views/template/controller/publish'
// import CtrEdit from '@/views/template/controller/edit'
import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'
import CtrDetailLanguage from '@/views/template/controller/detail/detailWithLanguage'

export default {
  data() {
    return {
      resource_name: 'cms_trip_strategy',
      fieldsMap: {
        strategy_name: {
          type: 'input',
          label: '攻略名称'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        strategy_label: {
          type: 'checkbox',
          label: '攻略标签',
          max: 2,
          children: []
        },
        main_image: {
          type: 'img',
          label: '主图',
          params: {
            maxSize: 1024 * 1024 * 2
          }
        },
        detail: {
          type: 'raiderSpots',
          label: '攻略详情'
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
        fields: tools.getFields(['strategy_name', 'publish_channel'], this.fieldsMap).findAndMerge(item => {
          return item.field === 'publish_channel'
        }, {
          type: 'select'
        }),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['strategy_name', 'publish_channel'], this.fieldsMap).map(item => {
          return Object.assign(item, { type: 'string' })
        }),
        btns: btnTools.getBtns(['detail', 'publish', 'edit', 'delete'])
      }
    },
    editWidthLanguageConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '基本信息',
          layers: [{
            fields: tools.getFields(['strategy_name'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['strategy_label'], this.fieldsMap),
            cols: 1
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['main_image', 'detail'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: (() => {
          const rules = tools.getRequiredRules(['strategy_name', 'main_image', 'strategy_label', 'detail'], this.fieldsMap)
          rules.detail.push({
            validator: (rule, value, callback) => {
              if (value && value instanceof Array) {
                value.map(item => {
                  if (!item.relation_scenic_spot) {
                    callback(new Error('请选择关联景点'))
                  }
                })
                callback()
              } else {
                callback()
              }
            },
            trigger: 'blur'
          })
          return rules
        })()
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
    CtrPublish,
    // CtrEdit,
    CtrEditLanguage,
    CtrDetailLanguage
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      this.getMapping()
      const actions = tools.getActionsWithLanguage()
      actions.get('submit').getService().setApi((data, interceptor) => {
        return apiList.updateTravelGuide(interceptor(data))
      }).featchInterceptor(data => {
        const submit_data = JSON.parse(data.submit_data)
        return {
          id: submit_data.id,
          chineseId: submit_data.chinese_id,
          contentList: submit_data.detail,
          language: submit_data.language,
          mainImage: submit_data.main_image,
          publishChannel: submit_data.publish_channel,
          strategyLabel: submit_data.strategy_label,
          strategyName: submit_data.strategy_name
        }
      })
      actions.get('edit').getService().setApi(apiList.getTravelGuide)
      actions.get('detail').getService().setApi(apiList.getTravelGuide)
      this.setAction(actions)
    },
    async getMapping() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'StrategyLabel'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.strategy_label.children = res.data.data.map(item => {
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
