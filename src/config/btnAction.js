export default {
  search: {
    label: '搜索',
    icon: 'el-icon-search'
  },
  async: '同步',
  add: '添加',
  edit: '编辑',
  delete: {
    label: '删除',
    type: 'danger'
  },
  detail: '详情',
  sync: '同步',
  review: '审核',
  publish: {
    label: '发布'
  },
  shelves: {
    label(data) {
      if (data.is_shelves === 'true' || data.is_shelves === true) {
        return '下架'
      } else {
        return '上架'
      }
    }
  },
  submit: '提交', // 新增和编辑提交
  addSubmit: '提交', // 新增提交
  editSubmit: '提交', // 编辑提交
  reviewSubmit: '提交', // 审核提交
  publishSubmit: '确定'// 发布渠道提交
}
