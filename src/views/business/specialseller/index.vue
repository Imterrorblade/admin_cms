
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.scenic.name')" v-model="listQuery.query_data.name">
      </el-input>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.query_data.level" :placeholder="$t('table.scenic.level')">
        <el-option v-for="item in  scenicTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.query_data.current_page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.query_data.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog width="80%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="110px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.name')" prop="name">
                  <el-input v-model="temp.name" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.address')" prop="address">
                  <el-input v-model="temp.address" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.infor_tel')" prop="infor_tel">
                  <el-input v-model="temp.infor_tel" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.open_time')" prop="open_time">
                  <el-input v-model="temp.open_time" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.contact_way')" prop="contact_way">
                  <el-input v-model="temp.contact_way" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.sos_tel')" prop="sos_tel">
                  <el-input v-model="temp.sos_tel" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.scenic.level')" prop="level">
                  <el-select class="filter-item" v-model="temp.level" placeholder="Please select">
                    <el-option v-for="item in  scenicTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">

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
            <span>辅助信息</span>
          </div>
          <div>
            <el-form-item :label="$t('table.scenic.panorama_url')">
              <el-input v-model="temp.panorama_url"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.website_url')">
              <el-input v-model="temp.website_url"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.virtual_url')">
              <el-input v-model="temp.virtual_url"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.busis_tel')">
              <el-input v-model="temp.busis_tel"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.complaint_tel')">
              <el-input v-model="temp.complaint_tel"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.fax')">
              <el-input v-model="temp.fax"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.logo_image')">
              <Upload v-model="temp.logo_image"></Upload>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.video')">
              <myVideo v-model="temp.video"></myVideo>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.sina_no')">
              <el-input v-model="temp.sina_no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.wechat_sub_no')">
              <el-input v-model="temp.wechat_sub_no"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.scenic.wechat_serv_no')">
              <el-input v-model="temp.wechat_serv_no"></el-input>
            </el-form-item>
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

            <el-form-item :label="$t('table.scenic.max_content')">
              <div class="editor-container">
                <!-- <tinymce :height=400 ref="max_content" v-model="temp.max_content"></tinymce> -->
                <el-input v-model="temp.max_content"></el-input>
              </div>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>位置信息</span>
          </div>
          <div>
            <MapView :longitude="temp.baidu_x" :latitude="temp.baidu_y" :markName="temp.name"></MapView>
          </div>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<style>
  .box-card{
    margin-bottom: 20px;
  }
</style>

<script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/list'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/singleImage3'
  import myVideo from '@/components/Upload/singleVideo'
  import MapView from '@/components/Map'

  const scenicTypeOptions = [ // 景区类型
    { key: '5A', display_name: 'AAAAA' },
    { key: '4A', display_name: 'AAAA' },
    { key: '3A', display_name: 'AAA' },
    { key: '2A', display_name: 'AA' }
  ]
  const scenicTypeKeyValue = scenicTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'complexTable',
    components: { Tinymce, Upload, myVideo, MapView },
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
          'resource_name': 'tourism_product',
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
        scenicTypeOptions,
        sortOptions: [{ label: 'Sort Ascending', key: '+sort' }, { label: 'Sort Descending', key: '-sort' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showauditor: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published',
          service_content: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
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
        return scenicTypeKeyValue[type]
      }
    },
    computed: {
      contentShortLength() {
        return this.temp.service_content.length
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery, this.$route).then(response => {
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
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log('handleUpdate temp ', this.temp)
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            const data = {
              'resource_name': 'scenic_info',
              'id': 'aa391d5f2b4d4743a82bc3084c37903f',
              'sub_data': tempData,
              'services': []
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
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
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
