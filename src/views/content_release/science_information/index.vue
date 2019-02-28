<template>
  <div class="app-container calendar-list-container">
    <ctr-search ></ctr-search>
    <ctr-table ></ctr-table>
    <ctr-publish></ctr-publish>
    <!-- <ctr-edit ></ctr-edit> -->
    <ctr-edit-language></ctr-edit-language>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import enums from '@/utils/enums'
import tools from '@/utils/tools.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrPublish from '@/views/template/controller/publish'
// import CtrEdit from '@/views/template/controller/edit'
import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'

const fieldsMap = {
  polular_science_name: {
    type: 'input',
    label: '科普名称'
  },
  publish_channel: {
    type: 'checkbox',
    label: '发布渠道',
    children: enums.publish_channel
  },
  polular_science_category: {
    type: 'select',
    label: '科普分类',
    children: []
  },
  modified_time: {
    type: 'date',
    label: '编辑时间'
  },
  audio_address: {
    type: 'audio',
    label: '音频文件'
  },
  main_image: {
    type: 'img',
    label: '科普主图'
  },
  images: {
    type: 'imgs',
    label: '科普图集'
  },
  detail: {
    type: 'richtext',
    label: '科普详情'
  }
}
export default {
  data() {
    return {
      config: {
        withLanguage: true,
        fieldsMap,
        resource_name: 'cms_polular_science',
        searchFields: ['polular_science_name', 'polular_science_category'],
        tableFields: ['polular_science_name', 'polular_science_category', 'modified_time', 'publish_channel'],
        views: [{
          label: '基本信息',
          layers: [{
            fields: ['polular_science_name', 'polular_science_category', 'publish_channel'],
            cols: 3
          }, {
            fields: ['audio_address'],
            cols: 3
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: ['main_image', 'images', 'global_text', 'detail'],
            cols: 1
          }]
        }],
        publishViews: [{
          label: '发布信息',
          layers: [{
            fields: ['publish_channel'],
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['polular_science_name', 'polular_science_category', 'main_image', 'images', 'detail'], fieldsMap),
        searchBtns: ['search', 'add'],
        tableBtns: ['edit', 'delete']
      }
    }
  },
  components: {
    CtrTable,
    CtrSearch,
    CtrPublish,
    // CtrEdit,
    CtrEditLanguage
  },
  methods: {
    ...mapActions(['initActions', 'setConfig', 'initData']),
    init() {
      this.setConfig(this.config)
      this.initActions()
      this.initData()
    }
  },
  created() {
    this.init()
  }
}
</script>
