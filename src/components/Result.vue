<template>
  <div class="result-container">
    <div class="expressions">{{ showExpressions }}</div>
    <p class="system-value">{{ convertValue(systemValue, systemType) }}</p>
    <ul class="system-list">
      <li
        v-for="(system, type) in systems"
        :key="type"
        class="system-item clear-fix"
        :class="systemClass(type)"
        @click="switchSystem(type)">
        <span class="system-type">{{ type.toUpperCase() }}</span>
        <span class="system-count">{{ convertValue(system.count, type) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem, convertValue, isNegative } from '@/utils'

export default {
  name: 'Result',

  computed: {
    ...mapGetters([
      'expressions',
      'binValue',
      'systemType',
      'systemValue',
      'bitValue'
    ]),

    // 显示的表达式
    showExpressions () {
      return this.expressions.map(expression => this.convertLabel(expression)).join(` `)
    },

    // 生成进制列表
    systems () {
      let systems = {}
      for (let system in SYSTEM) {
        let count = convertSystem(this.binValue, SYSTEM[`bin`], SYSTEM[system])
        if (!isNegative(count) && system === `bin` && count !== `0`) {
          // 非负数时，二进制显示的值的length需要是4的倍数，按照4位一组补全
          count = this.setIntervalPrefix(count, 4, `0`)
        }
        systems[system] = {
          count
        }
      }
      return systems
    }
  },

  methods: {
    // 转换可视化表达式
    convertLabel (expression) {
      switch (expression.type) {
        case `value`:
          let value = convertSystem(expression.value, SYSTEM[`bin`], SYSTEM[this.systemType])
          // 十六进制需要大写
          if (this.systemType === `hex`) {
            value = value.toUpperCase()
          }
          return value
        default:
          return expression.value
      }
    },

    // 根据不同进制的显示规则来处理值
    convertValue (value, system) {
      if (isNegative(value)) {
        // 负数时，除十进制外，其余进制不用负号表示。二进制先求原码，转换为反码后再加1，十六进制和八进制需要以二进制为基准，转换显示
        switch (system) {
          case (`hex`):
            // 十六进制，需要将二进制从右到左每4位合并为一组再转换
            value = this.convertCount(this.bitValue, SYSTEM[`hex`], 4)
            break
          case (`dec`):
            // 十进制不需要做额外处理
            break
          case (`oct`):
            // 八进制，需要将二进制从右到左每3位合并为一组再转换
            value = this.convertCount(this.bitValue, SYSTEM[`hex`], 3)
            break
          case (`bin`):
            // 二进制取bit.vue组件中计算好的值显示
            value = this.bitValue
            break
          }
        }
      return convertValue(value, system)
    },

    // 将二进制根据间隔分组，转换为其它进制
    convertCount (value, system, interval) {
      value = this.setIntervalPrefix(value, interval, `0`)
      let systemValue = ``
      let groupCount = value.length / interval
      for (let i = 0; i < groupCount; i++) {
        let groupValue = value.slice(i * interval, (i + 1) * interval)
        systemValue = systemValue.concat(convertSystem(groupValue, SYSTEM[`bin`], system))
      }
      return systemValue
    },

    // 根据间隔的长度补全位数
    setIntervalPrefix (value, interval, prefix) {
      let modCount = value.length % interval
      if (modCount !== 0) {
        return prefix.repeat(interval - modCount).concat(value)
      } else {
        return value
      }
    },

    // 进制样式
    systemClass (type) {
      return {
        active: type === this.systemType
      }
    },

    // 切换进制
    switchSystem (type) {
      this.$store.dispatch('setSystemType', type)
    }
  }
}
</script>

<style lang='scss'>
.result-container {
  .expressions {
    height: 6vh;
    padding: 0 5px;
    line-height: 6vh;
    overflow-x: auto;
    overflow-y: hidden;
    font-size: 16px;
    text-align: right;
    color: #5c5c5c;
    white-space: nowrap;
  }
  .system-value {
    height: 8vh;
    padding: 0 5px;
    line-height: 8vh;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: right;
    font-weight: bold;
    white-space: nowrap;
    @media (min-width: 1366px), (min-height: 1000px) {
      font-size: 60px;
    }
    @media (min-width: 700px) and (max-width: 1366px), (min-height: 800px) and (max-height: 1000px) {
      font-size: 33px;
    }
    @media (max-width: 700px), (max-height: 800px) {
      font-size: 28px;
    }
  }
  .system-list {
    margin-top: 4vh;
  }
  .system-item {
    position: relative;
    border-left: 3px solid #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: #dadada;
    }
    &.active {
      border-color: #409eff;
    }
  }
  .system-type, .system-count {
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: bold;
  }
  .system-type {
    width: 55px;
    height: 5vh;
    line-height: 5vh;
    text-align: center;
  }
  .system-count {
    width: calc(100% - 55px);
    position: absolute;
    top: 50%;
    left: 55px;
    line-height: 1.4;
    transform: translateY(-50%);
  }
}
</style>
