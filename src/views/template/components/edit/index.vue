<template>
  <div>
    <el-form :rules="rules" :model="temp" ref="form" label-position="right" label-width="110px">
      <el-card v-show="loading" v-loading="loading" element-loading-text="加载中" style="min-height:300px;"></el-card>
      <el-card v-if="!loading" v-for="(view, key) in views" :key="key" class="box-card" style="margin-bottom: 40px;">
        <div slot="header" class="clearfix">
          <span>{{view.label}}</span>
        </div>
        <div>
          <el-row v-for="(layer, index) in view.layers" :key="index" :gutter="20">
            <el-col :span="24">
              <el-row v-for="(viewField, i) in  layerFilters(layer)" :key="i" :gutter="20">
                <el-col v-for="(field, index) in viewField" :key="index" :span="24/layer.cols">
                  <el-form-item  :label="field.label" :prop="field.field">
                    <view-input :value="temp[field.field]" v-model="temp[field.field]" :temp="temp" aria-setsize="small" :componentTarget="field.type" :options="field.children" :disabled="field.disabled" :placeholder="field.label" :params="field.params" @uploadChange="uploadChange" ></view-input>
                   </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
  </div>

</template>
<script>
import Proxy from '@/utils/Proxy/index.js'
import ViewInput from '@/components/viewinput'
export default {
  data() {
    return {
      loading: false,
      opentimes: 0,
      submittimes: 0
    }
  },
  props: {
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    views: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    proxyFields() { // 获取自定义set, get的字段
      let proxyFields = []
      this.views.map(view => {
        view.layers.map(layer => {
          proxyFields = proxyFields.concat(layer.fields.filter(field => {
            return !!field.get || !!field.set
          }))
        })
      })
      return proxyFields
    },
    temp() {
      const proxyFields = this.proxyFields
      // 设置temp 代理
      return new Proxy(this.value, {
        get(target, key, proxy) { // 拦截所有字段get方法
          const field = proxyFields.find(field => { // 获取是否为自定义get, set 字段
            return field.field === key
          })
          if (field && field.get) {
            return field.get(target, key, proxy)// 执行自定以get字段的返回应设值
          } else {
            return Reflect.get(target, key, proxy)// 返回非自定义get 的返回值
          }
        },
        set(target, key, value, proxy) { // 拦截所有字段的set方法
          const field = proxyFields.find(field => { // 获取是否为自定义set字段
            return field.field === key
          })
          if (field && field.set) {
            value = field.set(target, key, value, proxy)// 设置自定义set字段的值
          } else if (field) {
            value = field.get(target, key, value, proxy)// 如果仅有自定义get，使用自定get的值
          }
          const bool = Reflect.set(target, key, value, proxy)// 拦截set方法发
          return bool
        }
      })
    }
  },
  methods: {
    init() {
    },
    async submit() {
      const temp = await this.validate()
      if (temp) {
        this.$emit('submit', this.temp)
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(this.temp)
          } else {
            reject(new Error('字段校验未通过'))
          }
        })
      })
    },
    layerFilters(layer) {
      const viewFields = []
      for (let i = 0; i < layer.fields.length; i += layer.cols) {
        const fields = layer.fields.slice(i, i + layer.cols)
        viewFields.push(fields)
        fields.filter(field => {
          return !!field.proxy
        })
      }
      return viewFields
    },
    renderReady() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.loading = false
        })
      }, 100)
    },
    uploadChange(type) {
      if (type === 'before') {
        // 多个文件同时上传时，只触发第一
        !this.submittimes++ && this.$emit('canSubmit', false)
      } else if (type === 'success' || type === 'error') {
        // 多个文件同时上传， 仅当最后一个文件返回结果（成功，或报错）才能提交表单
        this.submittimes && !--this.submittimes && this.$emit('canSubmit', true)
      } else {
        this.submit = 0
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.loading = false
      })
    }, 300)
  },
  created() {
    this.opentimes++
    this.loading = true
  },
  destroyed() {
    this.loading = true
  },
  components: {
    ViewInput
  },
  watch: {
    temp: {
      handler(now) {
        this.$emit('tempChange', now)
      },
      deep: true
    }
  }
}
</script>

