<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-select clearable class="filter-item" style="width: 200px" v-model="listQuery.query_data.type" :placeholder="$t('table.common.type')">
        <el-option v-for="item in  typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
      <el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showauditor">{{$t('table.scenic.auditor')}}</el-checkbox>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('table.loading')" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="150px" align="center" :label="$t('table.common.type')">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center" :label="$t('table.common.link_address')">
        <template slot-scope="scope">
          <span>{{scope.row.link_address}}</span>
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
            <span>{{$t('table.common.module1')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.common.type')" prop="type">
                  <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
                    <el-option v-for="item in  typeOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.common.link_address')" prop="link_address">
                  <el-input v-model="temp.link_address" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- 开始辅助信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{$t('table.common.module3')}}</span>
          </div>
          <div>
            <el-form-item :label="$t('table.common.logo_image')">
              <Upload v-model="temp.logo_image"></Upload>
            </el-form-item>
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
  // const scenicTypeKeyValue = scenicTypeOptions.reduce((acc, cur) => {
  //   acc[cur.key] = cur.display_name
  //   return acc
  // }, {})

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
          'resource_name': 'carousel_figure',
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
        typeOpts: [{
          label: '官网',
          value: 'website'
        }, {
          label: '电商',
          value: 'retailers'
        }],
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
      // typeFilter(type) {
      //   return scenicTypeKeyValue[type]
      // },
      typeFilter(type) {
        console.log(type)
        const map = {
          website: '官网',
          retailers: '电商'
        }
        return map[type]
      }
    },
    computed: {
      contentShortLength() {
        return this.service_content ? this.temp.service_content.length : 0
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
