<template>
  <div id="app" @click="showSidebar = false; showMemory = false;">
    <div class="calculator-container">
      <heading @show-sidebar="showSidebar = true"></heading>
      <sidebar :show-sidebar="showSidebar">
      </sidebar>
      <result></result>
      <navigation
        :show-keyboard="showKeyboard"
        @toggle-keyboard="toggleKeyboard"
        @ms="ms"
        @toggle-ms="showMemory = !showMemory">
      </navigation>
      <keyboard v-show="showKeyboard" v-model="showKeyboard"></keyboard>
      <bit v-show="!showKeyboard"></bit>
    </div>
    <memory
      ref="memory"
      :show-memory="showMemory">
    </memory>
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
      showKeyboard: true,
      showMemory: false
    }
  },

  methods: {
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
    @media (min-width: 960px) {
      width: 400px;
      float: left;
    }
    @media (min-width: 700px) and (max-width: 960px) {
      width: 40%;
      float: left;
    }
    @media (max-width: 700px) {
      width: 100%;
      height: 50vh;
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 99;
      background-color: #f4f4f4;
      &.active {
        display: block;
      }
    }
  }
}
</style>
