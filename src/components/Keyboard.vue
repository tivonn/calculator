<template>
  <table class="key-table">
    <!-- 此处为了简写代码，选择了遍历数字。由于数据顺序不会发生变化，且没有唯一id，遍历过程中key直接使用item对应的数字，即index -->
    <tr v-for="rowIndex in 6" :key="rowIndex">
      <td
        v-for="key in keys.slice((rowIndex - 1) * 6, rowIndex * 6)"
        :key="key.type"
        colspan="1"
      >
        <button
          class="key-item"
          :class="`${key.class} ${keyClass(key)}`"
          :disabled="isDisabled(key.disableds)"
          @click="key.callback(key.type)"
        >
          <span>{{ key.type }}</span>
          <template v-if="key.type === `(`">
            <span v-if="extraLeftBracket > 0" class="extra-left-bracket">{{
              extraLeftBracket
            }}</span>
          </template>
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem, setPrefixBit, deletePrefixZero, inversePlusOne, concat0B, isNegative, absValue } from '@/utils'
import Mousetrap from 'mousetrap'

export default {
  name: 'Keyboard',

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data () {
    return {
      keys: [ // 键位
        {
          type: `Lsh`,  // 类型
          class: [],  // 类名
          disableds: [],  // 禁用状态对应的进制
          canKeyIn: true, // 是否支持键盘输入
          keyValue: `<`,  //  键盘输入对应的键位
          callback: this.keyMove  // 点击回调
        },
        {
          type: `Rsh`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `>`,
          callback: this.keyMove
        },
        {
          type: `Or`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `|`,
          callback: this.keyBitwise
        },
        {
          type: `Xor`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `^`,
          callback: this.keyBitwise
        },
        {
          type: `Not`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `~`,
          callback: this.keyBitwise
        },
        {
          type: `And`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `&`,
          callback: this.keyBitwise
        },
        {
          type: `↑`,
          class: [`key-switch-move`],
          disableds: [],
          canKeyIn: false,
          callback: this.switchMoveType
        },
        {
          type: `Mod`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: `%`,
          callback: this.keyMod
        },
        {
          type: `CE`,
          class: [`key-ce`],
          disableds: [],
          canKeyIn: true,
          keyValue: `del`,
          callback: this.keyCe
        },
        {
          type: `Ｃ`,
          class: [`key-reset`],
          disableds: [],
          canKeyIn: false,
          callback: this.keyReset
        },
        {
          type: `←`,
          class: [`key-backspace`],
          disableds: [],
          canKeyIn: true,
          keyValue: `backspace`,
          callback: this.keyBackspace
        },
        {
          type: `÷`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: `/`,
          callback: this.keyArithmetic
        },
        {
          type: `A`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `A`,
          callback: this.keyValue
        },
        {
          type: `B`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `B`,
          callback: this.keyValue
        },
        {
          type: `7`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `7`,
          callback: this.keyValue
        },
        {
          type: `8`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          canKeyIn: true,
          keyValue: `8`,
          callback: this.keyValue
        },
        {
          type: `9`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          canKeyIn: true,
          keyValue: `9`,
          callback: this.keyValue
        },
        {
          type: `×`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: `*`,
          callback: this.keyArithmetic
        },
        {
          type: `C`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `C`,
          callback: this.keyValue
        },
        {
          type: `D`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `D`,
          callback: this.keyValue
        },
        {
          type: `4`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `4`,
          callback: this.keyValue
        },
        {
          type: `5`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `5`,
          callback: this.keyValue
        },
        {
          type: `6`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `6`,
          callback: this.keyValue
        },
        {
          type: `-`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: `-`,
          callback: this.keyArithmetic
        },
        {
          type: `E`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `E`,
          callback: this.keyValue
        },
        {
          type: `F`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: `F`,
          callback: this.keyValue
        },
        {
          type: `1`,
          class: [`key-number`],
          disableds: [],
          canKeyIn: true,
          keyValue: `1`,
          callback: this.keyValue
        },
        {
          type: `2`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `2`,
          callback: this.keyValue
        },
        {
          type: `3`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: `3`,
          callback: this.keyValue
        },
        {
          type: `+`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: `+`,
          callback: this.keyArithmetic
        },
        {
          type: `(`,
          class: [`key-bracket`],
          disableds: [],
          canKeyIn: true,
          keyValue: `(`,
          callback: this.keyLeftBracket
        },
        {
          type: `)`,
          class: [`key-bracket`],
          disableds: [],
          canKeyIn: true,
          keyValue: `)`,
          callback: this.keyRightBracket
        },
        {
          type: `±`,
          class: [`key-switch-sign`],
          disableds: [],
          canKeyIn: false,
          callback: this.switchSign
        },
        {
          type: `0`,
          class: [`key-number`],
          disableds: [],
          canKeyIn: true,
          keyValue: `0`,
          callback: this.keyValue
        },
        {
          type: `.`,
          class: [`key-dot`],
          disableds: [`hex`, `dec`, `oct`, `bin`],
          canKeyIn: false,
          callback: this.keyDot
        },
        {
          type: `=`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: `enter`,
          callback: this.keyEqual
        }
      ],
      isRotateMove: false, // 是否循环位移,
      extraLeftBracket: 0 // 左括号比右括号多的数量
    }
  },

  computed: {
    ...mapState([,
      'expressions',
      'binValue',
      'systemType'
    ]),

    ...mapGetters([
      'systemValue',
      'bitLengthCount'
    ]),

    // 判断符号是否可以直接替换
    canReplace () {
      // 若当前二进制为未输入值状态，且表达式最后一项是可被直接替换的符号
      let lastExpression = this.expressions[this.expressions.length - 1]
      const canReplaceType = [`move`, `bitwise`, `mod`, `arithmetic`]
      if (this.binValue === `0` && lastExpression && canReplaceType.some(type => type === lastExpression.type)) {
        return true
      } else {
        return false
      }
    },

    // 当前位数可以输入的最大值
    maxValue () {
      return Math.pow(2, this.bitLengthCount - 1) - 1
    },

    // 当前位数可以输入的最小值
    minValue () {
      return -Math.pow(2, this.bitLengthCount - 1)
    }
  },

  mounted () {
    this.init()
  },

  watch: {
    value (newValue) {
      if (newValue) {
        this.initMousetrap()
      } else {
        this.resetMousetrap()
      }
    }
  },

  methods: {
    init () {
      this.initMousetrap()
    },

    // 键盘监听
    initMousetrap () {
      for (let key of this.keys) {
        if (key.canKeyIn) {
          Mousetrap.bind(key.keyValue, () => {
            if (key.disableds.some(disabled => disabled === this.systemType)) return
            key.callback(key.type)
          })
        }
      }
    },

    resetMousetrap () {
      Mousetrap.reset()
    },

    // 左移右移
    keyMove (direction) {
      this.handleExpression({
        type: `move`,
        value: direction
      })
    },

    // 循环左移右移
    keyRotateMove (direction) {
      // 先补全位数
      let completeValue = setPrefixBit(this.binValue, this.bitLengthCount)
      let newValue
      if (direction === `RoL`) {  // 循环左移
        newValue = completeValue.slice(1, completeValue.length).concat(completeValue.slice(0, 1))
      } else if (direction === `RoR`) {
        newValue = completeValue.slice(completeValue.length - 1, completeValue.length).concat(completeValue.slice(0, completeValue.length - 1))
      }
      if (newValue.slice(0, 1) === `0`) {
        // 正数去除前面多余的0后存储
        this.$store.commit('setBinValue', deletePrefixZero(newValue))
      } else {
        // 负数去除第一位的1，取反加1，求出十进制对应的正值，加上-号存储
        this.$store.commit('setBinValue', inversePlusOne(newValue.slice(1, newValue.length).split(''), true))
      }
    },

    // 按位运算
    keyBitwise (type) {
      this.handleExpression({
        type: `bitwise`,
        value: type
      })
      // 按位非需要交换数字与符号顺序
      if (type === `Not`) {
        let length = this.expressions.length
        this.$store.commit('setExpressions', this.expressions.slice(0, length - 2).concat([this.expressions[length - 1], this.expressions[length - 2]]))
      }
    },

    // 切换（循环）位移
    switchMoveType () {
      this.isRotateMove = !this.isRotateMove
      let moveKeys = this.isRotateMove
        ? [
          {
            type: `RoL`,
            class: ``,
            disableds: [],
            callback: this.keyRotateMove
          },
          {
            type: `RoR`,
            class: ``,
            disableds: [],
            callback: this.keyRotateMove
          }
        ]
        : [
          {
            type: `Lsh`,
            class: ``,
            disableds: [],
            callback: this.keyMove
          },
          {
            type: `Rsh`,
            class: ``,
            disableds: [],
            callback: this.keyMove
          }
        ]
      this.keys.splice(0, 2, ...moveKeys)
    },

    // 取模
    keyMod () {
      this.handleExpression({
        type: `mod`,
        value: `mod`
      })
    },

    // 清除当前值
    keyCe () {
      this.clearBinValue()
    },

    // 重置
    keyReset () {
      this.clearBinValue()
      this.clearExpressions()
      this.extraLeftBracket = 0
    },

    // 退格
    keyBackspace () {
      let length = this.systemValue.length
      // 将systemValue退格1位后，转化成二进制存储
      let systemValue =
        length > 1 ? this.systemValue.slice(0, length - 1) : `0`
      this.setBinValue(systemValue, SYSTEM[this.systemType])
    },

    // 加减乘除
    keyArithmetic (arithmetic) {
      this.handleExpression({
        type: `arithmetic`,
        value: arithmetic
      })
    },

    // 输入值
    keyValue (value) {
      // 将systemValue拼接输入的值后，转化为二进制存储
      let systemValue =
        this.systemValue === `0` ? value : this.systemValue.concat(value)
      // 判断是否超出位数
      const decValue = convertSystem(systemValue, SYSTEM[this.systemType], SYSTEM[`dec`])
      if (decValue > this.maxValue || decValue < this.minValue) return
      this.setBinValue(systemValue, SYSTEM[this.systemType])
    },

    // 左括号
    keyLeftBracket () {
      this.extraLeftBracket++
      this.addExpression({
        type: `bracket`,
        value: `(`
      })
    },

    // 右括号
    keyRightBracket () {
      // 左括号数量无法匹配时，不增加右括号
      if (this.extraLeftBracket <= 0) return
      this.handleExpression({
        type: `bracket`,
        value: `)`
      })
      this.extraLeftBracket--
    },

    // 切换正负
    switchSign () {
      // 0不分正负
      if (this.binValue === `0`) return
      // 修改systemValue的符号，转化成二进制存储
      let systemValue = isNegative(this.systemValue) ? this.systemValue.slice(1, this.systemValue.length) : `-`.concat(this.systemValue)
      this.setBinValue(systemValue, SYSTEM[this.systemType])
    },

    // 小数点，目前程序员模式不支持，暂时定义空函数
    keyDot () { },

    // 处理表达式
    handleExpression (expression) {
      if (this.canReplace) {
        // 替换符号
        this.replaceExpression(expression)
      } else if (this.expressions.length && this.expressions[this.expressions.length - 1].value === `)`) {  // 最后为右括号时，直接插入符号
        this.addExpression(expression)
      } else {
        // 先将当前二进制插入表达式，再插入符号
        this.addExpression({
          type: `value`,
          value: this.binValue
        })
        this.clearBinValue()
        this.addExpression(expression)
      }
    },

    // 向表达式插入元素
    addExpression (expression) {
      this.$store.commit('setExpressions', this.expressions.concat(expression))
    },

    // 替换表达式最后一个元素
    replaceExpression (expression) {
      this.$store.commit('setExpressions', this.expressions.slice(0, this.expressions.length - 1).concat(expression))
    },

    // 清除表达式
    clearExpressions () {
      this.$store.commit('setExpressions', [])
    },

    // 更新当前二进制
    setBinValue (systemValue, systemType) {
      this.$store.commit(
        'setBinValue',
        convertSystem(systemValue, systemType, SYSTEM[`bin`])
      )
    },

    // 清除当前二进制
    clearBinValue () {
      this.$store.commit('setBinValue', `0`)
    },

    // 求值
    keyEqual () {
      // 先将当前二进制插入表达式，再进行计算
      let type = this.expressions[this.expressions.length - 1].type
      if (type !== `value` && type !== `bracket`) {
        this.addExpression({
          type: `value`,
          value: this.binValue
        })
      }
      // 匹配对应数量的括号
      while (this.extraLeftBracket) {
        this.addExpression({
          type: `bracket`,
          value: `)`
        })
        this.extraLeftBracket--
      }
      let expressions = this.expressions.map(expression => this.convertCalc(expression)).join(``)
      this.$store.commit(
        'setBinValue',
        this.handleResult(eval(expressions))
      )
      this.clearExpressions()
    },

    // 转换表达式为计算的值
    convertCalc (expression) {
      let value = expression.value
      switch (expression.type) {
        case `move`:
          const moveMap = {
            'Lsh': `<<`,
            'Rsh': `>>`
          }
          return moveMap[value]
        case `bitwise`:
          const bitwiseMap = {
            'Or': `|`,
            'Xor': `^`,
            'Not': `~`,
            'And': `&`
          }
          return bitwiseMap[value]
        case `mod`:
          return `%`
        case `arithmetic`:
          const arithmeticMap = {
            '+': `+`,
            '-': `-`,
            '×': `*`,
            '÷': `/`
          }
          return arithmeticMap[value]
        case `value`:
          return concat0B(value)
        default:  // 目前只有括号模式符合
          return value
      }
    },

    // 判断是否溢出
    handleResult (result) {
      let binValue = result.toString(SYSTEM[`bin`])
      let length = binValue.length
      // 获取对应的位数
      if (length > this.bitLengthCount) {
        binValue = binValue.slice(-this.bitLengthCount, length)
      }
      length = binValue.length
      // 处理负数
      if (length === this.bitLengthCount && binValue.charAt(0) === `1`) {
        // 舍去符号位，按位取反再加1，求出十进制对应的正值，再加上‘-’号存储
        binValue = inversePlusOne(absValue(binValue).split(''), true)
      }
      return binValue
    },

    // 判断键位禁用状态
    isDisabled (disableds) {
      return disableds.some(systemType => systemType === this.systemType)
    },

    keyClass (key) {
      const switchMove = key.type === `↑` && this.isRotateMove ? 'active' : ''
      const classList = [switchMove]
      return classList
    }
  }
}
</script>

<style lang='scss'>
.key-table {
  width: 100%;
  table-layout: fixed;
  .key-item {
    width: 100%;
    height: 60px;
    position: relative;
    background-color: #f0f0f0;
    border: none;
    outline: none;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
    &[disabled] {
      color: #c8c8c8;
      &:hover {
        background-color: #f0f0f0;
        cursor: not-allowed;
      }
    }
  }
  .key-number,
  .key-arithmetic,
  .key-switch-sign,
  .key-dot {
    font-size: 18px;
  }
  .key-switch-move,
  .key-backspace,
  .key-bracket {
    font-size: 16px;
  }
  .key-ce,
  .key-reset,
  .key-letter,
  .key-number {
    font-weight: bold;
  }
  .key-switch-move {
    border-bottom: 3px solid #f0f0f0;
    &:hover {
      border-color: #dbdbdb;
    }
    &.active {
      border-color: #409eff;
    }
  }
  .key-arithmetic {
    &:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
  .extra-left-bracket {
    position: absolute;
    top: 28px;
    left: calc(50% + 5px);
    font-size: 13px;
    font-weight: bold;
  }
}
</style>