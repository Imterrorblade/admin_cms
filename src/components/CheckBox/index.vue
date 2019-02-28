<template>
  <el-checkbox-group v-model="checkList" v-bind="$attrs" :max="max" :min="min">
    <el-checkbox v-for="item in dataList" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  name: 'CheckBox',
  data() {
    return {
      checkList: []
    }
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: String,
      default() {
        return ''
      }
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    }
  },
  computed: {
    dataList() {
      return this.options.map(item => {
        if (typeof item === 'string') {
          return {
            value: item,
            label: item
          }
        } else {
          return item
        }
      })
    }
  },
  methods: {
    init() {
      if (this.value) {
        this.checkList = this.value.split(',').filter(field => {
          return !!this.dataList.find(item => {
            return item.value === field
          })
        })
      } else {
        this.checkList = []
      }
    }
  },
  watch: {
    checkList: {
      handler(now, old) {
        this.$emit('input', now.join(','))
      },
      deep: true
    },
    value(now) {
      this.init()
    }
  },
  mounted() {
    this.init()
  }
}
</script>
