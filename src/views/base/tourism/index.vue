<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.tourism.name')" v-model="listQuery.query_data.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button v-if="curBtnRoles.add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
      <el-button v-if="curBtnRoles.export" class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('table.loading')" border fit highlight-current-row
              style="width: 100%">
      <el-table-column min-width="150px" align="center" :label="$t('table.tourism.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tourism.original_price')">
        <template slot-scope="scope">
          <span>{{scope.row.original_price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tourism.price')">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tourism.product_type')">
        <template slot-scope="scope">
          <span>{{scope.row.product_type}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tourism.open_time')">
        <template slot-scope="scope">
          <span>{{scope.row.open_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.tourism.outer_code')">
        <template slot-scope="scope">
          <span>{{scope.row.outer_code}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" :label="$t('table.tourism.is_top')">
        <template slot-scope="scope">
          <span style=''>{{scope.row.is_top === 'Y'?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="curBtnRoles.edit" type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{$t('table.publish')}}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted' && curBtnRoles.del" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
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
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.name')" prop="name">
                  <el-input v-model="temp.name" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.ename')" prop="ename">
                  <el-input v-model="temp.en_name" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.address')" prop="address">
                  <el-input v-model="temp.address" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.original_price')" prop="original_price">
                  <el-input-number v-model="temp.original_price" size="small"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.package_price')" prop="package_price">
                  <el-input-number v-model="temp.package_price" size="small"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.price')" prop="price">
                  <el-input-number v-model="temp.price" size="small"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.outer_code')" prop="outer_code">
                  <el-input v-model="temp.outer_code" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.product_type')" prop="product_type">
                  <el-select class="filter-item" v-model="temp.product_type" :placeholder="$t('table.pleaseSelect')">
                    <el-option v-for="item in  product_typeOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.is_book')" prop="is_book">
                  <el-select class="filter-item" v-model="temp.is_book" :placeholder="$t('table.pleaseSelect')">
                    <el-option label="可预订" value="true"></el-option>
                    <el-option label="不可预订" value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">   
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.tel')" prop="tel">
                  <el-input v-model="temp.tel" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.open_time')" prop="open_time">
                  <el-time-picker v-model="temp.open_time"></el-time-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.to_examine')" prop="to_examine">
                  <el-select  class="filter-item" v-model="temp.to_examine" :placeholder="$t('table.pleaseSelect')">
                    <el-option  v-for="item in examineOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.check_num')" prop="check_num">
                  <el-input v-model="temp.check_num" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.judge_number')" prop="judge_number">
                  <el-input v-model="temp.judge_number" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('table.tourism.no')" prop="no">
                  <el-select v-model="temp.no" class="filter-item" :placeholder="$t('table.pleaseSelect')">
                    <el-option v-for="item in noOpts" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.tourism.channel')" prop="channel">
                  <CheckBox v-model="temp.channel" :options="channelOpts"></CheckBox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item :label="$t('table.tourism.description')" prop="description">
                  <el-input type="textarea" v-model="temp.description"></el-input>
                </el-form-item>
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
            <span>{{$t('table.common.module3')}}</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('table.tourism.image')">
                  <Upload v-model="temp.image"></Upload>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('table.tourism.logo_image')" prop="logon_image">
                  <Upload v-model="temp.logo_image"></Upload>
                 </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item :label="$t('table.tourism.scenic_images')">
                  <Upload v-model="temp.scenic_images"></Upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{$t('table.common.module4')}}</span> 
          </div>
          <div>
            <el-form-item :label="$t('table.tourism.intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="intro" v-model="temp.intro"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.tourism.rem_intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="rem_intro" v-model="temp.rem_intro"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.tourism.prefre_intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="prefre_intro" v-model="temp.prefre_intro"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.tourism.regular_intro')">
              <div class="editor-container">
                <tinymce :height=400 ref="regular_intro" v-model="temp.regular_intro"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.tourism.know')">
              <div class="editor-container">
                <tinymce :height=400 ref="know" v-model="temp.know"></tinymce>
              </div>
            </el-form-item>
            <el-form-item :label="$t('table.tourism.order_know')">
              <div class="editor-container">
                <tinymce :height=400 ref="order_know" v-model="temp.order_know"></tinymce>
              </div>
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
  import CheckBox from '@/components/CheckBox'
  import { getRules } from '@/utils/validate'
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
    components: {
      Tinymce, Upload, myVideo, MapView, CheckBox },
    directives: {
      waves
    },
    data() {
      /* const cehckRequire1 = (rule, value, callback) => {
        console.log('validateTel', rule)
        if (!cehckRequire(value)) {
          rule.message = '请输入正确的号码'
          callback(new Error('请输入正确的号码'))
        } else {
          callback()
        }
      }*/
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
        product_typeOptions: ['成人票', '半价票', '儿童票', '交通票'],
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
        noOpts: [0, 1, 2, 3, 4, 5],
        sortOptions: [{ label: 'Sort Ascending', key: '+sort' }, { label: 'Sort Descending', key: '-sort' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showauditor: false,
        temp: {
          id: undefined,
          name: '',
          type: '',
          logo_image: '',
          image: '',
          package_price: '',
          channel: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: this.getRules([
          { name: 'table.tourism.name' },
          { ename: 'table.tourism.ename' },
          'address', 'tel', 'original_price', 'price', 'package_price', 'outer_code', 'open_time',
          { is_book: 'table.tourism.is_book' }, 'outer_code',
          {
            product_type: 'table.tourism.product_type'
          },
          'to_examine', { description: 'table.tourism.description' }, 'logo_image'
        ]),
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
        return this.service_content ? this.temp.service_content.length : 0
      },
      curBtnRoles() {
        // this.$store.dispatch('reSetBtnPermission', ['add', 'del']) // 传入自定义禁用按钮重新计算
        return this.$store.getters.btnPermission
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
          name: '',
          type: '',
          logo_image: '',
          image: '',
          package_price: '',
          channel: ''
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
      },
      getRules(fiels) {
        return getRules(fiels, this)
      }
    }
  }
</script>
