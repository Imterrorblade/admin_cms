<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.scenic.name')" v-model="listQuery.query_data.name">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.query_data.level" :placeholder="$t('table.scenic.level')">
        <el-option v-for="item in  scenicLevelOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-if="curBtnRoles.search" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" v-if="curBtnRoles.add" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" v-if="curBtnRoles.export" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showauditor">{{$t('table.scenic.auditor')}}</el-checkbox>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('table.loading')" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="150px" align="center" :label="$t('table.scenic.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic.level')">
        <template slot-scope="scope">
          <span>{{scope.row.level}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic.address')">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.scenic.infor_tel')">
        <template slot-scope="scope">
          <span>{{scope.row.infor_tel}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if='showauditor' align="center" :label="$t('table.scenic.auditor')">
        <template slot-scope="scope">
          <span style='color:red;'>{{scope.row.auditor}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="curBtnRoles.edit"  @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='deleted' && curBtnRoles.del"  size="mini" type="danger" @click="handleDelete(scope.row,'deleted')">{{$t('table.delete')}}
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
          <div slot="header" class="clearfix" @click="toggleCard">
            <span>{{$t('table.scenic.module1')}}</span>
          </div>
          <div v-if="isShowModule1">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.name')" prop="name">
                  <el-input v-model="temp.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.address')" prop="address">
                  <el-input v-model="temp.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.level')" prop="level">
                  <el-select clearable class="filter-item" v-model="temp.level" :placeholder="$t('table.scenic.level')">
                    <el-option v-for="item in scenicLevelOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.contact_way')" prop="contact_way">
                  <el-input v-model="temp.contact_way"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.infor_tel')" prop="infor_tel">
                  <el-input v-model="temp.infor_tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.sos_tel')" prop="sos_tel">
                  <el-input v-model="temp.sos_tel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.scenic.open_time')" prop="open_time">
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
              <el-col :span="8">
              </el-col>
              <el-col :span="8">
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- <el-form-item :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- 这里缺少 审核  发布渠道 -->

        <!-- 开始辅助信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic.module2')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.panorama_url')">
                  <el-input v-model="temp.panorama_url"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.virtual_url')">
                  <el-input v-model="temp.virtual_url"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.website_url')">
                  <el-input v-model="temp.website_url"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.sina_no')">
                  <el-input v-model="temp.sina_no"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.wechat_sub_no')">
                  <el-input v-model="temp.wechat_sub_no"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.wechat_serv_no')">
                  <el-input v-model="temp.wechat_serv_no"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.max_content')">
                  <el-input v-model="temp.max_content"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.complaint_tel')">
                  <el-input v-model="temp.complaint_tel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.busis_tel')">
                  <el-input v-model="temp.busis_tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.fax')">
                  <el-input v-model="temp.fax"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic.module3')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.logo_image')">
                  <Upload v-model="temp.logo_image"></Upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.video')">
                  <myVideo v-model="temp.video"></myVideo>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic.module6')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item :label="$t('table.scenic.images')">
                  <Uploads v-model="services"></Uploads>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic.module4')}}</span>
          </div>
          <div>
            <el-form-item :label="$t('table.scenic.intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="intro" v-model="temp.intro"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.description')">
              <div class="editor-container">
                <tinymce :height=400 ref="description" v-model="temp.description"></tinymce>
              </div>
            </el-form-item>
            <!-- <el-form-item :label="$t('table.scenic.description_en')">
              <div class="editor-container">
                <tinymce :height=400 ref="description_en" v-model="temp.description_en"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.description_kr')">
              <div class="editor-container">
                <tinymce :height=400 ref="description_kr" v-model="temp.description_kr"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.description_jp')">
              <div class="editor-container">
                <tinymce :height=400 ref="description_jp" v-model="temp.description_jp"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.geog_env')">
              <div class="editor-container">
                <tinymce :height=400 ref="geog_env" v-model="temp.geog_env"></tinymce>
              </div>
            </el-form-item> -->
            <el-form-item :label="$t('table.scenic.service_content')">              
              <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="temp.service_content">
              </el-input>
              <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.scenic.module5')}}</span>
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
import { fetchList, createArticle, updateArticle, delArticle, fetchImages } from '@/api/list' // updateArticle
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import myVideo from '@/components/Upload/singleVideo'
import Uploads from '@/components/Upload/Images'
import MapView from '@/components/Map'
import { isvalidateTel } from '@/utils/validate'

