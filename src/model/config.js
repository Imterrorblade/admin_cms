const config = {
  fieldsMap: {
  },
  resource_name: '',
  searchFields: [],
  tableFields: [],
  views: [],
  searchBtns: [],
  tableBtns: []
}

export default function getConfig() {
  return JSON.parse(JSON.stringify(config))
}
