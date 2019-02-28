<template>
  <div class="upload-container">
    <div class="image-preview image-app-preview" v-for="(img,index) in images" v-bind:key="index">
      <div class="image-preview-wrapper" >
        <img :src="img.path">
        <div class="image-preview-action" v-if="!params.onlyshow">
          <i @click="rmImage(img,index)" class="el-icon-delete"></i>
        </div>
      </div>
    </div>
    <el-upload v-if="!params.onlyshow" class="image-preview image-app-preview" :data="dataObj" drag :multiple="true" 
        :show-file-list="false" action="_api_/cms/material/uploadMaterial" :accept="this.acceptTypes.map(item => {
        return `image/${item}`
      }).toString()"  :on-progress="handleProgress"
        :on-success="handleImageScucess" :before-upload="beforeUpload" :on-error="handleError">
      <div v-show="!uploading" >  
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>
        <em style="color:red;">*格式：{{this.acceptTypes.toString()}}，不超过{{sizeStr}}</em>
        </div>
      </div>
      <div v-show="uploading" style="padding:20px;">  
        <el-progress type="circle" :percentage="Math.floor(percent)"></el-progress>
      </div>
    </el-upload>
  </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'
import { getSize } from '@/utils/index.js'

export default {
  name: 'ImagesUpload',
  data() {
    return {
      // imageData: this.value,
      tempUrl: '',
      dataObj: { token: '', key: '' },
      uploading: false,
      percent: ''
    }
  },
  props: {
    value: {
      type: String,
      default: () => {
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
    images: {
      set(value) {
        console.log('set', value)
        this.$emit('input', value.map(item => {
          return item.path
        }).join(','))
      },
      get() {
        console.log('get', this.value, this)
        if (this.value) {
          return this.value.split(',').map(url => {
            return {
              id: Date.now(),
              path: url
            }
          })
        } else {
          return []
        }
      }
    },
    strs: {
      set(value) {
        this.str = value.join(',')
      },
      get() {
        return this.str.split(',')
      }
    },
    acceptTypes() {
      return this.params.acceptTypes || ['jpg', 'png', 'jpeg']
    },
    maxSize() {
      return this.params.maxSize || 10 * 1024 * 1024
    },
    sizeStr() {
      return getSize(this.maxSize).str
    }
  },

  methods: {
    rmImage(item, index) {
      this.images.splice(this.images.findIndex(img => {
        return item.id === img.id
      }), 1)
      this.images = JSON.parse(JSON.stringify(this.images))
    },
    handleProgress(event) {
      this.percent = event.percent
    },
    handleImageScucess(file) {
      this.uploading = false
      if (file.success) {
        this.images.push({
          id: Date.now(),
          path: file.data[0].url
        })

        //* *** 此处请注意 因为vue数组变化监听不是调用的set 方法进行监听 所以计算属性定义的数组变化时不会触发 ，所以需要对整个数据进行赋值才能触发定义的set 方法
        this.images = JSON.parse(JSON.stringify(this.images))
        this.$emit('uploadChange', 'success')
      }
    },
    beforeUpload(file) {
      if (file.size > this.maxSize) {
        this.$message({
          type: 'error',
          message: '上传文件超过最大限制'
        })
        return false
      }
      this.percent = 0
      this.uploading = true
      this.$emit('uploadChange', 'before')
      // const _self = this
      // return new Promise((resolve, reject) => {
      //   getToken().then(response => {
      //     const key = response.data.qiniu_key
      //     const token = response.data.qiniu_token
      //     _self._data.dataObj.token = token
      //     _self._data.dataObj.key = key
      //     this.tempUrl = response.data.qiniu_url
      //     resolve(true)
      //   }).catch(err => {
      //     console.log(err)
      //     reject(false)
      //   })
      // })
    },
    handleError() {
      this.uploading = false
      this.$emit('uploadChange', 'error')
      this.$message({
        title: '提示',
        message: '上传失败',
        type: 'error'
      })
    }
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 35%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    margin-bottom: 10px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
  .image-app-preview {
    width: 320px;
    height: 180px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 50px;
    .app-fake-conver {
      height: 44px;
      position: absolute;
      width: 100%; // background: rgba(0, 0, 0, .1);
      text-align: center;
      line-height: 64px;
      color: #fff;
    }
  }
}
</style>
