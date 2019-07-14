<template>
  <div class="bit-container">
    <!-- 此处为了简写代码，选择了遍历数字。由于数据顺序不会发生变化，且没有唯一id，遍历过程中key直接使用item对应的数字，即index -->
    <span v-for="(bit, index) in showBinValue" :key="index" class="bit-item">
      <button
        class="bit-text"
        :class="bitClass(bit)"
        :disabled="isDisabled(index)"
        @click="toggleBit(index)"
      >
        {{ bit }}
      </button>
      <span v-if="(index + 1) % 4 === 0" class="bit-index">{{
        showBinValue.length - index - 1
      }}</span>
    </span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SYSTEM, BIT_LENGTH } from '@/utils/enum'
import { convertSystem, inversePlusOne, isNegative, absValue } from '@/utils'

export default {
  name: 'Bit',

  data () {
    return {
      showBinValue: [],  // 当前显示的二进制的值,
      totalLength: 64 // 总共的位数
    }
  },

  computed: {
    ...mapState([
      'binValue'
    ]),

    ...mapGetters([
      'bitLengthCount'
    ]),

    signPosition () {
      return this.totalLength - this.bitLengthCount
    },

    byteSignPosition () {
      return this.totalLength - BIT_LENGTH[`BYTE`]
    },

    isNegative () {
      return this.showBinValue[this.signPosition] === `1`
    }
  },

  mounted () {
    this.init()
  },

  watch: {
    binValue () {
      this.init()
    },

    bitLengthCount (newValue) {
      if (newValue === BIT_LENGTH[`QWORD`] && this.showBinValue[this.byteSignPosition] === `1`) {  // 代表原本符号位为负，且由BYTE变为QWORD，将前面的位统一设置为1
        this.showBinValue.splice(0, this.byteSignPosition, ...new Array(this.byteSignPosition).fill(`1`))
      } else {
        // 将禁用的位统一设置为0
        this.updatePrefixBit(0)
      }
      this.setBinValue()
    }
  },

  methods: {
    init () {
      this.setPrefixBit()
    },

    // 设置前缀
    setPrefixBit () {
      if (!isNegative(this.binValue)) {
        // 非负数直接补0
        this.showBinValue = `0`.repeat(this.totalLength - this.binValue.length).concat(this.binValue).split('')
      } else {
        // 负数需要前缀全部为1，取反加1
        let positiveValue = absValue(this.binValue)
        let length = positiveValue.length
        let value = convertSystem(inversePlusOne(positiveValue.split('')), SYSTEM[`dec`], SYSTEM[`bin`])
        value = `0`.repeat(length - value.length).concat(value)
        this.showBinValue = `1`.repeat(this.totalLength - value.length).concat(value).split('')
      }
    },

    // 更新前缀，用于切换进制时
    updatePrefixBit (value) {
      this.showBinValue.splice(0, this.signPosition, ...new Array(this.signPosition).fill(value))
    },

    // 切换0、1
    toggleBit (index) {
      this.$set(this.showBinValue, index, this.showBinValue[index] === `1` ? `0` : `1`)
      this.setBinValue()
    },

    // 更新binValue
    setBinValue () {
      if (!this.isNegative) {  // 非负数
        let binValue = this.showBinValue.join('')
        this.$store.commit('setBinValue', binValue)
      } else {
        // 按位取反再加1，求出十进制对应的正值，再加上‘-’号存储
        let binValue = (-inversePlusOne(this.showBinValue.slice(this.signPosition, this.totalLength))).toString(SYSTEM[`bin`])
        this.$store.commit('setBinValue', binValue)
      }
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
  padding: 12px 20px;
  background-color: #f0f0f0;
  .bit-item {
    width: calc((100% - 45px) / 16);
    height: 71px;
    display: inline-block;
    margin-top: 15px;
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
    background-color: #f0f0f0;
    border: none;
    outline: none;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &.active {
      color: #4093ff;
    }
    &:hover {
      color: #666;
    }
    &[disabled] {
      color: #c8c8c8;
      cursor: not-allowed;
    }
  }
  .bit-index {
    display: block;
    margin-top: 12px;
    font-size: 14px;
  }
}
</style>