<template>
  <el-table :key="tableKey" :data="list" v-loading="listLoading" :element-loading-text="loadText" 
  border fit highlight-current-row style="width: 100%">
    <el-table-column v-for="(field, index) in fields" :key="index" align="center" :label="field.label">
      <template slot-scope="scope">
        <ViewInput v-model="scope.row[field.field]" :value="scope.row[field.field]" aria-setsize="small" :componentTarget="field.type" :options="field.children" :params="field.params"></ViewInput>
      </template>
    </el-table-column>
    <el-table-column v-show="btns.length > 0" align="center" :label="$t('table.actions')" :width="100*btns.length"  class-name="small-padding fixed-width" fixed="right">
      <template slot-scope="scope">
          <customize-button v-for="btn in btns" :key="btn.action" :type="btn.type || 'primary'" size="mini"
         @click="dispatch(btn.action, scope.row)" :label="btn.label" :temp="scope.row"></customize-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import tools from '@/utils/tools.js'
import ViewInput from '@/components/viewinput'
import CustomizeButton from '@/components/Button'

export default {
  data() {
    return {
      tableKey: 0,
      loadText: '数据加载中'
    }
  },
  props: {
    btns: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    listLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    fields: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    list() {
      return this.data
    }
  },
  methods: {
    dispatch(action, row) {
      this.$emit('dispatch', action, row)
    }
  },
  filters: {
    mapFieldFilter(value, type, option) {
      return tools.mapFieldFilter(value, type, option)
    }
  },
  directives: {
    waves
  },
  components: {
    ViewInput,
    CustomizeButton
  }
}
</script>

