export default {
  fields: [{// 字段定义(注：如果只有name为必填项，字段可以简略为字符串形式如：'name', 'address', 'age')
    name: undefined, // 字段名(必填)
    type: 'string', // 字段类型定义(默认string，可选number，text，richtext，select，date，time，dataTime, radio, checkbox, img, imgs, video)用于区分不同显示组件
    required: false, // 表单校验是否必填(非必填)
    minwidth: '150px', // 列表查询时字段所占最小长度(非必填)
    children: undefined // 如果字段类型为select 活周checkbox,radio所需要的子集列表形式为['name1', 'name2']也可以为[{value: 'name1', label: '名称1'}]
  }],
  default_query: {// 列表显示内容
    list_query: {// 查询字段和过滤
      resource_name: '',
      query_data: {
        current_page: 1,
        page_size: 10
      },
      rel_query: false,
      rels: []
    },
    fields: ['name'], // 列表显示字段
    searchFilter: ['name'], // 查询过滤字段
    blackBtn: []// 需要校验权限的按钮的默认['add', 'edit', 'del']添加，编辑，删除
  },
  view: {// 编辑框显示内容
    modules: {
      module1: {// 基本信息(module名和页面模板中对应)
        fields: ['name']// 编辑内容显示的字段
      }
    },
    layout: {
      col_style: [{
        type: ['number', 'string', 'checkbox', 'select', 'radio', 'date', 'time', 'datetime'],
        cols: 3,
        fields: []
      }, {
        type: ['img', 'video'],
        cols: 2,
        fields: []
      }, {
        type: ['text', 'richtext', 'imgs', 'map'],
        cols: 1,
        fields: []
      }]
    }
  },
  lang: 'common'
}
