<template>
  <div>
    <el-row :gutter="20" v-for="(item, index) in list" :key="index">
      <el-col :span="24">
        <el-row v-if="index > 0 && !params.onlyshow" :gutter="20">
          <el-col :span="24">
            <el-button @click="delRaier(index)" plain="" type="danger" size="mini">删除</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <Tinymce v-model="item.content" :params="params"></Tinymce>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            关联景点：<add-spots v-model="item.relation_scenic_spot" :params="params"></add-spots>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="!params.onlyshow" :gutter="20">
      <el-col :span="24">
        <el-button @click="addRaier" plain="" type="primary" size="mini">+添加</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import AddSpots from '@/components/service/raiders/addSpots'
export default {
  data() {
    return {
      list: [],
      defaultValue: {
        content: '',
        relation_scenic_spot: '',
        relation_id: ''
      }
    }
  },
  props: {
    value: {
      default() {
        return [this.defaultValue]
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {},
  methods: {
    init() {
      this.initList(this.value)
    },
    initList(value) {
      try {
        if (value && value.length && value.length > 0) {
          this.list = value
        } else {
          this.list = [Object.assign({}, this.defaultValue)]
        }
      } catch (err) {
        console.log(err)
        this.list = [Object.assign({}, this.defaultValue)]
      }
    },
    addRaier() {
      this.list.push(Object.assign({}, this.defaultValue))
    },
    delRaier(index) {
      this.list.splice(index, 1)
    }
  },
  watch: {
    value(now) {
      this.initList(now)
    },
    list: {
      handler(now) {
        this.$emit('input', now)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  components: {
    Tinymce,
    AddSpots
  }
}
</script>

