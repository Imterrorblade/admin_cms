<template>
  <el-date-picker v-model="dateValue" :format="format" :value-format="format" size="small" :picker-options="pickerOptions"  v-bind="$attrs" v-on="$listeners" clearable=""></el-date-picker>
</template>
<script>
export default {
  data() {
    return {
      format: 'yyyy-MM-dd HH:mm:ss'
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
    }
  },
  computed: {
    dateValue: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        return this.value
      }
    },
    min() {
      if (this.params && typeof this.params.min === 'function') {
        return this.parseDate(this.params.min(this.temp))
      } else if (this.params.min) {
        return this.parseDate(this.params.min)
      } else {
        return ''
      }
    },
    max() {
      if (this.params && typeof this.params.max === 'function') {
        return this.parseDate(this.params.max(this.temp))
      } else if (this.params.max) {
        return this.parseDate(this.params.max)
      } else {
        return ''
      }
    },
    pickerOptions() {
      return {
        disabledDate: (value) => {
          if (this.min && value < this.min) {
            return true
          }
          if (this.max && value > this.max) {
            return true
          }
          return false
        }
      }
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

