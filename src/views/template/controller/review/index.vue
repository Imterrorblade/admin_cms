<template>
  <div>
    <el-dialog width="80%" title="审核" :visible.sync="dialogFormVisible">
       <com-detail v-if="dialogFormVisible" ref="edit" v-model="temp"  :rules="config.rules" :views="config.views"  v-bind="$attrs" v-on="$listeners"></com-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="" :loading="submitLoading" @click="submit(false)">不通过</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit(true)">通过</el-button>
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
      default() {}
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
      this.subAction({
        type: 'review',
        beforeFire: () => {
          this.openEditer()
        },
        render: res => {
          this.handleRes(res)
        }
      })
    },
    handleRes(res) {
      if (res.data.success) {
        this.temp = res.data.data
      }
    },
    openEditer() {
      this.dialogFormVisible = true
    },
    closeEditer() {
      this.dialogFormVisible = false
    },
    handleCallback(res) {
      if (res.data.success) {
        this.closeEditer()
        this.submitLoading = false
        this.$notify({
          title: '成功',
          message: '审核成功',
          type: 'success',
          duration: 2000
        })
      }
    },
    async submit(bool) {
      try {
        const temp = await this.$refs.edit.validate()
        if (temp) {
          this.submitLoading = true
          this.fireAction({
            type: 'reviewSubmit',
            callback: (res) => {
              this.handleCallback(res)
            },
            data: {
              resource_name: this.config.resource_name,
              submit_data: JSON.stringify(temp),
              examine_result: bool
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

