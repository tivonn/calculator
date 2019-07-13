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
          {{ key.type }}
        </button>
      </td>
    </tr>
  </table>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

export default {
  name: 'Keyboard',

  data () {
    return {
      keys: [
        // type: 类型，
        // class： 类名，
        // disableds： 禁用状态对应的进制，
        // callback：点击回调
        {
          type: `Lsh`,
          class: [],
          disableds: [],
          callback: this.keyLeftMove
        },
        {
          type: `Rsh`,
          class: [],
          disableds: [],
          callback: this.keyRightMove
        },
        {
          type: `Or`,
          class: [],
          disableds: [],
          callback: this.keyBitwiseOr
        },
        {
          type: `Xor`,
          class: [],
          disableds: [],
          callback: this.keyBitwiseXOr
        },
        {
          type: `Not`,
          class: [],
          disableds: [],
          callback: this.keyBitwiseNot
        },
        {
          type: `And`,
          class: [],
          disableds: [],
          callback: this.keyBitwiseAnd
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
          callback: this.keyDivide
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
          callback: this.keyMutiply
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
          callback: this.keyMinus
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
          callback: this.keyAdd
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
      isLogicalMove: false // 是否逻辑位移
    }
  },

  computed: {
    ...mapState([
      'systemType',
      'binValue'
    ]),

    ...mapGetters([
      'systemValue'
    ])
  },

  methods: {
    // 左移
    keyLeftMove () { },

    // 逻辑左移
    keyLogicalLeftMove () { },

    // 右移
    keyRightMove () { },

    // 逻辑右移
    keyLogicalRightMove () { },

    // 按位或
    keyBitwiseOr () { },

    // 按位异或
    keyBitwiseXOr () { },

    // 按位非
    keyBitwiseNot () { },

    // 按位与
    keyBitwiseAnd () { },

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
            callback: this.keyLeftMove
          },
          {
            type: `Rsh`,
            class: ``,
            disableds: [],
            callback: this.keyRightMove
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
    keyMod () { },

    // 清除当前值
    keyCe () {
      this.$store.commit("setBinValue", `0`)
    },

    // 重置
    keyReset () {
      this.$store.commit("setBinValue", `0`)
      this.$store.commit("setExpression", [])
    },

    // 退格
    keyBackspace () {
      let length = this.systemValue.length
      // 将systemValue退格1位后，转化成二进制存储
      let systemValue =
        length > 1 ? this.systemValue.slice(0, length - 1) : `0`
      this.setBinValue(systemValue)
    },

    // 除
    keyDivide () { },

    // 乘
    keyMutiply () { },

    // 减
    keyMinus () { },

    // 加
    keyAdd () { },

    // 左括号
    keyLeftBracket () { },

    // 右括号
    keyRightBracket () { },

    // 切换正负
    switchSign () { },

    // 小数点，目前模式不支持，暂时定义空函数
    keyDot () { },

    // 输入值
    keyValue (value) {
      // 将systemValue拼接输入的值后，转化为二进制存储
      let systemValue =
        this.systemValue === `0` ? value : this.systemValue.concat(value)
      this.setBinValue(systemValue)
    },

    // 求值
    keyEqual () { },

    // 更新二进制的值
    setBinValue (systemValue) {
      this.$store.commit(
        "setBinValue",
        convertSystem(systemValue, this.systemType, SYSTEM[`bin`])
      )
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
}
</style>