<template>
  <div>
    <el-button v-if="!params.onlyshow" @click="addItem()" type="primary"  size="mini">添加</el-button>
    <el-table border="" :data="list">
      <el-table-column prop="category" label="门票分类">
        <template slot-scope="scope">
          <el-input v-if="!params.onlyshow" v-model="scope.row.category" size="small"></el-input>
          <span v-else>{{scope.row.category}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="对应价格（元/人）">
        <template slot-scope="scope">
          <el-input-number v-if="!params.onlyshow" v-model="scope.row.price" :min="0" size="small"></el-input-number>
          <span v-else>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!params.onlyshow"  label="操作">
        <template slot-scope="scope">
          <el-button @click="removeItem(scope)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import ComTable from '@/views/template/components/table'
export default {
  data() {
    return {
      list: []
    }
  },
  props: {
    value: {
      type: String,
      default() {
        return '[]'
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    init() {
      this.renderList()
    },
    renderList() {
      try {
        this.list = JSON.parse(this.value)
      } catch (err) {
        this.list = []
      }
    },
    addItem() {
      this.list.push({
        price: 0,
        category: ''
      })
    },
    removeItem(scope) {
      this.list.splice(scope.$index, 1)
    }
  },
  watch: {
    list: {
      handler(now, old) {
        this.$emit('input', JSON.stringify(this.list))
      },
      deep: true
    },
    value(now) {
      this.renderList()
    }
  },
  components: {
    ComTable
  },
  mounted() {
    this.init()
  }
}
</script>

