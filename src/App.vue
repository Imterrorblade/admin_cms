<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script>
<style lang="scss">
  html {
    body {
      .el-loading-mask {
        background-color: rgba(255,255,255,1);
      }
    }
  }
</style>
