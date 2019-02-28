<template>
   <ctr-tabs :tabs="tabs"></ctr-tabs>
</template>
<script>
import CtrTabs from '@/views/template/controller/tabs'
export default {
  data() {
    return {
      tabs: [{
        name: 'ticketing',
        label: '票务政策',
        component: import('./children/ticketing.vue')
      }, {
        name: 'online',
        label: '在线咨询',
        component: import('./children/online.vue')
      }]
    }
  },

  created() {
  },
  components: {
    CtrTabs
  }

}
</script>
