<template>
  <div id="app">
    <div class="calculator-container">
      <p class="calculator-title">
        <span title="打开导航">
          <svg class="iconfont">
            <use xlink:href="#icon-caidanlan"></use>
          </svg>
        </span>
        <span class="calculator-mode">程序员</span>
      </p>

      <result></result>

      <p class="function-list clear-fix">
        <span
          class="function-item all-keyboard"
          title="全键盘"
          @click="showAllKeyboard = true"
        >
          <svg class="iconfont">
            <use xlink:href="#icon-calculator"></use>
          </svg>
        </span>
        <span
          class="function-item bit-keyboard"
          title="比特绷板键盘"
          @click="showAllKeyboard = false"
        >
          <svg class="iconfont">
            <use xlink:href="#icon-binary"></use>
          </svg>
        </span>
        <span
          class="function-item switch-bit-length"
          @click="switchBitLength"
          >{{ bitLength.type }}</span
        >
        <span class="function-item" title="内存存储">MS</span>
      </p>

      <keyboard v-show="showAllKeyboard"></keyboard>
      <bit v-show="!showAllKeyboard"></bit>
    </div>
    <memory></memory>
  </div>
</template>

<script>
import Result from '@/components/Result'
import Keyboard from '@/components/Keyboard'
import Bit from '@/components/Bit'
import Memory from '@/components/Memory'
import { mapState } from 'vuex'
import { BIT_LENGTH } from '@/utils/enum'

export default {
  name: 'app',

  data () {
    return {
      showAllKeyboard: true,
      bitLengthOptions: { // 此处需要循环切换，采用类似链表指针的思想，next记录要切换的下一项。如果使用数组存储options，在切换时还需判断index是否超出。
        'QWORD': {
          type: `QWORD`,
          count: BIT_LENGTH[`QWORD`],
          next: `DWORD`
        },
        'DWORD': {
          type: `DWORD`,
          count: BIT_LENGTH[`DWORD`],
          next: `WORD`
        },
        'WORD': {
          type: `WORD`,
          count: BIT_LENGTH[`WORD`],
          next: `BYTE`
        },
        'BYTE': {
          type: `BYTE`,
          count: BIT_LENGTH[`BYTE`],
          next: `QWORD`
        }
      }
    }
  },

  computed: {
    ...mapState([
      'bitLength'
    ])
  },

  created () {
    this.$store.commit('setBitLength', this.bitLengthOptions[`QWORD`])
  },

  methods: {
    switchBitLength () {
      this.$store.commit('setBitLength', this.bitLengthOptions[this.bitLength.next])
    }
  },

  components: {
    Result,
    Keyboard,
    Bit,
    Memory
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  .calculator-container {
    width: calc(100% - 400px);
    float: left;
  }
  .calculator-title {
    height: 45px;
    padding-left: 10px;
    line-height: 45px;
  }
  .calculator-mode {
    margin-left: 10px;
    font-size: 20px;
  }
  .function-item {
    width: 100px;
    height: 35px;
    float: left;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .all-keyboard {
    .iconfont {
      vertical-align: middle;
      font-size: 26px;
    }
  }
  .bit-keyboard {
    .iconfont {
      vertical-align: middle;
      font-size: 30px;
    }
  }
  .switch-bit-length {
    width: calc(100% - 300px);
  }
}
</style>
