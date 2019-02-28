<template>
  <el-button  v-bind="$attrs" v-on="$listeners">{{renderLabel}}</el-button>
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
    label: {},
    action: {}
  },
  computed: {
    renderLabel() {
      if (typeof this.label === 'function') {
        return this.label(this.temp)
      } else {
        return this.label || ''
      }
    }
  }
}
</script>
