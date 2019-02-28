<template>
  <div class="app-container calendar-list-container">
    <ctr-search ></ctr-search>
    <ctr-table ></ctr-table>
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
// import CtrEdit from '@/views/template/controller/edit'
import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'

const fieldsMap = {
  global_name: {
    type: 'string',
    label: '全域名称'
  },
  publish_channel: {
    type: 'checkbox',
    label: '发布渠道',
    children: enums.publish_channel
  },
  ask_phone: {
    type: 'string',
    label: '咨询电话'
  },
  rescue_phone: {
    type: 'string',
    label: '救援电话'
  },
  audio_address: {
    type: 'audio',
    label: '语言导览'
  },
  address: {
    type: 'string',
    label: '地址'
  },
  global_text: {
    type: 'text',
    label: '全域简介'
  },
  main_image: {
    type: 'img',
    label: '全域主图'
  },
  images: {
    type: 'imgs',
    label: '图集'
  },
  detail: {
    type: 'richtext',
    label: '全域详情'
  },
  _map: {
    type: 'map',
    label: '地图',
    mapFields: {
      lat: 'lat',
      longt: 'lon'
    }
  }
}
export default {
  data() {
    return {
      config: {
        fieldsMap,
        resource_name: 'cms_global_overview',
        searchFields: ['global_name', 'publish_channel'],
        tableFields: ['global_name', 'publish_channel'],
        views: [{
          label: '基本信息',
          layers: [{
            fields: ['global_name', 'ask_phone', 'rescue_phone', 'address', 'publish_channel'],
            cols: 3
          }, {
            fields: ['audio_address'],
            cols: 3
          }, {
            fields: [/* '_map' */],
            cols: 1
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: ['main_image', 'images', 'global_text', 'detail'],
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['global_name', 'ask_phone', 'global_text', 'main_image', 'images', 'detail'], fieldsMap),
        searchBtns: ['search'],
        tableBtns: ['edit']
      }
    }
  },
  components: {
    CtrTable,
    CtrSearch,
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
