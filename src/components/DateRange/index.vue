<template>
  <span class="daterange">
    <el-date-picker
      v-model="dateValue"
      :format="format"
      :value-format="format"
      size="small"
      :picker-options="pickerOptions"
      :range-separator="rangeSeparator"
      :type="type"
      :start-placeholder="`开始${placeholder}`"
      :end-placeholder="`结束${placeholder}`"
      clearable=""
    ></el-date-picker>
  </span>
</template>
<script>
export default {
  data() {
    return {
      format: 'yyyy-MM-dd HH:mm:ss',
      type: 'daterange'
    }
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    temp: {
      type: Object,
      default() {
        return {}
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    rangeSeparator: {
      type: String,
      default() {
        return '-'
      }
    },
    separator: {
      type: String,
      default() {
        return '->'
      }
    },
    placeholder: {
      type: String,
      default() {
        return ''
      }
    }
  },
  computed: {
    dateValue: {
      set(value) {
        if (value) {
          this.$emit('input', value.join(this.separator))
        } else {
          this.$emit('input', value)
        }
      },
      get() {
        if (this.value) {
          return this.value.split(this.separator)
        } else {
          return this.value
        }
      }
    },
    pickerOptions() {
      return {}
    }
  },
  methods: {
    parseDate(date) {
      if (date && date instanceof Date) {
        return date
      } else {
        try {
          return new Date(date)
        } catch (err) {
          throw new Error('the param date isnot a Date type')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.daterange {
  .filter-container .filter-item {
    line-height: 24px;
  }
}
</style>

