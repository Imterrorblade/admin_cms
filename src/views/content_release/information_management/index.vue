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
      resource_name: 'cms_information_manage',
      fieldsMap: {
        consultation_tiltle: {
          type: 'input',
          label: '资讯标题'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        consultation_category: {
          type: 'select',
          label: '资讯类目',
          children: []
        },
        modified_time: {
          type: 'date',
          label: '编辑时间'
        },
        information_text: {
          type: 'text',
          label: '资讯简介'
        },
        main_image: {
          type: 'img',
          label: '资讯主图',
          params: {
            maxSize: 1024 * 1024 * 2
          }
        },
        detail: {
          type: 'richtext',
          label: '资讯详情'
        },
        keyword: {
          type: 'input',
          label: '关键词'
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
        fields: tools.getFields(['consultation_tiltle', 'consultation_category'], this.fieldsMap).findAndMerge(item => {
          return item.field === 'consultation_category'
        }, {
          type: 'select'
        }),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['consultation_tiltle', 'consultation_category', 'modified_time', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['consultation_tiltle', 'consultation_category', 'new_sort'], this.fieldsMap),
            cols: 3
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['main_image', 'information_text', 'detail', 'keyword'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['consultation_tiltle', 'consultation_category', 'main_image', 'information_text', 'detail', 'keyword'], this.fieldsMap)
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
      this.setAction(actions)
    },
    async getMapping() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'Information'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.consultation_category.children = res.data.data.map(item => {
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
