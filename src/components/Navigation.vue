<template>
  <div class="navigation-container clear-fix">
    <span
      class="function-item all-keyboard"
      :class="{ active: showKeyboard }"
      title="全键盘"
      @click="toggleKeyboard(true)">
      <svg class="iconfont">
        <use xlink:href="#icon-calculator"></use>
      </svg>
    </span>
    <span
      class="function-item bit-keyboard"
      :class="{ active: !showKeyboard }"
      title="比特绷板键盘"
      @click="toggleKeyboard(false)">
      <svg class="iconfont">
        <use xlink:href="#icon-binary"></use>
      </svg>
    </span>
    <span class="function-item switch-bit-length" :title="bitLength.type" @click="switchBitLength">{{ bitLength.type }}</span>
    <span class="function-item" title="内存存储" @click="$emit(`ms`)">MS</span>
    <span class="function-item toggle-ms" title="内存" @click.stop="$emit(`toggle-ms`)">M▾</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BIT_LENGTH } from '@/utils/enum'

export default {
  name: 'Navigation',

  props: {
    showKeyboard: {
      type: Boolean,
      required: true,
      default: true
    }
  },

  data () {
    return {
      defaultBitLength: `QWORD`, // 默认位数
      bitLengthOptions: { // 此处需要循环切换，所以采用类似链表指针的思想，next记录要切换的下一项。如果不用链表而使用数组存储options，在切换时还需额外判断index是否超出。
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

    // 切换全键盘/bit视图
    toggleKeyboard (value) {
      this.$emit(`toggle-keyboard`, value)
    },

    // 设置默认位数
    setBitLength () {
      this.$store.dispatch('setBitLength', this.bitLengthOptions[this.defaultBitLength])
    },

    // 切换位数
    switchBitLength () {
      this.$store.dispatch('setBitLength', this.bitLengthOptions[this.bitLength.next])
    }
  }
}
</script>

<style lang='scss'>
.navigation-container {
  .function-item {
    height: 7vh;
    float: left;
    line-height: 7vh;
    text-align: center;
    cursor: pointer;
    @media (min-width: 500px) {
      width: 100px;
    }
    @media (max-width: 500px) {
      width: 15%;
    }
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .all-keyboard, .bit-keyboard {
    border-bottom: 3px solid #e6e6e6;
    &:hover {
      border-color: #dbdbdb;
    }
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
    @media (min-width: 700px) {
      width: calc(100% - 300px);
    }
    @media (min-width: 500px) and (max-width: 700px) {
      width: calc(100% - 400px);
    }
    @media (max-width: 500px) {
      width: 40%;
    }
  }
  .toggle-ms {
    @media (min-width: 700px) {
      display: none;
    }
  }
}
</style>
