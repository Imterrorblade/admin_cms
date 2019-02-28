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
// import serviceFactory from '@/utils/service/factory.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrPublish from '@/views/template/controller/publish'
import CtrEdit from '@/views/template/controller/edit'
// import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'
import CtrDetail from '@/views/template/controller/detail'

export default {
  data() {
    return {
      resource_name: 'cms_lecturer_management',
      fieldsMap: {
        name: {
          type: 'input',
          label: '讲师姓名'
        },
        rank: {
          type: 'select',
          label: '讲师职级',
          children: []
        },
        create_time: {
          type: 'date',
          label: '提交时间'
        },
        introduction: {
          type: 'text',
          label: '讲师简介'
        },
        logo_image: {
          type: 'img',
          label: '主图',
          param: {
            maxSize: 1024 * 1024 * 2
          }
        },
        images: {
          type: 'imgs',
          label: '图集',
          params: {
            maxSize: 200 * 1024
          }
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        details: {
          type: 'richtext',
          label: '详情'
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
        fields: tools.getFields(['name', 'rank', 'publish_channel'], this.fieldsMap).findAndMerge(item => {
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
        fields: tools.getFields(['name', 'rank', 'publish_channel', 'create_time', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['name', 'rank', 'new_sort'], this.fieldsMap),
            cols: 3
          }]
        },
        {
          label: '讲师详情',
          layers: [{
            fields: tools.getFields(['introduction', 'logo_image', 'images', 'details'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['name', 'rank', 'introduction', 'logo_image', 'details'], this.fieldsMap)
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
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      this.getRank()
      const actions = tools.getActions()
      this.setAction(actions)
    },
    async getRank() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'InstructorRank'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.rank.children = res.data.data.map(item => {
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
