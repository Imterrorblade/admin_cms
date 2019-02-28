<template>
  <el-tabs v-model="activeTab" type="border-card" >
     <el-tab-pane v-for="(tab , index) in tabs" :key="index" :name="tab.name" :label="tab.label">
       <component v-if="activeTab === tab.name" :is="tab.name"></component>
     </el-tab-pane>
  </el-tabs>
</template>
<script>

export default {
  data() {
    return {
      activeTab: ''
    }
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
  },
  methods: {
    init() {
      this.registerComponents()
      this.activeTab = this.tabs[0].name
    },
    registerComponents() { // 动态组件祖册
      this.tabs.map(tab => {
        this.$options.components[tab.name] = () => tab.component
      })
    }
  },
  created() {
    this.init()
    console.log('vue this', this)
  },
  components: {}
}
</script>
