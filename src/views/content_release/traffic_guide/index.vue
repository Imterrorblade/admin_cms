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
      resource_name: 'cms_traffic_guide',
      fieldsMap: {
        column_name: {
          type: 'input',
          label: '栏目名称'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        modified_time: {
          type: 'date',
          label: '编辑时间'
        },
        main_image: {
          type: 'img',
          label: '栏目主图',
          params: {
            maxSize: 1024 * 1024 * 2
          }
        },
        detail: {
          type: 'richtext',
          label: '交通详情'
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
        fields: tools.getFields(['column_name', 'publish_channel'], this.fieldsMap).findAndMerge(item => {
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
        fields: tools.getFields(['column_name', 'publish_channel', 'modified_time', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['column_name', 'new_sort'], this.fieldsMap),
            cols: 3
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['main_image', 'detail'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['column_name', 'main_image', 'detail'], this.fieldsMap)
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
      this.setAction(tools.getActionsWithLanguage())
    }
  },
  created() {
    this.init()
  }
}
</script>
