<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="searchConfig">
      <ctr-table slot="table" :config="tableConfig"></ctr-table>
    </ctr-search>
    <ctr-detail-language :config="editWidthLanguageConfig"></ctr-detail-language>
    <ctr-edit-language :config="editWidthLanguageConfig"></ctr-edit-language>
    <ctr-publish :config="publishConfig"></ctr-publish>
  </div>
</template>
<script>

import { mapActions } from 'vuex'
import enums from '@/utils/enums'
import tools from '@/utils/tools.js'
import btnTools from '@/utils/btns.js'
// import api from '@/api/list.js'
// import serviceFactory from '@/utils/service/factory.js'
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrPublish from '@/views/template/controller/publish'
// import CtrEdit from '@/views/template/controller/edit'
import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'
import CtrDetailLanguage from '@/views/template/controller/detail/detailWithLanguage'
import { isvalidateTel } from '@/utils/validate.js'

export default {
  data() {
    return {
      resource_name: 'cms_scenic_management',
      fieldsMap: {
        scenic_spot: {
          type: 'input',
          label: '景区名称'
        },
        scenic_level: {
          type: 'select',
          label: '景区级别',
          children: [{
            value: '5A',
            label: '5A'
          }, {
            value: '4A',
            label: '4A'
          }, {
            value: '3A',
            label: '3A'
          }, {
            value: '2A',
            label: '2A'
          }, {
            value: '1A',
            label: '1A'
          }]
        },
        opening_hours: {
          type: 'text',
          label: '开放时间'
        },
        ask_phone: {
          type: 'input',
          label: '咨询电话'
        },
        rescue_phone: {
          type: 'input',
          label: '救援电话'
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
        global_text: {
          type: 'text',
          label: '景区简介'
        },
        main_image: {
          type: 'img',
          label: '景区主图',
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
        publicity_album: {
          type: 'imgs',
          label: '宣传册',
          params: {
            maxSize: 200 * 1024
          }
        },
        detail: {
          type: 'richtext',
          label: '景区详情'
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
      }
    }
  },
  computed: {
    searchConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['scenic_spot'], this.fieldsMap),
        btns: btnTools.getBtns(['search', 'add'])
      }
    },
    tableConfig() {
      return {
        resource_name: this.resource_name,
        fields: tools.getFields(['scenic_spot', 'scenic_level', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['scenic_spot', 'scenic_level', 'ask_phone', 'rescue_phone', 'address', 'new_sort'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['audio_address'], this.fieldsMap),
            cols: 2
          }, {
            fields: tools.getFields(['opening_hours'], this.fieldsMap),
            cols: 1
          }, {
            fields: tools.getFields(['_map'], this.fieldsMap),
            cols: 1
          }]
        },
        {
          label: '详细信息',
          layers: [{
            fields: tools.getFields(['main_image', 'images', 'publicity_album', 'global_text', 'detail'], this.fieldsMap),
            cols: 1
          }]
        }],
        rules: (() => {
          const rules = tools.getRequiredRules(['scenic_spot', 'opening_hours', 'ask_phone', 'global_text', 'main_image', 'images', 'publicity_album', 'detail'], this.fieldsMap)
          rules.get('ask_phone').push({
            validator: (rule, value, callback) => {
              if (!isvalidateTel(value, 2)) {
                callback(new Error('电话格式错误'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          })
          rules.set('rescue_phone', [{
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback()
              }
              if (!isvalidateTel(value, 2)) {
                callback(new Error('电话格式错误'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }])
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
    // CtrEdit,
    CtrEditLanguage,
    CtrPublish,
    CtrDetailLanguage
  },
  methods: {
    ...mapActions(['setAction']),
    init() {
      const actions = tools.getActionsWithLanguage()
      actions.get('submit').getService().featchInterceptor((data) => {
        const submit_data = JSON.parse(data.submit_data)
        submit_data.lat = submit_data._map.lat
        submit_data.lon = submit_data._map.longt
        delete submit_data._map
        data.submit_data = JSON.stringify(submit_data)
        return data
      });
      ['edit', 'detail'].map(type => {
        actions.get(type).getService().responseInterceptor(res => {
          if (res.data.data) {
            res.data.data = res.data.data.map(item => {
              item._map = {
                lat: item.lat,
                longt: item.lon
              }
              return item
            })
          }
          return res
        })
      })
      this.setAction(actions)
    }
  },
  created() {
    this.init()
  }
}
</script>
