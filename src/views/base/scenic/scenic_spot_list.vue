<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.scenic_spot.name')" v-model="listQuery.query_data.name">
      </el-input>
      <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.parentScenic" :placeholder="$t('table.scenic_spot.parentScenic')">
        <el-option v-for="item in parentScenic" :key="item" :label="item" :value="item">
        </el-option>
      </el-select> -->
      <el-select clearable class="filter-item"  v-model="listQuery.query_data.scenic_type" :placeholder="$t('table.scenic_spot.spotType')">
        <el-option v-for="item in  scenicSpotTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-if="curBtnRoles.search" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" v-if="curBtnRoles.add" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" v-if="curBtnRoles.export" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('table.loading')" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="150px" align="center" :label="$t('table.scenic_spot.name')">
        <template slot-scope="scope">
          <span>{{scope.row.scenic_spot_info_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic_spot.parentScenic')">
        <template slot-scope="scope">
          <span>{{scope.row.scenic_info_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic_spot.spotType')">
        <template slot-scope="scope">
          <span>{{scope.row.scenic_spot_info_scenic_type  | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic_spot.recommend')">
        <template slot-scope="scope">
          <span>{{scope.row.scenic_spot_info_is_recommend | recommendFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" v-if="curBtnRoles.edit" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='deleted' && curBtnRoles.del" size="mini" type="danger" 
            @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.query_data.current_page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.query_data.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog width="80%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" 
        label-position="right" label-width="110px" size="small">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module1')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.name')" prop="name">
                  <el-input v-model="temp.name">
                    <el-select clearable class="filter-item input-with-selec" v-model="temp.spotType" slot="append"
                      :placeholder="$t('table.scenic_spot.spotType')">
                      <el-option v-for="item in scenicSpotTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.is_top')" >
                  <el-switch v-model="temp.is_top"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.open_time')" prop="open_time">
                  <el-time-picker
                    is-range
                    v-model="temp.open_time"
                    range-separator="-"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                  </el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.channel')">
                  <el-checkbox-group v-model="temp.channel">
                      <el-checkbox size="medium" v-for="item in channelOpts"  
                        :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.panorama_url')">
                  <el-input v-model="temp.panorama_url"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.td_map_url')">
                  <el-input v-model="temp.td_map_url"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item :label="$t('table.scenic_spot.description')">
                  <el-input type="textarea" autosize v-model="temp.description"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module2')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.image')">
                  <Upload v-model="temp.image"></Upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.no')">
                  <el-select clearable class="filter-item" v-model="temp.no" :placeholder="$t('table.scenic_spot.spotType')">
                    <el-option v-for="item in scenicSpotTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module3')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.logo_image')">
                  <Upload v-model="temp.logo_image"></Upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module4')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic_spot.images')">
                  <Uploads v-model="services"></Uploads>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module5')}}</span>
          </div>
          <div>
            <el-form-item :label="$t('table.scenic_spot.intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="intro" v-model="temp.intro"></tinymce>
              </div>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module6')}}</span>
          </div>
          <div>
                <el-form-item :label="$t('table.scenic_spot.video')">
                  <myVideo v-model="temp.video"></myVideo>
                </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module7')}}</span>
          </div>
          <div>
                <el-form-item :label="$t('table.scenic_spot.video')">
                  <myVideo v-model="temp.video"></myVideo>
                </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic_spot.module8')}}</span>
          </div>
          <div>
            <MapView v-bind:curpoint="point"></MapView>
          </div>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
  .box-card{
    margin-bottom: 20px;
  }
</style>
<script>
import { fetchList, fetchDetail, fetchImages, createArticle, updateArticle, delArticle } from '@/api/list'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import myVideo from '@/components/Upload/singleVideo'
import Uploads from '@/components/Upload/Images'
import MapView from '@/components/Map'

const scenicSpotTypeOptions = [ // 景点类型
  { key: 'piDiScenic', display_name: '普底景区' },
  { key: 'jinPoScenic', display_name: '金坡景区' },
  { key: 'specialVillage', display_name: '特色乡村' },
  { key: 'others', display_name: '其他' }
]

const scenicSpotTypeKeyValue = scenicSpotTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'complexTable',
  components: { Tinymce, Upload, Uploads, myVideo, MapView },
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'resource_name': 'scenic_spot_info',
        'query_data': {
          'name': '',
          'scenic_type': '',
          'current_page': 1,
          'page_size': 10
        },
        'rel_query': true,
        'rels': [{
          'rel_resource_name': 'scenic_info',
          'rel_field': 'id',
          'main_field': 'scenic_id'
        }]
      },
      parentScenic: ['百里杜鹃风景名胜区'],
      scenicSpotTypeOptions,
      sortOptions: [{ label: 'Sort Ascending', key: '+sort' }, { label: 'Sort Descending', key: '-sort' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showauditor: false,
      examineOpts: [{
        label: '未审核',
        value: 'check_N'
      }, {
        label: '审核通过',
        value: 'check_Y'
      }, {
        label: '待发布',
        value: 'publish_N'
      }, {
        label: '发布成功',
        value: 'publish_Y'
      }],
      channelOpts: [{
        label: '官网',
        value: 'website'
      }, {
        label: '电商平台',
        value: 'Electronic'
      }, {
        label: '触摸屏',
        value: 'touch'
      }, {
        label: '微信',
        value: 'wechat'
      }, {
        label: 'wap',
        value: 'wap'
      }],
      temp: {
        id: undefined,
        parentScenic: '',
        spotType: '',
        recommend: '',
        open_time: '',
        panorama_url: '',
        td_map_url: '',
        is_top: '',
        to_examine: '',
        channel: [],
        description: '',
        no: '',
        image: '',
        logo_image: '',
        intro: '',
        voice_guide: '',
        video: '',
        baidu_x: '',
        baidu_y: ''
      },
      services: {
        images: [],
        delImages: []
      },
      point: {
        baidu_x: 0,
        baidu_y: 0,
        markName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return scenicSpotTypeKeyValue[type]
    },
    recommendFilter(recommend) {
      return recommend === 'Y' ? '是' : '否'
    }
  },
  computed: {
    curBtnRoles() {
      // this.$store.dispatch('reSetBtnPermission', ['add', 'del']) // 传入自定义禁用按钮重新计算
      return this.$store.getters.btnPermission
    }
  },
  created() {
    // 获取按钮权限
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        // console.log('getList', response)
        this.list = response.data.data.data
        this.total = response.data.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.query_data.current_page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.query_data.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.query_data.current_page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        parentScenic: '',
        spotType: '',
        recommend: '',
        open_time: '',
        panorama_url: '',
        td_map_url: '',
        is_top: '',
        to_examine: '',
        channel: [],
        description: '',
        no: '',
        image: '',
        logo_image: '',
        intro: '',
        voice_guide: '',
        video: '',
        baidu_x: '',
        baidu_y: ''
      }
      this.services = {
        images: [],
        delImages: []
      }
      this.point = {
        baidu_x: 0,
        baidu_y: 0,
        markName: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFetchImages(pid) {
      // console.log('handleFetchImages pid', pid)
      fetchImages(pid).then(response => {
        // console.log('fetchImages', response)
        if (response.data.success) {
          this.services.images = response.data.data
        }
      })
    },
    handleServices() { // 处理图集信息,
      const result = []
      const images = this.services.images.map(item => {
        return {
          show_sort: item.show_sort,
          url: item.url,
          description: '',
          pkid: item.id
        }
      })
      const delImages = this.services.delImages.map(item => {
        return {
          id: item.id
        }
      })
      result.push({
        'images': images,
        'delImages': delImages,
        'service': 'materialService',
        'resource_name': 'cms_material_info'
      })
      return result
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // 复制当前行
      // console.log('handleUpdate', row)
      this.listLoading = true
      this.handleFetchImages(row.scenic_spot_info_id)
      fetchDetail('scenic_spot_info', row.scenic_spot_info_id)
        .then(response => {
          this.temp = Object.assign({}, response.data.data)
          this.listLoading = false
          this.dialogStatus = 'update'
          this.dialogFormVisible = true

          this.temp.channel = this.temp.channel.split(',')
          this.temp.is_top = this.temp.is_top === 'Y'
          this.point = {
            baidu_x: this.temp.baidu_x,
            baidu_y: this.temp.baidu_y,
            markName: this.temp.name
          }
          this.temp.open_time = [new Date('2018-01-01 ' + this.temp.open_time.split('-')[0]), new Date('2018-01-01 ' + this.temp.open_time.split('-')[1])]

          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.baidu_x = this.point.baidu_x
          this.temp.baidu_y = this.point.baidu_y
          this.temp.open_time = parseTime(this.temp.open_time[0], '{h}:{i}') + '-' + parseTime(this.temp.open_time[1], '{h}:{i}')
          const services = this.handleServices()

          const data = {
            'resource_name': 'scenic_info',
            'id': this.temp.id,
            'sub_data': this.temp,
            'services': services
          }
          updateArticle(data).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('您确定要执行删除操作么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('this.listQuery.resource_name', this.listQuery.resource_name, row.scenic_spot_info_id)
        delArticle(this.listQuery.resource_name, row.scenic_spot_info_id).then(res => {
          // console.log('delArticle res', res)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch((e) => {
        // console.log('delArticle catch e', e)
        this.$notify({
          title: '取消',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('table.scenic_spot.name'), this.$t('table.scenic_spot.parentScenic'), this.$t('table.scenic_spot.spotType'), this.$t('table.scenic_spot.recommend')]
        const filterVal = ['name', 'parentScenic', 'spotType', 'recommend']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
