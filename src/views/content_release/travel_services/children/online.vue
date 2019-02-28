<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <ctr-detail :config="editConfig"></ctr-detail>
    <ctr-edit :config="editConfig"></ctr-edit>
    <ctr-publish :config="publishConfig"></ctr-publish>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import enums from '@/utils/enums'
import tools from '@/utils/tools.js'
import btnTools from '@/utils/btns.js'
import apiList from '@/api/list.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrEdit from '@/views/template/controller/edit'
import CtrDetail from '@/views/template/controller/detail'
import CtrPublish from '@/views/template/controller/publish'
// import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'

export default {
  data() {
    return {
      resource_name: 'cms_online_consult',
      fieldsMap: {
        name: {
          type: 'input',
          label: 'QA标题'
        },
        category: {
          type: 'select',
          label: '分类',
          children: []
        },
        QAreply: {
          type: 'richtext',
          label: 'QA回复'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
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
        fields: tools.getFields(['name', 'category', 'publish_channel'], this.fieldsMap).findAndMerge(item => {
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
        fields: tools.getFields(['name', 'category', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
          return Object.assign(item, { type: 'string' })
        }),
        btns: btnTools.getBtns(['detail', 'publish', 'edit', 'delete'])
      }
    },
    editConfig() {
      return {
        resource_name: this.resource_name,
        views: [{
          label: '基本信息',
          layers: [{
            fields: tools.getFields(['name', 'category', 'new_sort'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['QAreply'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['name', 'category', 'QAreply'], this.fieldsMap)
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
    CtrEdit,
    CtrPublish,
    CtrDetail
    // CtrEditLanguage
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      this.getCategory()
      const actions = tools.getActions()
      this.setAction(actions)
    },
    async getCategory() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'ConsultingCategory'
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
