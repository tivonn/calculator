import Vue from 'vue'
import Vuex from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    expressions: [], // 计算表达式
    binValue: `0`, // 当前值的二进制
    systemType: `dec` // 进制类型
  },

  getters: {
    // 当前进制面板的值
    systemValue: state => {
      return convertSystem(
        state.binValue,
        SYSTEM[`bin`],
        SYSTEM[state.systemType]
      )
    }
  },

  mutations: {
    setExpressions (state, value) {
      state.expressions = value
    },

    setBinValue (state, value) {
      state.binValue = value
    },

    setSystemType (state, value) {
      state.systemType = value
    }
  }
})
