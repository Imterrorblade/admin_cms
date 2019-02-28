const action = {
  state: {
    actions: {},
    actionCallbacks: {}
  },
  mutations: {
    SET_ACTIONS(state, actions) {
      state.actions = actions
    },
    SUB_ACTINON(state, { type, beforeFire, render }) {
      if (beforeFire) {
        state.actions[type].beforeFire(beforeFire)
      }
      if (render) {
        state.actions[type].render(render)
      }
    }
  },
  actions: {
    setAction({ commit }, actions) {
      commit('SET_ACTIONS', actions)
    },
    subAction({ commit }, data) {
      commit('SUB_ACTINON', data)
    },
    async fireAction({ state }, { type, data, callback }) {
      const actions = state.actions
      callback && actions[type].afterRender(callback)
      actions[type].fire(data)
    }
  }
}
export default action
