<template>
  <div class="filter-container">
      <view-input v-for="(field, index) in fields" :key="index" v-model="searchTemp[field.field]" :value="searchTemp[field.field]" :componentTarget="field.type" :options="field.children" @keyup.enter.native="handleFilter" :style="{width: `${getWidth(field.type)}`}" class="filter-item" :placeholder="field.label"></view-input>
      <el-button v-for="btn in btns" :key="btn.action" class="filter-item" type="primary" v-waves :icon="btn.icon" @click="dispatch(btn.action)">{{btn.label}}</el-button>
    </div>
</template>
<script>
import waves from '@/directive/waves' // 水波纹指令
import ViewInput from '@/components/viewinput'
export default {
  data() {
    return {
      autoWidthType: ['daterange']
    }
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    btns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    searchTemp: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  components: {
    ViewInput
  },
  directives: {
    waves
  },
  methods: {
    dispatch(action = 'search') {
      this.$emit('dispatch', action, this.searchTemp)
    },
    getWidth(type) { // 获取组件需要的宽度
      const autoTypes = ['daterange']
      if (autoTypes.indexOf(type) > -1) {
        return 'auto'
      } else {
        return '200px'
      }
    }
  }
}
</script>
