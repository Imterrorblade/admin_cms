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
import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import CtrEdit from '@/views/template/controller/edit'
import CtrPublish from '@/views/template/controller/publish'
import CtrDetail from '@/views/template/controller/detail'
// import CtrEditLanguage from '@/views/template/controller/edit/editWithLanguage'

export default {
  data() {
    return {
      resource_name: 'cms_ticketing_policy',
      fieldsMap: {
        name: {
          type: 'input',
          label: '标题'
        },
        reserve_instruction: {
          type: 'text',
          label: '预定说明'
        },
        summer_departure_time: {
          type: 'text',
          label: '夏令营班次'
        },
        winter_departure_time: {
          type: 'text',
          label: '冬令营班次'
        },
        ticket_price: {
          type: 'jsonTable',
          label: '票价设置'
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
        fields: tools.getFields(['name', 'publish_channel'], this.fieldsMap).findAndMerge(item => {
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
        fields: tools.getFields(['name', 'publish_channel', 'new_sort'], this.fieldsMap).map(item => {
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
            fields: tools.getFields(['name', 'new_sort'], this.fieldsMap),
            cols: 3
          }, {
            fields: tools.getFields(['reserve_instruction', 'summer_departure_time', 'winter_departure_time'], this.fieldsMap),
            cols: 1
          }]
        }, {
          label: '票价设置',
          layers: [
            {
              fields: tools.getFields(['ticket_price'], this.fieldsMap),
              cols: 1
            }
          ]
        }],
        rules: tools.getRequiredRules(['name', 'reserve_instruction', 'summer_departure_time', 'winter_departure_time'], this.fieldsMap)
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
      const actions = tools.getActions()
      this.setAction(actions)
    }
  },
  created() {
    this.init()
  }
}
</script>
