<template>
  <div class="navigation-container clear-fix">
    <span
      class="function-item all-keyboard"
      :class="{ active: showAllKeyboard }"
      title="全键盘"
      @click="toggleAllKeyboard(true)"
    >
      <svg class="iconfont">
        <use xlink:href="#icon-calculator"></use>
      </svg>
    </span>
    <span
      class="function-item bit-keyboard"
      :class="{ active: !showAllKeyboard }"
      title="比特绷板键盘"
      @click="toggleAllKeyboard(false)"
    >
      <svg class="iconfont">
        <use xlink:href="#icon-binary"></use>
      </svg>
    </span>
    <span class="function-item switch-bit-length" @click="switchBitLength">{{
      bitLength.type
    }}</span>
    <span class="function-item" title="内存存储" @click="$emit(`ms`)">MS</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BIT_LENGTH } from '@/utils/enum'

export default {
  name: 'Navigation',

  props: {
    showAllKeyboard: {
      type: Boolean,
      required: true,
      default: true
    }
  },

  data () {
    return {
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
    ...mapGetters([
      'bitLength'
    ])
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.setBitLength()
    },

    toggleAllKeyboard (value) {
      this.$emit(`toggle-keyboard`, value)
    },

    setBitLength () {
      this.$store.dispatch('setBitLength', this.bitLengthOptions[`QWORD`])
    },

    switchBitLength () {
      this.$store.dispatch('setBitLength', this.bitLengthOptions[this.bitLength.next])
    }
  }
}
</script>

<style lang='scss'>
.navigation-container {
  .function-item {
    width: 100px;
    height: 45px;
    float: left;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .all-keyboard,
  .bit-keyboard {
    border-bottom: 3px solid #e6e6e6;
    &.active {
      border-color: #409eff;
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