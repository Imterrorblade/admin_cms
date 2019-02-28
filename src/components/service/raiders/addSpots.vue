<template>
  <span>
    <span v-for="(item, index) in renderList" :key="index" style="margin-right: 10px;">{{item.label}}</span>
    <el-button v-if="!params.onlyshow" size="mini" @click="toAddSpots" type="primary" plain="">+关联景点</el-button>
    <spot-list ref="spot" v-model="spots" :spotsList="spotsList" title="景点信息" width="30%"></spot-list>
  </span>
</template>
<script>
import apiList from '@/api/list.js'
import SpotList from '@/components/service/raiders/spotlist'
export default {
  data() {
    return {
      spotsList: [],
      dialogVisible: false
    }
  },
  props: {
    value: {
      type: String,
      default() {
        return ''
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    renderList() {
      return this.spots.split(',').map(item => {
        const spot = this.spotsList.find(spot => {
          return spot.value === item
        })
        if (spot) {
          return spot
        } else {
          return {
            value: item,
            label: item
          }
        }
      })
    },
    spots: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        if (this.value) {
          return this.value
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    init() {
      this.getSpots()
    },
    async getSpots() {
      try {
        const res = await apiList.fetchList({
          page: 1,
          limit: 1000,
          resource_name: 'cms_spot_manage',
          querydata: JSON.stringify({
            language: 'chinese'
          })
        })
        if (res.data.success) {
          this.spotsList = res.data.data.map(item => {
            return {
              value: item.id,
              label: item.spot_name
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    toAddSpots() {
      this.$refs.spot.open()
    }
  },
  components: {
    SpotList
  },
  mounted() {
    this.init()
  }
}
</script>
