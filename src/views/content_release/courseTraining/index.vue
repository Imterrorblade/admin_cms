<template>
   <ctr-tabs :tabs="tabs"></ctr-tabs>
</template>
<script>
import CtrTabs from '@/views/template/controller/tabs'
export default {
  data() {
    return {
      tabs: [{
        name: 'colleges',
        label: '院校管理',
        component: import('./children/colleges.vue')
      }, {
        name: 'curriculum',
        label: '课程管理',
        component: import('./children/curriculum.vue')
      }, {
        name: 'lecturer',
        label: '讲师管理',
        component: import('./children/lecturer.vue')
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
