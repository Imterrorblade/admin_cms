<template>
  <div>
    <com-search v-model="temp" :btns="config.btns" :fields="fields" @dispatch="handleDispatch"></com-search>
    <slot name="table"></slot>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import tools from '@/utils/tools.js'
import ComSearch from '@/views/template/components/search'
export default {
  data() {
    return {
      temp: {},
      total: 0,
      replaceTypes: [{
        targets: ['date'],
        replaceTag: 'daterange'
      }, {
        targets: ['radios', 'checkbox'],
        replaceTag: 'select'
      }, {
        targets: ['text'],
        replaceTag: 'input'
      }]
    }
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['actions']),
    fields() {
      if (this.config && this.config.fields) {
        return this.config.fields.map(field => { // 处理处理收索字段
          const replaceType = this.replaceTypes.find(replaceType => { // 处理需要替换的控件，例如，时间控件date替换为时间范围控件daterange
            return replaceType.targets.find(target => {
              return target === field.type
            })
          })
          if (replaceType) {
            return Object.assign(field, { type: replaceType.replaceTag })
          } else {
            return field
          }
        })
      } else {
        return []
      }
    },
    listQuery() {
      return {
        page: 1,
        limit: 10,
        resource_name: this.config.resource_name,
        querydata: ''
      }
    }
  },
  components: {
    ComSearch
  },
  methods: {
    ...mapActions(['subAction', 'fireAction']),
    init() {
      this.initTemp()
      this.initFire()
      this.subscripte()
    },
    subscripte() {
      ['delete', 'submit', 'publishSubmit', 'reviewSubmit'].map(type => {
        this.subAction({
          type,
          render: (res) => {
            this.dispatch('search')
          }
        })
      })
    },
    initTemp() {
      this.fields.map(item => {
        this.$set(this.temp, item.field, '')// 动态添加监听属性
      })
    },
    handleSizeChange(value) {
      this.listQuery.limit = value
      this.dispatch('search')
    },
    handleCurrentChange(value) {
      this.listQuery.page = value
      this.dispatch('search')
    },
    initFire() {
      this.dispatch('search')
    },
    handleDispatch(type, data) {
      this.listQuery.page = 1
      this.dispatch(type, data)
    },
    dispatch(type, data) {
      const listQuery = JSON.parse(JSON.stringify(this.listQuery))
      const querydata = {}
      Object.keys(this.temp).map(key => {
        const field = this.fields.find(field => {
          return field.field === key
        })
        if (field && field.type === 'daterange' && this.temp[key]) {
          if (!querydata.range) {
            querydata.range = {
              [key]: this.temp[key]
            }
          } else {
            querydata.range[key] = this.temp[key]
          }
        } else if (field.type !== 'daterange') {
          if (!querydata.fuzzy) {
            querydata.fuzzy = {
              [key]: this.temp[key]
            }
          } else {
            querydata.fuzzy[key] = this.temp[key]
          }
        }
      })
      listQuery.querydata = querydata
      this.fireAction({
        type, data: listQuery,
        callback: (res) => {
          if (res) {
            if (['search', 'async'].find(item => {
              return item === type
            })) {
              this.total = res.data.count
            }
          }
        }
      })
    }
  },
  created() {
    // this.init()
  },
  mounted() {
    this.init()
  }
}
</script>
