<template>
  <span>{{strValue}}</span>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    value: {
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
    strValue() {
      if (this.options && this.options.length > 0) {
        if (this.value === null || this.value === undefined || this.value === '') {
          return ''
        }
        if (this.value.split(',').length > 1) {
          return this.options.filter(item => {
            return !!this.value.split(',').find(val => {
              return val === item.value
            })
          }).map(item => {
            return item.label
          }).join(',')
        } else {
          const data = this.options.filter(item => {
            return item.value === this.value
          })
          if (data && data.length > 0) {
            return data[0].label
          }
        }
      } else {
        return this.value
      }
    }
  },
  filters: {
    valueFilter(value) {
      if (this.options && this.options.length > 0) {
        const data = this.options.filter(item => {
          return item.value === value
        })
        if (data && data.length > 0) {
          return data[0].label
        }
      } else {
        return value
      }
    }
  }
}
</script>

