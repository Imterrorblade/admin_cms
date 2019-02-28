<template>
  <el-input-number v-bind="$attrs" v-on="$listeners" size="small" :min="min" :max="max"></el-input-number>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
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
    min() {
      if (this.params) {
        if (this.params.min && typeof this.params.min === 'function') {
          return this.params.min(this.temp)
        } else if (this.params.min) {
          return this.params.min
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    max() {
      if (this.params) {
        if (this.params.max && typeof this.params.max === 'function') {
          return this.params.max(this.temp)
        } else if (this.params.max) {
          return this.params.max
        }
      }
    }
  }
}
</script>
