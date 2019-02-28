<template>
  <el-dialog v-bind="$attrs" :visible.sync="dialogVisible" append-to-body="">
    <div v-if="dialogVisible">
      <check-box v-model="spots" :options="spotsList"></check-box>
      <!-- <el-checkbox-group v-model="list">
        <div>
          <el-checkbox v-for="item in spotsList" :key="item.id"  :label="item.value">{{item.label}}</el-checkbox>
        </div>
      </el-checkbox-group> -->
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="commit">确定</el-button>
    </div>
  </el-dialog>

</template>
<script>
import CheckBox from '@/components/CheckBox'
export default {
  data() {
    return {
      spots: '',
      dialogVisible: false
    }
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    spotsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    // sopts: {
    //   set(value) {
    //     this.$emit('input', value)
    //   },
    //   get() {
    //     return this.value
    //   }
    // }
  },
  methods: {
    init() {
      this.initList()
    },
    initList() {
      this.spots = this.value
    },
    commit() {
      this.dialogVisible = false
      this.$emit('input', this.spots)
    },
    open() {
      this.dialogVisible = true
      this.init()
    }
  },
  mounted() {
  },
  watch: {
    value(now) {
      this.initList()
    }
  },
  components: {
    CheckBox
  }
}
</script>
