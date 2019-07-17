import * as types from '@/store/mutation-types'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

const state = {
  expressions: [],
  tempValue: null,
  binValue: `0`,
  systemType: `dec`,
  bitLength: {},
}

const getters = {
  // 计算表达式
  expressions: state => state.expressions,

  // 临时表达式的值
  tempValue: state => state.tempValue,

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

  setTempValue ({ commit }, value) {
    commit(types.SET_TEMP_VALUE, value)
  },

  setBinValue ({ commit }, value) {
    commit(types.SET_BIN_VALUE, value)
    // 输入值的时候，需要清空临时表达式计算出的值
    commit(types.SET_TEMP_VALUE, null)
  },

  setSystemType ({ commit }, value) {
    commit(types.SET_SYSTEM_TYPE, value)
  },

  setBitLength ({ commit }, value) {
    commit(types.SET_BIT_LENGTH, value)
  }
}

const mutations = {
  [types.SET_EXPRESSIONS] (state, value) {
    state.expressions = value   
  },

  [types.SET_TEMP_VALUE] (state, value) {
    state.tempValue = value
  },

  [types.SET_BIN_VALUE] (state, value) {
    state.binValue = value
  },

  [types.SET_SYSTEM_TYPE] (state, value) {
    state.systemType = value
  },

  [types.SET_BIT_LENGTH] (state, value) {
    state.bitLength = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}