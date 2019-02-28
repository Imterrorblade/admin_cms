<template>
  <div class="upload-container">
    <el-upload v-if="!params.onlyshow" class="image-preview image-app-preview" :data="dataObj" drag :multiple="false" :show-file-list="false" 
      action="_api_/cms/material/uploadMaterial"  v-show="!videoUrl" :accept="this.acceptTypes.map(item => {
        return `video/${item}`
      }).toString()" :on-progress="handleProgress"
      :on-success="handleImageScucess" :before-upload="beforeUpload" :on-error="handleError" >
      <div v-show="!uploading">  
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><br>
        <em style="color:red;">*格式：{{this.acceptTypes.toString()}}，不超过{{sizeStr}}</em>
        </div>
      </div>
      <div v-show="uploading" style="padding:20px;">  
        <el-progress type="circle" :percentage="Math.floor(percent)"></el-progress>
      </div>
    </el-upload>
    <div class="" v-show="videoUrl">
      <div class="">
        <video :src="videoUrl" class="myvideo" controls="controls">
            您的浏览器不支持 video 标签。
        </video>
        <span class="" v-if="!params.onlyshow">
          <i @click="rmImage" class="el-icon-delete"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
// import { getToken } from '@/api/qiniu'
import { getSize } from '@/utils/index.js'

export default {
  name: 'singleVideo',
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
    videoUrl() {
      console.log('videoUrl', this.value)
      return this.value
    },
    acceptTypes() {
      return this.params.acceptTypes || ['mp4', 'ogg', 'webm']
    },
    maxSize() {
      return this.params.maxSize || 100 * 1024 * 1024
    },
    sizeStr() {
      return getSize(this.maxSize).str
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' },
      uploading: false,
      percent: 0
    }
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleProgress(event) {
      this.percent = event.percent
    },
    handleImageScucess(file) {
      // console.log('handleImageScucess', file)
      this.uploading = false
      if (file.success) {
        this.emitInput(file.data[0].url)
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
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    margin-left: 0px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
      video{
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
    margin-left: 0px;
    .el-upload {
      width: 100%;
      height: 100%;
      .el-upload-dragger {
        height: 100%;
        width: 100%;
      }
    }
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
