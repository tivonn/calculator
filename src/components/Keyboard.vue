<template>
  <table class="keyboard-container">
    <!-- 此处为了简写代码，选择了遍历数字。由于数据顺序不会发生变化，且没有唯一id，遍历过程中key直接使用item对应的数字，即index -->
    <tr v-for="rowIndex in 6" :key="rowIndex">
      <td v-for="key in keys.slice((rowIndex - 1) * 6, rowIndex * 6)" :key="key.type" colspan="1">
        <button
          class="key-item"
          :class="`${key.class} ${keyClass(key)}`"
          :disabled="isDisabled(key.disableds)"
          @click="key.callback(key.type)">
          <span>{{ key.type }}</span>
          <!--定制化的额外文字-->
          <key-extra
            :key-item="key"
            :expressions="expressions">
          </key-extra>
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import { mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem, setPrefixBit, deletePrefixZero, inversePlusOne, concat0B, isNegative, calculate, handleOverflow, extraSymbol } from '@/utils'
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
          type: `Lsh`, // 类型
          class: [], // 类名
          disableds: [], // 禁用状态对应的进制
          canKeyIn: true, // 是否支持键盘输入
          keyValue: [`<`], //  键盘输入对应的键位
          callback: this.keyMove // 点击回调
        },
        {
          type: `Rsh`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: [`>`],
          callback: this.keyMove
        },
        {
          type: `Or`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: [`|`],
          callback: this.keyBitwise
        },
        {
          type: `Xor`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: [`^`],
          callback: this.keyBitwise
        },
        {
          type: `Not`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: [`~`],
          callback: this.keyBitwise
        },
        {
          type: `And`,
          class: [],
          disableds: [],
          canKeyIn: true,
          keyValue: [`&`],
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
          keyValue: [`%`],
          callback: this.keyMod
        },
        {
          type: `CE`,
          class: [`key-ce`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`del`],
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
          keyValue: [`backspace`],
          callback: this.keyBackspace
        },
        {
          type: `÷`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`/`],
          callback: this.keyArithmetic
        },
        {
          type: `A`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`A`, `a`],
          callback: this.keyValue
        },
        {
          type: `B`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`B`, `b`],
          callback: this.keyValue
        },
        {
          type: `7`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`7`],
          callback: this.keyValue
        },
        {
          type: `8`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          canKeyIn: true,
          keyValue: [`8`],
          callback: this.keyValue
        },
        {
          type: `9`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          canKeyIn: true,
          keyValue: [`9`],
          callback: this.keyValue
        },
        {
          type: `×`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`*`],
          callback: this.keyArithmetic
        },
        {
          type: `C`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`C`, `c`],
          callback: this.keyValue
        },
        {
          type: `D`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`D`, `d`],
          callback: this.keyValue
        },
        {
          type: `4`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`4`],
          callback: this.keyValue
        },
        {
          type: `5`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`5`],
          callback: this.keyValue
        },
        {
          type: `6`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`6`],
          callback: this.keyValue
        },
        {
          type: `-`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`-`],
          callback: this.keyArithmetic
        },
        {
          type: `E`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`E`, `e`],
          callback: this.keyValue
        },
        {
          type: `F`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          canKeyIn: true,
          keyValue: [`F`, `f`],
          callback: this.keyValue
        },
        {
          type: `1`,
          class: [`key-number`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`1`],
          callback: this.keyValue
        },
        {
          type: `2`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`2`],
          callback: this.keyValue
        },
        {
          type: `3`,
          class: [`key-number`],
          disableds: [`bin`],
          canKeyIn: true,
          keyValue: [`3`],
          callback: this.keyValue
        },
        {
          type: `+`,
          class: [`key-arithmetic`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`+`],
          callback: this.keyArithmetic
        },
        {
          type: `(`,
          class: [`key-bracket`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`(`],
          callback: this.keyLeftBracket
        },
        {
          type: `)`,
          class: [`key-bracket`],
          disableds: [],
          canKeyIn: true,
          keyValue: [`)`],
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
          keyValue: [`0`],
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
          keyValue: [`enter`],
          callback: this.keyEqual
        }
      ],
      // 按照MDN文档(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)的优先级序号排序
      symbolPriority: {
        '(': 20, // 左括号优先级最高，输入左括号时临时表达式应为空
        'Not': 16,
        '×': 14,
        '÷': 14,
        'Mod': 14,
        '+': 13,
        '-': 13,
        'Lsh': 12,
        'Rsh': 12,
        'And': 9,
        'Xor': 8,
        'Or': 7,
        ')': 0 // 此处特例，因为输入右括号时，将右括号优先级设置为最小，才能按照计算临时表达式的规则拿到前面一串表达式
      },
      isRotateMove: false // 是否循环位移
    }
  },

  computed: {
    ...mapGetters([
      'expressions',
      'isTemp',
      'binValue',
      'systemType',
      'systemValue',
      'bitLengthCount'
    ]),

    // 判断最后的符号是否可以直接替换
    canReplace () {
      // 若当前二进制为未输入值状态，且表达式最后一项是可被直接替换的符号
      let lastExpression = this.expressions[this.expressions.length - 1]
      const canReplaceType = [`move`, `bitwise`, `mod`, `arithmetic`]
      return this.isTemp && !!lastExpression && canReplaceType.some(type => type === lastExpression.type)
    },

    // 当前位数可以输入的最大值
    maxValue () {
      return Math.pow(2, this.bitLengthCount - 1) - 1
    },

    // 当前位数可以输入的最小值
    minValue () {
      return -Math.pow(2, this.bitLengthCount - 1)
    },

    // 表达式最后一位是值
    isValueEnd () {
      return this.isSymbolEnd('type', `value`)
    },

    // 左括号比右括号多的数量
    extraLeftBracket () {
      return extraSymbol(this.expressions, `(`, `)`)
    },

    // 表达式最后一位为右括号
    isRightBracketEnd () {
      return this.isSymbolEnd('value', `)`)
    }
  },

  mounted () {
    this.init()
  },

  beforeDestroy () {
    this.resetMousetrap()
  },

  watch: {
    value (newValue) {
      // 位于全键盘，才进行键盘监听
      if (newValue) {
        this.initMousetrap()
      } else {
        this.resetMousetrap()
      }
    },

    // 表达式变化的时候需要实时计算
    'expressions': 'setTempValue'
  },

  methods: {
    init () {
      this.initMousetrap()
    },

    // 键盘监听
    initMousetrap () {
      for (let key of this.keys) {
        // 存在键盘事件时再绑定
        if (key.canKeyIn) {
          Mousetrap.bind(key.keyValue, () => {
            // 判断当前进制是否为禁用状态
            if (key.disableds.some(disabled => disabled === this.systemType)) return
            key.callback(key.type)
          })
        }
      }
    },

    // 停用键盘监听
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
      // 进行移动
      let newValue
      if (direction === `RoL`) { // 循环左移
        newValue = completeValue.slice(1, completeValue.length).concat(completeValue.slice(0, 1))
      } else if (direction === `RoR`) { // 循环右移
        newValue = completeValue.slice(completeValue.length - 1, completeValue.length).concat(completeValue.slice(0, completeValue.length - 1))
      }
      if (newValue[0] === `0`) {
        // 正数去除前面多余的0后存储
        this.$store.dispatch('setBinValue', deletePrefixZero(newValue))
      } else {
        // js无法识别第一位为1代表负数，负数需要去除第一位的1，取反加1，求出十进制对应的正值，加上-号存储
        let sliceValue = newValue.slice(1, newValue.length)
        this.$store.dispatch('setBinValue', inversePlusOne(sliceValue, true))
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
        let endExpressions = [this.expressions[length - 1], this.expressions[length - 2]]
        this.$store.dispatch('setExpressions', this.expressions.slice(0, length - 2).concat(endExpressions))
      }
    },

    // 切换（循环）位移
    switchMoveType () {
      this.isRotateMove = !this.isRotateMove
      // 是否循环，对应不同的键位
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
        value: `Mod`
      })
    },

    // 清除当前值
    keyCe () {
      this.clearBinValue()
      this.clearTempValue()
    },

    // 重置
    keyReset () {
      this.clearBinValue()
      this.clearExpressions()
      this.clearTempValue()
    },

    // 退格
    keyBackspace () {
      // 显示临时表达式的值时，不需要进行退格
      if (this.isTemp) return
      let length = this.systemValue.length
      // 当除去符号位后，只有一位时需要变为0
      let isToZero = isNegative(this.systemValue) ? length <= 2 : length <= 1
      // 将systemValue退格1位后，转化成二进制存储
      let systemValue = isToZero ? `0` : this.systemValue.slice(0, length - 1)
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
      // 表达式最后一位为右括号时，或表达式最后一位是值（兼容按位非）时，禁止输入值
      if (this.isRightBracketEnd || this.isValueEnd) return
      // 计算完成时，需要重置
      if (this.isTemp) {
        this.clearBinValue()
        this.clearTempValue()
      }
      // 将systemValue拼接输入的值后，转化为二进制存储
      let systemValue = this.systemValue === `0` ? value : this.systemValue.concat(value)
      // 判断是否超出位数
      const decValue = convertSystem(systemValue, SYSTEM[this.systemType], SYSTEM[`dec`])
      if (decValue > this.maxValue || decValue < this.minValue) return
      this.setBinValue(systemValue, SYSTEM[this.systemType])
    },

    // 左括号
    keyLeftBracket () {
      // 表达式最后为右括号或数字时，不增加左括号
      if (this.isRightBracketEnd || this.isValueEnd) return
      this.addExpression({
        type: `bracket`,
        value: `(`
      })
    },

    // 右括号
    keyRightBracket () {
      // 左括号数量不足以匹配时，不增加右括号
      if (this.extraLeftBracket <= 0) return
      this.handleExpression({
        type: `bracket`,
        value: `)`
      })
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
      } else if (this.isRightBracketEnd) {
        // 最后为右括号时，直接插入符号
        this.addExpression(expression)
      } else {
        // if中的||后部分是对按位非的判断条件，表达式以按位非结尾时，不应该将当前值插入表达式
        if (!this.expressions.length || this.expressions.length && this.expressions[this.expressions.length - 1].type !== `value`) {
          // 先将当前二进制插入表达式，再插入符号
          this.addExpression({
            type: `value`,
            value: this.binValue
          })
        }
        this.clearBinValue()
        this.addExpression(expression)
      }
    },

    // 向表达式插入元素
    addExpression (expression) {
      this.$store.dispatch('setExpressions', this.expressions.concat(expression))
    },

    // 替换表达式最后一个元素
    replaceExpression (expression) {
      this.$store.dispatch('setExpressions', this.expressions.slice(0, this.expressions.length - 1).concat(expression))
    },

    // 计算表达式
    calculateExpressions (expressions, isTemp) {
      let calcExpressions = expressions.map(expression => this.convertCalc(expression)).join(``)
      let result
      if (calcExpressions.length) {
        let calculateResult = calculate(calcExpressions)
        let binResult = convertSystem(calculateResult, SYSTEM[`dec`], SYSTEM[`bin`])
        result = handleOverflow(binResult, this.bitLengthCount)
      } else {
        result = `0`
      }
      if (!isTemp) {
        this.clearExpressions()
      }
      this.$store.dispatch('setBinValue', result)
      this.$store.dispatch('setIsTemp', true)
    },

    // 清除表达式
    clearExpressions () {
      this.$store.dispatch('setExpressions', [])
    },

    // 更新当前二进制
    setBinValue (systemValue, systemType) {
      this.$store.dispatch('setBinValue', convertSystem(systemValue, systemType, SYSTEM[`bin`]))
    },

    // 清除当前二进制
    clearBinValue () {
      this.$store.dispatch('setBinValue', `0`)
    },

    // 计算临时结果
    setTempValue () {
      // 找出需要临时计算结果的表达式，规则为：以数组尾的运算符作为衡量，向前遍历，直到遇到优先级小于衡量运算符优先级的为止，中间这段记为临时计算的表达式。可以简单理解为如图所示： < [>=] current，图示里中括号框起来的部分为优先级大于等于当前运算符优先级的，是优先计算的表达式。如果遍历过程中遇到右括号，应该记录起来，遇到左括号则抵消，且此时不再比较运算符优先级，因为括号内部会优先运算，得到的值会纳入临时表达式中。如果遇到没有右括号匹配的左括号，表示临时表达式到此结束，直接中断遍历。这段找表达式的方法扩展为分析多段表达式后，也可以作为替代eval来计算整段表达式的方式。
      if (!this.expressions.length) return // 按下计算键后，不需要重复调用
      let lastPosition
      for (lastPosition = this.expressions.length - 1; lastPosition >= 0; lastPosition--) {
        if (this.expressions[lastPosition].type !== `value`) {
          break
        }
      }
      let currentPriority = this.symbolPriority[this.expressions[lastPosition].value]
      let position = lastPosition - 1
      let extraRightBracket = 0
      while (position >= 0) {
        if (this.expressions[position].value === `)`) {
          extraRightBracket++
        } else if (this.expressions[position].value === `(`) {
          if (extraRightBracket <= 0) {
            break
          }
          extraRightBracket--
        }
        if (extraRightBracket <= 0) {
          let priority = this.symbolPriority[this.expressions[position].value]
          if (priority && priority < currentPriority) {
            break
          }
        }
        position--
      }
      // 按位非比较特殊，是将符号插入到数字前，所以截取的时候需要多截一个表达式
      let startPosition = position > -1 // 若为-1，则表示找到表达式第一个元素，也仍未找到优先级能够截取临时表达式的符号
        ? this.expressions[position].value === `Not`
          ? position
          : position + 1
        : 0
      let endPosition = this.expressions[lastPosition].value === `Not` ? this.expressions.length : this.expressions.length - 1
      let expressions = this.expressions.slice(startPosition, endPosition)
      this.calculateExpressions(expressions, true)
    },

    clearTempValue () {
      this.$store.dispatch('setIsTemp', false)
    },

    // 求值
    keyEqual () {
      // 表达式最后一位不是值或右括号时，先将当前二进制插入表达式，再进行计算
      let lastExpression = this.expressions[this.expressions.length - 1]
      let type = lastExpression && lastExpression.type || null
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
      }
      this.calculateExpressions(this.expressions, false)
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
        default: // 目前只有括号模式符合
          return value
      }
    },

    isSymbolEnd (key, symbol) {
      return !!this.expressions.length && this.expressions[this.expressions.length - 1][key] === symbol
    },

    // 判断键位禁用状态
    isDisabled (disableds) {
      return disableds.some(systemType => systemType === this.systemType)
    },

    // key的动态样式
    keyClass (key) {
      const switchMove = key.type === `↑` && this.isRotateMove ? 'active' : ''
      const classList = [switchMove]
      return classList
    }
  },

  components: {
    // 目前只有`(`键有额外的文字，代码量较少，所以直接写在父组件里。同时考虑到拓展性，可以更灵活地兼容多种键位的额外文字，采用jsx的写法。
    KeyExtra: {
      props: {
        keyItem: {
          type: Object,
          required: true,
          default: () => {}
        },

        expressions: {
          type: Array,
          required: true,
          default: () => []
        }
      },

      computed: {
        // 左括号比右括号多的数量
        extraLeftBracket () {
          return extraSymbol(this.expressions, `(`, `)`)
        }
      },

      methods: {
        createExtra () {
          switch (this.keyItem.type) {
            case `(`:
              return this.extraLeftBracket > 0
                ? <span class="extra-left-bracket">{ this.extraLeftBracket }</span>
                : ``
            default:
              return ``
          }
        }
      },

      render (h) {
        return (
          <span>{ this.createExtra() }</span>
        )
      }
    }
  }
}
</script>

<style lang='scss'>
.keyboard-container {
  width: 100%;
  table-layout: fixed;
  .key-item {
    width: 100%;
    height: 8vh;
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
  .key-number, .key-arithmetic, .key-switch-sign, .key-dot {
    font-size: 18px;
  }
  .key-switch-move, .key-backspace, .key-bracket {
    font-size: 16px;
  }
  .key-ce, .key-reset, .key-letter, .key-number {
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
    top: 50%;
    left: calc(50% + 5px);
    font-size: 13px;
    font-weight: bold;
  }
}
</style>
