<template>
  <div id="app" @click="showSidebar = false">
    <div class="calculator-container">
      <heading @show-sidebar="showSidebar = true"></heading>
      <sidebar :show-sidebar="showSidebar">
      </sidebar>
      <result></result>
      <navigation
        :show-keyboard="showKeyboard"
        @toggle-keyboard="toggleKeyboard"
        @ms="ms">
      </navigation>
      <keyboard v-show="showKeyboard" v-model="showKeyboard"></keyboard>
      <bit v-show="!showKeyboard"></bit>
    </div>
    <memory ref="memory"></memory>
  </div>
</template>

<script>
import Heading from '@/components/Heading'
import Sidebar from '@/components/Sidebar'
import Result from '@/components/Result'
import Navigation from '@/components/Navigation'
import Keyboard from '@/components/Keyboard'
import Bit from '@/components/Bit'
import Memory from '@/components/Memory'

export default {
  name: 'app',

  data () {
    return {
      showSidebar: false,
      showKeyboard: true
    }
  },

  methods: {
    test () {
      console.log(1)
    },

    // 切换全键盘和bit视图
    toggleKeyboard (value) {
      this.showKeyboard = value
    },

    // 保存
    ms () {
      this.$refs.memory.addMemory()
    }
  },

  components: {
    Heading,
    Sidebar,
    Result,
    Navigation,
    Keyboard,
    Bit,
    Memory
  }
}
</script>

<style lang="scss">
#app {
  width: 100vw;
  min-width: 400px;
  height: 100vh;
  background-color: #e6e6e6;
  overflow: auto;
  font-family: PingFangSC, 微软雅黑, Helvetica, Arial, sans-serif;
  .calculator-container {
    float: left;
    @media (min-width: 960px) {
      width: calc(100% - 400px);
    }
    @media (min-width: 700px) and (max-width: 960px) {
      width: 60%;
    }
    @media (max-width: 700px) {
      width: 100%;
    }
  }
  .memory-container {
    float: left;
    @media (min-width: 960px) {
      width: 400px;
    }
    @media (min-width: 700px) and (max-width: 960px) {
      width: 40%;
    }
    @media (max-width: 700px) {
      width: 100%;
    }
  }
}
</style>
