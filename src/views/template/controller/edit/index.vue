<template>
  <div>
    <el-dialog width="80%" title="编辑" :visible.sync="dialogFormVisible">
      <com-detail v-if="dialogFormVisible" ref="edit" v-model="temp"  :rules="config.rules" :views="config.views"  v-bind="$attrs" v-on="$listeners" @canSubmit="canSubmit"></com-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit()">确定</el-button>
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
      temp: {},
      submitLoading: false
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
  },
  methods: {
    ...mapActions(['subAction', 'fireAction']),
    init() {
      this.subscripte()
    },
    subscripte() {
      ['edit', 'add'].map(type => {
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
    },
    handleCallback(res) {
      if (res.data.success) {
        this.closeEditer()
        this.submitLoading = false
        this.$notify({
          title: '成功',
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
      }
    },
    async submit(ref) {
      try {
        const temp = await this.$refs.edit.validate()
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
  mounted() {
    this.init()
  },
  components: {
    ComDetail
  }
}
</script>

