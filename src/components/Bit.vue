<template>
  <div class="bit-container">
    <!-- 此处为了简写代码，选择了遍历位数。由于数据顺序不会发生变化，且没有唯一id，遍历过程中key直接使用index -->
    <span v-for="(bit, index) in showBinValue" :key="index" class="bit-item">
      <button
        class="bit-text"
        :class="bitClass(bit)"
        :disabled="isDisabled(index)"
        @click="toggleBit(index)">
        {{ bit }}
      </button>
      <span v-if="(index + 1) % 4 === 0" class="bit-index">{{ showBinValue.length - index - 1 }}</span>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BIT_LENGTH } from '@/utils/enum'
import { setPrefixBit, deletePrefixZero, inversePlusOne } from '@/utils'

export default {
  name: 'Bit',

  data () {
    return {
      showBinValue: [], // 当前显示的二进制的值,
      totalLength: 64 // 总共的位数
    }
  },

  computed: {
    ...mapGetters([
      'binValue',
      'bitLengthCount'
    ]),

    // 符号位
    signPosition () {
      return this.totalLength - this.bitLengthCount
    },

    // byte时的符号位
    byteSignPosition () {
      return this.totalLength - BIT_LENGTH[`BYTE`]
    },

    // 当前位数下是负数，即符号位为1
    isNegative () {
      return this.showBinValue[this.signPosition] === `1`
    }
  },

  mounted () {
    this.init()
  },

  watch: {
    // 输入值
    binValue () {
      this.init()
    },

    // 切换进制
    bitLengthCount (newValue) {
      if (newValue === BIT_LENGTH[`QWORD`] && this.showBinValue[this.byteSignPosition] === `1`) {
        // 代表原本符号位为负，且由BYTE变为QWORD，将前面的位统一设置为1
        this.updatePrefixBit(`1`, this.byteSignPosition)
      } else {
        // 将禁用的位统一设置为0
        this.updatePrefixBit(`0`, this.signPosition)
      }
      this.setBinValue()
    },

    showBinValue () {
      // 需要保证禁用前缀为0
      let disabledLength = this.totalLength - this.bitLengthCount
      for (let i = 0; i < disabledLength; i++) {
        this.showBinValue[i] = `0`
      }
    }
  },

  methods: {
    init () {
      this.setPrefixBit()
    },

    // 设置前缀
    setPrefixBit () {
      this.showBinValue = setPrefixBit(this.binValue, this.totalLength).split(``)
    },

    // 更新前缀，用于切换进制时
    updatePrefixBit (value, position) {
      this.showBinValue.splice(0, position, ...new Array(position).fill(value))
    },

    // 切换0、1
    toggleBit (index) {
      this.$set(this.showBinValue, index, this.showBinValue[index] === `1` ? `0` : `1`)
      this.setBinValue()
    },

    // 更新binValue
    setBinValue () {
      let binValue
      if (!this.isNegative) { // 非负数
        // 去除前面多余的0再存储
        binValue = deletePrefixZero(this.showBinValue.join(''))
      } else {
        // 按位取反再加1，求出十进制对应的正值，再加上‘-’号存储
        let negativeValue = this.showBinValue.slice(this.signPosition, this.totalLength).join('')
        binValue = inversePlusOne(negativeValue, true)
      }
      this.$store.dispatch('setBinValue', binValue)
    },

    // 位数样式
    bitClass (bit) {
      return {
        'active': bit === `1`
      }
    },

    // 判断位数禁用状态
    isDisabled (index) {
      return this.totalLength - index > this.bitLengthCount
    }
  }
}
</script>

<style lang='scss'>
.bit-container {
  padding: 0 20px;
  background-color: #f0f0f0;
  .bit-item {
    width: calc((100% - 45px) / 16);
    height: 12vh;
    display: inline-block;
    text-align: center;
    vertical-align: top;
    &:nth-child(4n + 1) {
      margin-left: 15px;
    }
    &:nth-child(16n + 1) {
      margin-left: 0;
    }
  }
  .bit-text {
    margin-top: 3vh;
    background-color: #f0f0f0;
    border: none;
    outline: none;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: #666;
    }
    &.active {
      color: #4093ff;
    }
    &[disabled] {
      color: #c8c8c8;
      cursor: not-allowed;
    }
  }
  .bit-index {
    display: block;
    margin-top: 1.5vh;
    font-size: 14px;
  }
}
</style>
