import * as types from '@/store/mutation-types'

const state = {
  activeEl: {}
}

const getters = {
  // 当前active的元素
  activeEl: state => state.activeEl
}

const actions = {
  setActiveEl ({ commit }, value) {
    commit(types.SET_ACTIVE_EL, value)
  }
}

const mutations = {
  [types.SET_ACTIVE_EL] (state, value) {
    state.activeEl = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
