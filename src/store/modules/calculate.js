import * as types from '@/store/mutation-types'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

const state = {
  expressions: [],
  binValue: `0`,
  systemType: `dec`,
  bitLength: {},
}

const getters = {
  // 计算表达式
  expressions: state => state.expressions,

  // 当前值的二进制
  binValue: state => state.binValue,

  // 进制类型
  systemType: state => state.systemType,

  // 当前进制面板的值
  systemValue: state => {
    return convertSystem(
      state.binValue,
      SYSTEM[`bin`],
      SYSTEM[state.systemType]
    )
  },

  // 字长
  bitLength: state => state.bitLength,

  // 字长对应位数
  bitLengthCount: state => {
    return state.bitLength.count
  }
}

const actions = {
  setExpressions ({ commit }, value) {
    commit(types.SET_EXPRESSIONS, value)
  },

  setBinValue ({ commit }, value) {
    commit(types.SET_BINVALUE, value)
  },

  setSystemType ({ commit }, value) {
    commit(types.SET_SYSTEMTYPE, value)
  },

  setBitLength ({ commit }, value) {
    commit(types.SET_BITLENGTH, value)
  }
}

const mutations = {
  [types.SET_EXPRESSIONS] (state, value) {
    state.expressions = value   
  },

  [types.SET_BINVALUE] (state, value) {
    state.binValue = value
  },

  [types.SET_SYSTEMTYPE] (state, value) {
    state.systemType = value
  },

  [types.SET_BITLENGTH] (state, value) {
    state.bitLength = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}