const scenicLevelOptions = [ // 景区类型
  { key: '5A', display_name: 'AAAAA' },
  { key: '4A', display_name: 'AAAA' },
  { key: '3A', display_name: 'AAA' },
  { key: '2A', display_name: 'AA' }
]
const scenicTypeKeyValue = scenicLevelOptions.reduce((acc, cur) => {
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
    const validateTel = (rule, value, callback) => {
      // console.log('validateTel', rule)
      if (!isvalidateTel(value)) {
        rule.message = '请输入正确的号码'
        callback(new Error('请输入正确的号码'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'resource_name': 'scenic_info',
        'query_data': {
          'name': '',
          'level': '',
          'current_page': 1,
          'page_size': 10
        },
        'rel_query': false,
        'rels': []
      },
      importanceOptions: [1, 2, 3],
      scenicLevelOptions,
      sortOptions: [{ label: 'Sort Ascending', key: '+sort' }, { label: 'Sort Descending', key: '-sort' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showauditor: false,
      temp: {
        id: undefined,
        name: '',
        address: '',
        infor_tel: '',
        contact_way: '',
        open_time: '',
        open_time_start: '',
        open_time_end: '',
        sos_tel: '',
        level: '',
        panorama_url: '',
        website_url: '',
        virtual_url: '',
        busis_tel: '',
        complaint_tel: '',
        fax: '',
        logo_image: '',
        video: '',
        sina_no: '',
        wechat_sub_no: '',
        wechat_serv_no: '',
        intro: '',
        description: '',
        description_en: '',
        description_kr: '',
        description_jp: '',
        geog_env: '',
        service_content: '',
        max_content: '',
        baidu_y: '',
        baidu_x: ''
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
      isShowModule1: true,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      pvData: [],
      rules: {
        name: [{ required: true, message: this.$t('table.scenic.error.name'), trigger: 'change' }],
        address: [{ required: true, message: this.$t('table.scenic.error.address'), trigger: 'change' }],
        infor_tel: [{ required: true, message: this.$t('table.scenic.error.infor_tel'), validator: validateTel }],
        contact_way: [{ required: true, message: this.$t('table.scenic.error.contact_way'), trigger: 'change' }],
        open_time: [{ required: true, message: this.$t('table.scenic.error.open_time'), trigger: 'change' }],
        sos_tel: [{ required: true, message: this.$t('table.scenic.error.sos_tel'), validator: validateTel }],
        level: [{ required: true, message: this.$t('table.scenic.error.level'), trigger: 'change' }]
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
      return scenicTypeKeyValue[type]
    }
  },
  computed: {
    contentShortLength() {
      return this.temp.service_content.length
    },
    curBtnRoles() {
      // this.$store.dispatch('reSetBtnPermission', ['add', 'del']) // 传入自定义禁用按钮重新计算
      // console.log('curBtnRoles', this.$store.getters.btnPermission)
      return this.$store.getters.btnPermission
    }
  },
  created() {
    // 获取列表数据
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
        name: '',
        address: '',
        infor_tel: '',
        contact_way: '',
        open_time: '',
        open_time_start: '',
        open_time_end: '',
        sos_tel: '',
        level: '',
        panorama_url: '',
        website_url: '',
        virtual_url: '',
        busis_tel: '',
        complaint_tel: '',
        fax: '',
        logo_image: '',
        video: '',
        sina_no: '',
        wechat_sub_no: '',
        wechat_serv_no: '',
        intro: '',
        description: '',
        description_en: '',
        description_kr: '',
        description_jp: '',
        geog_env: '',
        service_content: '',
        max_content: '',
        baidu_y: '',
        baidu_x: ''
      }
      this.point = {
        baidu_x: 0,
        baidu_y: 0,
        markName: ''
      }
      this.services = {
        images: [],
        delImages: []
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
      fetchImages(pid).then(response => {
        if (response.data.success) {
          // console.log('fetchImages', response)
          this.services.images = response.data.data
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      // console.log('handleUpdate temp ', this.temp)
      this.temp.open_time = [new Date('2018-01-01 ' + this.temp.open_time.split('-')[0]), new Date('2018-01-01 ' + this.temp.open_time.split('-')[1])]
      this.point = {
        baidu_x: this.temp.baidu_x,
        baidu_y: this.temp.baidu_y,
        markName: this.temp.name
      }
      this.handleFetchImages(this.temp.id)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
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
          // console.log('updateData', data)
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
        delArticle(this.listQuery.resource_name, row.id).then(res => {
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
        const tHeader = [this.$t('table.scenic.name'), this.$t('table.scenic.level'), this.$t('table.scenic.address'), this.$t('table.scenic.infor_tel')]
        const filterVal = ['name', 'level', 'address', 'infor_tel']
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
    },
    toggleCard(event) {
      // console.log('event', event.toElement.parentNode)

      // this.isShowModule1 = !this.isShowModule1
    }
  }
}
</script>
