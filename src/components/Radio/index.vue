<template>
  <el-radio-group v-model="modelValue">
    <el-radio v-for="item in selectList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  data() {
    return {}
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
        return []
      }
    }
  },
  computed: {
    selectList() {
      return this.options
    },
    modelValue: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        return this.value
      }
    }
  }
}
</script>

<style>

</style>

