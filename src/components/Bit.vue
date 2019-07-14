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
import { WORD_LENGTH } from '@/utils/enum'
import { isNegative, absValue } from '@/utils'

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
    ])
  },

  mounted () {
    this.init()
  },

  watch: {
    bitLengthCount (newValue) {
      let signPosition = this.totalLength - WORD_LENGTH[`BYTE`]
      if (newValue === WORD_LENGTH[`QWORD`] && this.showBinValue[signPosition] === `1`) {  // 代表原本符号位为负，且由BYTE变为QWORD，将前面的位统一设置为1
          this.showBinValue.splice(0, signPosition, ...new Array(signPosition).fill(`1`))
      } else {
        this.setLength()
        this.setBinValue()
      }
    }
  },

  methods: {
    init () {
      this.setLength()
    },

    // 计算位数
    setLength () {
      // todo
      if (!isNegative(this.binValue)) { // 非负数
        let extraBitlength = this.bitLengthCount - this.binValue.length
        if (extraBitlength >= 0) { // 需要补全位数
          this.showBinValue = `0`.repeat(this.totalLength - this.binValue.length).concat(this.binValue).split('')
        } else {  // 需要去除位数
          let sliceValue = this.binValue.slice(-this.bitLengthCount, this.binValue.length)
          this.showBinValue = `0`.repeat(this.totalLength - sliceValue.length).concat(sliceValue).split('')
        }
      }
      console.log(this.showBinValue)
      console.log(this.showBinValue.length)
    },

    // 切换0、1
    toggleBit (index) {
      this.$set(this.showBinValue, index, this.showBinValue[index] === `1` ? `0` : `1`)
      this.setBinValue()
    },

    // 更新binValue
    setBinValue () {
      let binValue = this.showBinValue.join('')
      // todo 
      if (binValue.charAt(0) === `0`) {  // 非负数
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
    width: calc(100% / 16);
    height: 71px;
    display: inline-block;
    margin-top: 15px;
    text-align: center;
    vertical-align: top;
  }
  .bit-text {
    background-color: #f0f0f0;
    border: none;
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