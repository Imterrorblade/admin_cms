<template>
  <el-select  v-model="modelValue"  clearable size="small" v-bind="$attrs" v-on="$listeners" >
    <el-option v-for="(opt, index) in renderOptions" :key="index" :value="opt.value" :label="opt.label"></el-option>
  </el-select>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    options: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    modelValue: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        return this.value
      }
    },
    renderOptions() {
      return this.options
    }
  }
}
</script>
