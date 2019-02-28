import Actions from '@/utils/actions'
// import getConfig from '@/model/config'
const defdata = {
  search: {},
  tableList: [],
  temp: {}
}
const modelConfig = {
  state: {
    config: {},
    actions: {},
    data: Object.assign({}, defdata)
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config
    },
    CREATE_ACTIONS(state, actions = new Actions()) {
      state.actions = actions
    },
    SUB_ACTION(state, { type, fn }) {
      state.actions.subscribe(type, fn)
    },
    UNSUB_ACTION(state, { type, fn }) {
      state.actions.unsubscribe(type, fn)
    },
    UNSUB_ACTIONALL(state, type) {
      state.actions.unsubscribeAll(type)
    },
    FIRE_ACTION(state, { type, data }) {
      state.actions.fire(type, data)
    },
    INIT_DATA(state, data) {
      state.data = Object.assign({}, defdata, data)
    },
    UPDATE_DATA(state, data) {
      state.data = Object.assign({}, state.data, data)
    }
  },
  actions: {
    setConfig({ commit }, config) {
      commit('SET_CONFIG', Object.assign({}, config))
    },
    createActions({ commit }, config) {
      commit('CREATE_ACTIONS', config)
    },
    initActions({ commit }) {
      commit('CREATE_ACTIONS', new Actions())
    },
    subActions({ commit }, { type, fn }) {
      commit('SUB_ACTION', { type, fn })
    },
    unsubActions({ commit }, { type, fn }) {
      commit('UNSUB_ACTION', { type, fn })
    },
    unsubActionsAll({ commit }, type) {
      commit('UNSUB_ACTIONALL', type)
    },
    fireActions({ commit }, { type, data }) {
      commit('FIRE_ACTION', { type, data })
    },
    initData({ commit }, data) {
      commit('INIT_DATA', data)
    },
    updateData({ commit }, data) {
      commit('UPDATE_DATA', data)
    }
  }
}
export default modelConfig
