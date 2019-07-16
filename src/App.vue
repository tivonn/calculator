<template>
  <div id="app">
    <div class="calculator-container">
      <heading></heading>
      <result></result>
      <navigation
        :showAllKeyboard="showAllKeyboard"
        @toggle-keyboard="toggleKeyboard"
        @ms="ms"
      ></navigation>
      <keyboard v-show="showAllKeyboard" v-model="showAllKeyboard"></keyboard>
      <bit v-show="!showAllKeyboard"></bit>
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
      showAllKeyboard: true,
    }
  },

  methods: {
    toggleKeyboard (value) {
      this.showAllKeyboard = value
    },

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
  width: 100%;
  min-width: 800px;
  height: 100%;
  background-color: #e6e6e6;
  overflow: auto;
  font-family: PingFangSC, 微软雅黑, Helvetica, Arial, sans-serif;
  .calculator-container {
    width: calc(100% - 400px);
    float: left;
  }
}
</style>
