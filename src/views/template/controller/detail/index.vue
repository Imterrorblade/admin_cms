<template>
  <div>
    <el-dialog width="80%" title="详情" :visible.sync="dialogFormVisible">
      <com-detail v-if="dialogFormVisible" ref="edit" v-model="temp" :views="views" v-bind="$attrs" v-on="$listeners"></com-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
// import apiList from '@/api/list.js'
import ComDetail from '@/views/template/components/edit'
export default {
  data() {
    return {
      dialogFormVisible: false,
      temp: {}
    }
  },
  props: {
    config: {
      type: Object,
      default() {}
    }
  },
  computed: {
    views() {
      const views = JSON.parse(JSON.stringify(this.config.views))
      views.map(view => {
        view.layers.map(layer => {
          if (!(layer.fields instanceof Array)) {
            layer.fields = Object.keys(layer.fields).map(key => {
              const field = layer.fields[key]
              if (['select', 'input', 'text', 'radio', 'checkbox', 'number', 'date'].indexOf(field.type) > -1) {
                field.type = 'string'
              } else {
                field.params = {
                  onlyshow: true
                }
              }
              return field
            })
          } else {
            layer.fields.map(field => {
              if (['select', 'input', 'text', 'radio', 'checkbox', 'number', 'date'].indexOf(field.type) > -1) {
                field.type = 'string'
              } else {
                field.params = {
                  onlyshow: true
                }
              }
            })
          }
        })
      })
      return views
    }
  },
  methods: {
    ...mapActions(['subAction', 'fireAction']),
    init() {
      this.subscripte()
    },
    subscripte() {
      ['detail'].map(type => {
        this.subAction({
          type,
          beforeFire: () => {
            this.openEditer()
          },
          render: res => {
            this.handleRes(res)
          }
        })
      })
    },
    handleRes(res) {
      if (res.data.success) {
        this.temp = this.getMergeTemp(res.data.data)
      }
    },
    openEditer() {
      this.dialogFormVisible = true
    },
    closeEditer() {
      this.dialogFormVisible = false
    },
    getEmityTemp() {
      const temp = {}
      this.config.views.map(view => {
        view.layers.map(layer => {
          layer.fields.map(field => {
            temp[field.field] = ''
          })
        })
      })
      return temp
    },
    getMergeTemp(temp) {
      // merge temp对象
      const emptyTemp = this.getEmityTemp()
      const rTemp = Object.assign({}, emptyTemp, temp)
      return rTemp
    }
  },
  mounted() {
    this.init()
  },
  components: {
    ComDetail
  }
}
</script>

