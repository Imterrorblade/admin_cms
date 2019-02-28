<template>
  <component :is="componentName"  v-bind="$attrs" v-on="$listeners"></component>
</template>
<script>
export default {
  data() {
    return {
      componentName: 'defaultBtn'
    }
  },
  props: {},
  components: {
    defaultBtn: () => import('./default.vue')
  },
  methods: {
    init() {}
  },
  mounted() {
    this.init()
  }
}
</script>
