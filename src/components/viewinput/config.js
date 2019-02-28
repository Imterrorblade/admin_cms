// 注释 这里的字段类型和对应组件之间的映射，根路径为src/components/, 后面为.vue 文件路径（不能带.vue，也不能省略index）
const componentMap = {
  string: import('@/components/String_value/index.vue'),
  input: import('@/components/Input/index.vue'),
  number: import('@/components/Number/index.vue'),
  text: import('@/components/TextArea/index.vue'),
  date: import('@/components/DateTime/index.vue'),
  daterange: import('@/components/DateRange/index.vue'),
  checkbox: import('@/components/CheckBox/index.vue'),
  img: import('@/components/Upload/singleImage3.vue'),
  imgs: import('@/components/Upload/Images.vue'),
  video: import('@/components/Upload/singleVideo.vue'),
  audio: import('@/components/Upload/singleAudio.vue'),
  select: import('@/components/Select/index.vue'),
  radio: import('@/components/Radio/index.vue'),
  richtext: import('@/components/Tinymce/index.vue'),
  map: import('@/components/Map/index.vue'),
  raiderSpots: import('@/components/service/raiders/index.vue'),
  jsonTable: import('@/components/jsonTable/index.vue')
}
export default componentMap
