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
// import apiList from '@/api/list.js'
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
      resource_name: 'cms_play_project',
      fieldsMap: {
        name: {
          type: 'input',
          label: '娱乐名称'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        charges: {
          type: 'input',
          label: '收费标准',
          children: []
        },
        modified_time: {
          type: 'date',
          label: '编辑时间',
          disabled: true
        },
        logo_image: {
          type: 'img',
          label: '资讯主图',
          params: {
            maxSize: 1024 * 1024 * 2
          }
        },
        details: {
          type: 'richtext',
          label: '资讯详情'
        },
        introduction: {
          type: 'text',
          label: '简介'
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
        fields: tools.getFields(['name', 'charges'], this.fieldsMap),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['name', 'charges', 'modified_time', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['name', 'charges', 'modified_time', 'new_sort'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['introduction'], this.fieldsMap),
            cols: 1
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['logo_image', 'details'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['name', 'charges', 'logo_image', 'introduction', 'details'], this.fieldsMap)
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
      const actions = tools.getActionsWithLanguage()
      this.setAction(actions)
    }
  },
  created() {
    this.init()
  }
}
</script>
