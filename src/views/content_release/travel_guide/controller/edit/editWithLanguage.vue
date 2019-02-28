<template>
  <div>
    <el-dialog width="80%" :title="title" :visible.sync="dialogFormVisible">
      <el-tabs v-model="language" type="border-card">
        <el-button @click="addTemp()" icon="el-icon-plus" type="primary" plain>添加语言</el-button>
        <el-tab-pane v-for="(temp, index) in temps" :key="index" :name="temp.language" :label="temp.language | languageMapFilter">
          <com-edit :ref="`eidt_${index}`" v-model="temps[index]" :fieldsMap="config.fieldsMap" :views="config.views" :rules="config.rules"></com-edit>
          <div class="dialog-footer">
            <el-button type="primary" :loading="submitLoading" @click="submit(`eidt_${index}`)">提交</el-button>
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
import apiList from '@/api/list.js'
import ComEdit from '@/views/template/components/edit'
import Vue from 'vue'
export default {
  data() {
    return {
      enums: enums,
      title: '编辑',
      dialogFormVisible: false,
      addTempShow: false,
      submitLoading: false,
      temps: [],
      language: 'chinese',
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
  computed: {
    ...mapGetters(['config', 'data']),
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
    ...mapActions(['subActions', 'fireActions']),
    init() {
      this.subscripte()
    },
    subscripte() {
      this.subActions({
        type: 'edit',
        fn: data => {
          this.dialogFormVisible = true
          this.getDetail(data)
        }
      })
      this.subActions({
        type: 'add',
        fn: data => {
          this.language = 'chinese'
          this.dialogFormVisible = true
          const temp = this.getEmityTemp()
          temp.language = 'chinese'
          this.temps = [temp]
        }
      })
    },
    defineTemp(temp, data) {
      Vue.$set(temp, data)
    },
    async getDetail(data) {
      try {
        this.language = 'chinese'
        const res = await apiList.getTravelGuide({
          id: data.id
        })
        if (res.data.success) {
          this.temps = res.data.data
          this.temps[0].language = 'chinese'
          this.getOtherLanguage(this.temps[0])
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getOtherLanguage(data) {
      const listQuery = {
        page: 1,
        limit: 100,
        resource_name: this.config.resource_name,
        querydata: JSON.stringify({
          chinese_id: data.id
        })
      }
      try {
        const res = await apiList.fetchList(listQuery)
        if (res.data.success) {
          res.data.data.map(item => {
            this.getEmityTemp(item)
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getOtherDetail(data) {
      try {
        const res = await apiList.getTravelGuide({
          id: data.id
        })
        if (res.data.success) {
          this.temps.push(this.getMergeTemp(res.data.data))
        }
      } catch (err) {
        console.log(err)
      }
    },
    getEmityTemp() { // 获取空的temp对象
      const temp = {}
      this.config.views.map(view => {
        view.layers.map(layer => {
          layer.fields.map(field => {
            temp[field] = this.config.fieldsMap[field].default || ''
          })
        })
      })
      return temp
    },
    getMergeTemp(temp) { // merge temp对象
      const emptyTemp = this.getEmityTemp()
      const rTemp = Object.assign({}, emptyTemp, temp)
      Object.keys(emptyTemp).filter(key => { // 处理非单个字段对应单个组件的问题，例如地图组件对应经度和纬度两个字段
        return !!this.config.fieldsMap[key].mapFields
      }).map(key => {
        // merge 单个字段对应多个字段的映射
        Object.assign(rTemp, { [key]: Object.keys(this.config.fieldsMap[key].mapFields).reduce((pre, field) => {
          if (temp[this.config.fieldsMap[key].mapFields[field]] !== undefined || temp[this.config.fieldsMap[key].mapFields[field]] !== null) {
            pre[field] = temp[this.config.fieldsMap[key].mapFields[field]]
          }
          return pre
        }, {}) })
      })
      return rTemp
    },
    addTemp() {
      if (!this.temps[0].id) {
        this.$message({
          title: '提示',
          type: 'warning',
          message: '请先保存主语音'
        })
        return
      }
      this.addTempShow = true
    },
    submitAddTemp() { // 添加其他语言
      this.$refs['language'].validate(validate => {
        if (validate) {
          this.temps.push(this.getMergeTemp({
            id: '',
            language: this.addLanguageTemp.tempLanguage,
            chinese_id: this.temps[0].id
          }))
          this.language = this.addLanguageTemp.tempLanguage
          this.addLanguageTemp.tempLanguage = ''
          this.addTempShow = false
        }
      })
    },
    dealSubmitTemp(tp) { // 解析单个字段对应多个字段的映射，例如地图组件
      const temp = JSON.parse(JSON.stringify(tp))
      Object.keys(temp).filter(key => {
        return this.config.fieldsMap[key] && this.config.fieldsMap[key].mapFields
      }).map(key => {
        Object.keys(this.config.fieldsMap[key].mapFields).map(field => {
          temp[this.config.fieldsMap[key].mapFields[field]] = temp[key][field]
        })
        delete temp[key]
      })
      return temp
    },
    async submit(ref) {
      // JSON.stringify(JSON.parse(temp.contentList).map(item => {
      //   item.relation_id
      // }))
      try {
        const val = await this.$refs[ref][0].validate()
        const temp = this.dealSubmitTemp(val)
        const data = {
          chineseId: temp.chinese_id || '',
          contentList: temp.detail,
          id: temp.id || '',
          language: temp.language,
          mainImage: temp.main_image,
          publishChannel: temp.publish_channel,
          strategyLabel: temp.strategy_label,
          strategyName: temp.strategy_name
        }
        this.submitLoading = true
        const res = await apiList.updateTravelGuide(data)
        this.submitLoading = false
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: this.title + '成功',
            type: 'success',
            duration: 2000
          })
          this.fireActions({
            type: 'search',
            data: this.data.search
          })
          if (this.temps[0].id) {
            this.fireActions({
              type: 'edit',
              data: this.temps[0]
            })
          } else {
            this.fireActions({
              type: 'edit',
              data: {
                id: res.data.id
              }
            })
          }
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
