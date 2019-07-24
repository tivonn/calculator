import Vue from 'vue'
import Vuex from 'vuex'
import calculate from '@/store/modules/calculate'
import memory from '@/store/modules/memory'
import status from '@/store/modules/status'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    calculate,
    memory,
    status
  }
})
