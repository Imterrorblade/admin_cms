<template>
  <div>
    <el-dialog width="80%" ref="editDialog" :title="title" :visible.sync="dialogFormVisible">
      <el-tabs v-model="language" v-if="dialogFormVisible" type="border-card">
        <el-button @click="addTemp()" icon="el-icon-plus" type="primary" plain>添加语言</el-button>
        <el-tab-pane  v-for="(temp, index) in temps" :key="index" :name="temp.language" :label="temp.language | languageMapFilter">
          <com-edit v-if="language === temp.language" :ref="`edit_${index}`" v-model="temps[index]"  :views="config.views"  :rules="config.rules"  @canSubmit="canSubmit" ></com-edit>
          <div class="dialog-footer">
            <el-button type="primary" :loading="submitLoading" @click="submit(`edit_${index}`)">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" :title="title" :visible.sync="addTempShow">
      <el-form ref="language" :rules="addLanguageRule" :model="addLanguageTemp" label-position="right" label-width="110px">
        <el-row>
          <el-col>
            <el-form-item label="选择语言" prop="tempLanguage">
              <el-select v-model="addLanguageTemp.tempLanguage">
                <el-option v-for="lang in canSelectLanguages" :key="lang.value" :value="lang.value" :label="lang.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTempShow = false">取消</el-button>
        <el-button type="primary" @click="submitAddTemp">确定</el-button>
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
    canSelectLanguages() {
      const list = this.enums.language.filter(item => {
        return !this.temps.find(temp => {
          return temp.language === item.value
        })
      })
      return list
    }
  },
  methods: {
    ...mapActions(['subAction', 'fireAction']),
    init() {
      this.subscripte()
    },
    subscripte() {
      ['add', 'edit'].map(type => {
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
      this.$refs.editDialog.$el.addEventListener('scroll', () => {
        if (document.querySelector('.tangram-suggestion-main')) {
          document.querySelector('.tangram-suggestion-main').style.display = 'none'
        // document.querySelector('.tangram-suggestion-main').style.display = 'block'
        }
      })
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
    },
    addTemp() {
      if (!this.temps[0].id) {
        this.$message({
          title: '提示',
          type: 'warning',
          message: '请先保存主语言'
        })
        return
      }
      this.addTempShow = true
    },
    submitAddTemp() {
      // 添加其他语言
      this.$refs['language'].validate(validate => {
        if (validate) {
          this.temps.push(
            this.getMergeTemp({
              id: '',
              language: this.addLanguageTemp.tempLanguage,
              chinese_id: this.temps[0].id
            })
          )
          this.language = this.addLanguageTemp.tempLanguage
          this.addLanguageTemp.tempLanguage = ''
          this.addTempShow = false
        }
      })
    },
    handleCallback(res) {
      this.submitLoading = false
      if (res.data.success) {
        this.$notify({
          title: '成功',
          message: this.title + '成功',
          type: 'success',
          duration: 2000
        })
        this.fireAction({
          type: 'edit',
          data: {
            resource_name: this.config.resource_name,
            id: this.temps[0].id ? this.temps[0].id : res.data.id
          }
        })
      } else {
        this.$notify({
          title: '失败',
          message: res.data.message || '失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    async submit(ref) {
      try {
        const temp = await this.$refs[ref][0].validate()
        if (temp) {
          this.submitLoading = true
          this.fireAction({
            type: 'submit',
            callback: (res) => {
              this.handleCallback(res)
            },
            data: {
              resource_name: this.config.resource_name,
              submit_data: JSON.stringify(temp)
            }
          })
        }
      } catch (err) {
        this.submitLoading = false
        console.log(err)
        this.$notify({
          title: '提示',
          message: err.message,
          type: 'error',
          duration: 2000
        })
      }
    },
    canSubmit(bool) {
      this.submitLoading = !bool
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
