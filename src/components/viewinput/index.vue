<template>
  <!-- <dynamic-components v-bind="$attrs" v-on="$listeners"></dynamic-components> -->
  <component :is="componentName"  v-bind="$attrs" v-on="$listeners" @dispatch="dispatch()" :actions="[{action: 'delete', label:'删除'}]"></component>
</template>
<script>
import componentMap from '@/components/viewinput/config.js'
const registerComponent = Object.keys(componentMap).reduce((pre, key) => {
  pre[`${key}-component`] = () => componentMap[key]
  return pre
}, {})
export default {
  data() {
    return {
      componentName: ''
    }
  },
  props: {
    componentTarget: {
      type: String,
      default() {
        return 'string'
      }
    }
  },
  methods: {
    init() {
      this.loadComponent()
    },
    loadComponent() {
      this.componentName = this.componentTarget + '-component'
    }
  },
  components: registerComponent,
  created() {
    this.init()
  },
  mounted() {
  }

}
</script>
