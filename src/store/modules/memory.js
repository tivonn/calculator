import * as types from '@/store/mutation-types'

const state = {
  memories: []
}

const getters = {
  // 内存记录
  memories: state => state.memories
}

const actions = {
  setMemories ({ commit }, value) {
    commit(types.SET_MEMORIES, value)
  },

  updateMemory ({ commit }, value) {
    commit(types.UPDATE_MEMORY, value)
  }
}

const mutations = {
  [types.SET_MEMORIES] (state, value) {
    state.memories = value
  },

  [types.UPDATE_MEMORY] (state, value) {
    let { id, newValue } = value
    let memory = state.memories.find(memory => memory.id === id)
    this._vm.$set(memory, 'value', newValue)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
