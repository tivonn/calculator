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
          :class="key.class"
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
import { convertSystem, isNegative, absValue } from '@/utils'

export default {
  name: 'Keyboard',

  data () {
    return {
      keys: [ // 键位
        {
          type: `Lsh`,  // 类型
          class: [],  // 类名
          disableds: [],  // 禁用状态对应的进制
          callback: this.keyMove  // 点击回调
        },
        {
          type: `Rsh`,
          class: [],
          disableds: [],
          callback: this.keyMove
        },
        {
          type: `Or`,
          class: [],
          disableds: [],
          callback: this.keyBitwise
        },
        {
          type: `Xor`,
          class: [],
          disableds: [],
          callback: this.keyBitwise
        },
        {
          type: `Not`,
          class: [],
          disableds: [],
          callback: this.keyBitwise
        },
        {
          type: `And`,
          class: [],
          disableds: [],
          callback: this.keyBitwise
        },
        {
          type: `↑`,
          class: [`key-switch-move`],
          disableds: [],
          callback: this.switchMoveType
        },
        {
          type: `Mod`,
          class: [],
          disableds: [],
          callback: this.keyMod
        },
        {
          type: `CE`,
          class: [`key-ce`],
          disableds: [],
          callback: this.keyCe
        },
        {
          type: `Ｃ`,
          class: [`key-reset`],
          disableds: [],
          callback: this.keyReset
        },
        {
          type: `←`,
          class: [`key-backspace`],
          disableds: [],
          callback: this.keyBackspace
        },
        {
          type: `÷`,
          class: [`key-arithmetic`],
          disableds: [],
          callback: this.keyArithmetic
        },
        {
          type: `A`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `B`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `7`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `8`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `9`,
          class: [`key-number`],
          disableds: [`oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `×`,
          class: [`key-arithmetic`],
          disableds: [],
          callback: this.keyArithmetic
        },
        {
          type: `C`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `D`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `4`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `5`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `6`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `-`,
          class: [`key-arithmetic`],
          disableds: [],
          callback: this.keyArithmetic
        },
        {
          type: `E`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `F`,
          class: [`key-letter`],
          disableds: [`dec`, `oct`, `bin`],
          callback: this.keyValue
        },
        {
          type: `1`,
          class: [`key-number`],
          disableds: [],
          callback: this.keyValue
        },
        {
          type: `2`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `3`,
          class: [`key-number`],
          disableds: [`bin`],
          callback: this.keyValue
        },
        {
          type: `+`,
          class: [`key-arithmetic`],
          disableds: [],
          callback: this.keyArithmetic
        },
        {
          type: `(`,
          class: [`key-bracket`],
          disableds: [],
          callback: this.keyLeftBracket
        },
        {
          type: `)`,
          class: [`key-bracket`],
          disableds: [],
          callback: this.keyRightBracket
        },
        {
          type: `±`,
          class: [`key-switch-sign`],
          disableds: [],
          callback: this.switchSign
        },
        {
          type: `0`,
          class: [`key-number`],
          disableds: [],
          callback: this.keyValue
        },
        {
          type: `.`,
          class: [`key-dot`],
          disableds: [`hex`, `dec`, `oct`, `bin`],
          callback: this.keyDot
        },
        {
          type: `=`,
          class: [`key-arithmetic`],
          disableds: [],
          callback: this.keyEqual
        }
      ],
      isLogicalMove: false, // 是否逻辑位移,
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
      'systemValue'
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
    }
  },

  methods: {
    // 左移右移
    keyMove (type) {
      this.handleExpression({
        type: `move`,
        value: type
      })
    },

    // 逻辑左移
    keyLogicalLeftMove () { },

    // 逻辑右移
    keyLogicalRightMove () { },

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
      this.isLogicalMove = !this.isLogicalMove
      let moveKeys = this.isLogicalMove
        ? [
          {
            type: `RoL`,
            class: ``,
            disableds: [],
            callback: this.keyLogicalLeftMove
          },
          {
            type: `RoR`,
            class: ``,
            disableds: [],
            callback: this.keyLogicalRightMove
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
      // todo 看是否能直接绑定在html，动态渲染
      // 修改切换进制键active状态
      let switchMoveKey = this.keys.find(key => key.type === `↑`)
      if (this.isLogicalMove) {
        switchMoveKey.class.push(`active`)
      } else {
        let index = switchMoveKey.class.findIndex(
          className => className === `active`
        )
        switchMoveKey.class.splice(index, 1)
      }
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
      let result = eval(expressions)
      this.setBinValue(result, SYSTEM[`dec`])
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
          return `${isNegative(value) ? `-` : ``}0B${absValue(value)}`
        default:  // 目前只有括号模式符合
          return value
      }
    },

    // 判断键位禁用状态
    isDisabled (disableds) {
      return disableds.some(systemType => systemType === this.systemType)
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
    font-size: 13px;
    text-align: center;
    outline: none;
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