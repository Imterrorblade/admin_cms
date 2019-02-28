<template>
  <div style="position:relative;">
    <el-tooltip content="右击可以调整选中位置" placement="top-end">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-row>
            <el-col :span="4">经度</el-col>
            <el-col :span="20"><el-input v-model="curValue.longt" size="small" ></el-input></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="4">维度</el-col>
            <el-col :span="20"><el-input v-model="curValue.lat" size="small" ></el-input></el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="7">
          <el-button type="primary" plain="" @click="getPoint()" size="small">获取坐标</el-button><el-button size="small">清空</el-button>
        </el-col> -->
      </el-row>
    </el-tooltip>
    <!-- <el-row >
      <el-col span="8">
        <input class="el-input__inner" style="width:auto;" :id="searchId" type="text" />
      </el-col>
    </el-row> -->
    <div class="maper" :id="mapId"></div>
  </div>
</template>

<script>
import BMap from 'BMap'
import SearchControl from './search.js'
// const BMap = ''
export default {
  name: 'MapView',
  data() {
    return {
      search: '',
      height: {
        type: Number,
        default: 300
      },
      map: null,
      searchId: `search_${Date.now()}`,
      mapId: `map_${Date.now()}`
    }
  },
  props: {
    value: {
      type: Object,
      // required: true,
      default() {
        return {
          lat: 39.901103,
          longt: 116.376412,
          markName: ''
        }
      }
    }
  },
  computed: {
    curValue() {
      if (!this.value.lat) {
        this.value.lat = 39.901103
      }
      if (!this.value.longt) {
        this.value.longt = 116.376412
      }
      this.value.markName = ''
      return this.value
    }
  },
  watch: {
    curValue: {
      handler: function(newval, oldval) {
        setTimeout(() => {
          this.setMarker(newval)
        }, 500)
      },
      deep: true // 对象内部的属性监听，也叫深度监听
    }
  },
  methods: {
    async init() {
      // BMap = await import('BMap')
      // console.log(BMap)
      this.initMap()
      // 右击获取点击的经纬度
      this.map.addEventListener('rightclick', e => {
      // console.log('addEventListener', e.point)
        console.log('map', this.curValue.lat, this.curValue.longt)
        this.curValue.lat = e.point.lat
        this.curValue.longt = e.point.lng
      })
    },
    initMap() {
      this.map = new BMap.Map(this.mapId)
      var point = new BMap.Point(this.curValue.longt, this.curValue.lat)
      this.map.centerAndZoom(point, 12)

      var marker = new BMap.Marker(point) // 创建标注
      this.map.addOverlay(marker)
      var label = new BMap.Label(this.curValue.markName, {
        offset: new BMap.Size(20, -10)
      })
      marker.setLabel(label)

      // 左上角 添加比列尺
      var _control = new BMap.ScaleControl({
        anchor: 3
      }) // 左上角，添加比例尺
      this.map.addControl(_control)

      // 左上角，添加默认缩放平移控件
      var top_left_navigation = new BMap.NavigationControl({
        anchor: 1
      })
      this.map.addControl(top_left_navigation)
      // 添加搜索控件
      const searchCtr = new SearchControl()
      this.map.addControl(searchCtr)

      searchCtr.addEventListener('searchComplete', (point) => {
        this.curValue.lat = point.lat
        this.curValue.longt = point.lng
      })
      // this.map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
    },
    setMarker(p) {
      this.map.clearOverlays()
      var point = new BMap.Point(p.longt, p.lat)
      this.map.centerAndZoom(point, this.map.getZoom())
      this.map.setCenter(p)
      var marker = new BMap.Marker(point) // 创建标注
      this.map.addOverlay(marker)
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style>
.maper {
  width: 100%;
  min-height: 450px;
  border-radius: 10px;
}
.BMap_cpyCtrl {
  display: none;
}

.anchorBL {
  display: none;
}
.tangram-suggestion-main {
  z-index: 10000 !important;
}
</style>

