<template>
  <div>
    <el-dialog width="80%" :title="title" :visible.sync="dialogFormVisible">
      <el-tabs v-model="language" v-if="dialogFormVisible" type="border-card">
        <el-tab-pane  v-for="(temp, index) in temps" :key="index" :name="temp.language" :label="temp.language | languageMapFilter">
          <com-edit v-if="language === temp.language" :ref="`eidt_${index}`" v-model="temps[index]"  :views="views" v-bind="$attrs" v-on="$listeners"></com-edit>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import enums from '@/utils/enums.js'
import ComEdit from '@/views/template/components/edit'
export default {
  data() {
    return {
      enums: enums,
      title: '编辑',
      dialogFormVisible: false,
      addTempShow: false,
      submitLoading: false,
      temps: [],
      language: '',
      addLanguageTemp: {
        tempLanguage: ''
      },
      addLanguageRule: {
        tempLanguage: [
          { required: true, message: '请选择一种语言', trigger: 'change' }
        ]
      }
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
    ...mapGetters([]),
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
            this.handleRender(res)
          }
        })
      })
    },
    handleRender(res) {
      if (res.data.success) {
        this.temps = this.getTemps(res.data.data)
        this.language = this.temps[0].language
      }
    },
    openEditer() {
      this.dialogFormVisible = true
    },
    getEmityTemp() {
      // 获取空的temp对象
      const temp = {}
      this.config.views.map(view => {
        view.layers.map(layer => {
          layer.fields.map(field => {
            temp[field.field] = field.default || ''
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
    },
    getTemps(list = []) {
      return list.map(item => {
        return this.getMergeTemp(item)
      })
    }

  },
  filters: {
    languageMapFilter(value) {
      const output = enums.language.find(item => {
        return item.value === value
      })
      if (output) {
        return output.label
      } else {
        return ''
      }
    }
  },
  components: {
    ComEdit
  },
  created() {
    this.init()
  }
}
</script>
