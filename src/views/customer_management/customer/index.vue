<template>
  <div class="app-container calendar-list-container">
    <ctr-search :config="config"></ctr-search>
    <ctr-table :config="config"></ctr-table>
  </div>
</template>
<script>

import CtrSearch from '@/views/template/controller/search'
import CtrTable from '@/views/template/controller/table'
import Actions from '@/utils/actions.js'
export default {
  data() {
    return {
      config: {
        fieldsMap: {
          name: {
            type: 'string',
            label: '名称'
          }
        },
        resource_name: '',
        searchFields: ['name'],
        tableFields: ['name'],
        actions: new Actions()
      }
    }
  },
  components: {
    CtrTable,
    CtrSearch
  }
}
</script>
