<template>
  <div id="app">
    <div class="calculator-container">
      <heading></heading>
      <result></result>
      <navigation
        :showKeyboard="showKeyboard"
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
import Result from '@/components/Result'
import Navigation from '@/components/Navigation'
import Keyboard from '@/components/Keyboard'
import Bit from '@/components/Bit'
import Memory from '@/components/Memory'

export default {
  name: 'app',

  data () {
    return {
      showKeyboard: true
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
  min-width: 800px;
  height: 100vh;
  background-color: #e6e6e6;
  overflow: auto;
  font-family: PingFangSC, 微软雅黑, Helvetica, Arial, sans-serif;
  .calculator-container {
    width: calc(100% - 400px);
    float: left;
  }
}
</style>
