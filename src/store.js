import Vue from 'vue'
import Vuex from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemType: `dec`, // 进制类型
    binValue: `0`, // 当前值的二进制
    expression: [] // 计算表达式
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
    setSystemType (state, value) {
      state.systemType = value
    },

    setBinValue (state, value) {
      state.binValue = value
    },

    setExpression (state, value) {
      state.expression = value
    }
  }
})
