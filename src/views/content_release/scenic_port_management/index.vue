<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <!-- <ctr-detail :config="detailConfig"></ctr-detail> -->
    <ctr-edit-language :config="editWidthLanguageConfig"></ctr-edit-language>
    <ctr-detail-language :config="editWidthLanguageConfig"></ctr-detail-language>''
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
      fieldsMap: {
        spot_name: {
          type: 'input',
          label: '景点名称'
        },
        attch_scenic_spot: {
          type: 'select',
          label: '所属景区',
          children: []
        },
        scenic_label: {
          type: 'radio',
          label: '景点标签',
          children: []
        },
        is_recommend: {
          type: 'select',
          label: '是否推荐',
          children: [{
            value: 'true',
            label: '是'
          }, {
            value: 'false',
            label: '否'
          }]
        },
        audio_address: {
          type: 'audio',
          label: '语音导览'
        },
        address: {
          type: 'input',
          label: '景区地址'
        },
        publish_channel: {
          type: 'checkbox',
          label: '发布渠道',
          children: enums.publish_channel
        },
        spot_text: {
          type: 'text',
          label: '景点简介'
        },
        main_image: {
          type: 'img',
          label: '景点主图',
          params: {
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
        detail: {
          type: 'richtext',
          label: '景点详情'
        },
        new_sort: {
          type: 'number',
          label: '排序',
          min: 0
        },
        _map: {
          type: 'map',
          label: '地图',
          default: {
            lat: 39.901103,
            longt: 116.376412,
            markName: ''
          }
        }
      },
      resource_name: 'cms_spot_manage'
    }
  },
  computed: {
    searchConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['spot_name', 'attch_scenic_spot'], this.fieldsMap),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['spot_name', 'attch_scenic_spot', 'scenic_label', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['spot_name', 'attch_scenic_spot', 'address', 'scenic_label', 'new_sort'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['audio_address'], this.fieldsMap),
            cols: 1
          },
          {
            fields: tools.getFields(['_map'], this.fieldsMap),
            cols: 1
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['main_image', /* 'images', */ 'spot_text', 'detail'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: tools.getRequiredRules(['spot_name', 'attch_scenic_spot', 'address', 'spot_text', 'main_image', /* 'images', */ 'detail'], this.fieldsMap)
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
    CtrDetailLanguage
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      this.getMapping()
      this.getScenic_label()
      const actions = tools.getActionsWithLanguage()
      actions.get('submit').getService().featchInterceptor((data) => {
        const submit_data = JSON.parse(data.submit_data)
        submit_data.latitude = submit_data._map.lat
        submit_data.longitude = submit_data._map.longt
        delete submit_data._map
        data.submit_data = JSON.stringify(submit_data)
        return data
      });
      ['edit', 'detail'].map(type => {
        actions.get(type).getService().responseInterceptor(res => {
          if (res.data.data) {
            res.data.data = res.data.data.map(item => {
              item._map = {
                lat: item.latitude,
                longt: item.longitude
              }
              return item
            })
          }
          return res
        })
      })
      this.setAction(actions)
    },
    async getMapping() {
      const res = await apiList.fetchList({
        resource_name: 'cms_scenic_management',
        querydata: JSON.stringify({
          fuzzy: {
            language: 'chinese'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.attch_scenic_spot.children = res.data.data.map(item => {
          return {
            value: item.id,
            label: item.scenic_spot
          }
        })
      }
    },
    async getScenic_label() {
      const res = await apiList.fetchList({
        page: 1,
        limit: 1000,
        resource_name: 'dictionary_item',
        querydata: JSON.stringify({
          fuzzy: {
            parent_id: 'AttractionsLabel'
          }
        })
      })
      if (res.data.success) {
        this.fieldsMap.scenic_label.children = res.data.data.map(item => {
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
