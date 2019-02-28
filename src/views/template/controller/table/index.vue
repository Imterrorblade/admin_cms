<template>
  <com-table v-loading="loading" :data="list" :fields="config.fields" :btns="config.btns" @dispatch="dispatch"></com-table>
</template>
<script>
import { mapActions } from 'vuex'
// import tools from '@/utils/tools.js'
// import serviceFactory from '@/utils/service/factory.js'
// import apiList from '@/api/list.js'
import ComTable from '@/views/template/components/table'
export default {
  data() {
    return {
      list: [],
      total: 0,
      loading: false
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
  components: {
    ComTable
  },
  computed: {
  },
  methods: {
    ...mapActions(['subAction', 'fireAction']),
    init() {
      this.subscripte()
    },
    subscripte() {
      ['search', 'async'].map(type => {
        this.subAction({
          type,
          beforeFire: () => {
            this.loading = true
          },
          render: (res) => {
            this.loading = false
            this.handleResponse(type, res)
          }
        })
      })
    },
    subscripteBtns() {
      this.config.btns.map(btn => {
        this.subActions({
          type: `click_${btn.action}`,
          fn: data => {
            this.dispatch(btn.action, data)
          }
        })
      })
    },
    handleResponse(type, res) {
      this[`${type}Response`](res)
    },
    searchResponse(res) {
      if (res.data.success) {
        this.list = res.data.data
      }
    },
    deleteRespnse(res) {
      if (res.data.success) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: '失败',
          message: res.data.message || '删除失败',
          type: 'error',
          duration: 2000
        })
      }
    },
    asyncResponse() {},

    async handleDelete(data) {
      try {
        const res = await this.$confirm('您确定要执行删除操作么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (res) {
          try {
            this.fireAction({
              type: 'delete',
              data: {
                resource_name: this.config.resource_name,
                id: data.id
              },
              callback: res => {
                this.deleteRespnse(res)
              }
            })
          } catch (e) {
            console.log(e)
          }
        }
      } catch (e) {
        this.$notify({
          title: '取消',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      }
    },
    dispatch(type, data) {
      if (type === 'delete') {
        this.handleDelete(data)
      } else {
        this.fireAction({ type, data: {
          resource_name: this.config.resource_name,
          id: data.id,
          data: data
        }})
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
