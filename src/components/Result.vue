<template>
  <div class="result-container">
    <div class="expressions">{{ showExpressions }}</div>
    <p class="system-value">{{ systemValue }}</p>
    <ul class="system-list">
      <li
        v-for="(system, type) in systems"
        :key="type"
        class="system-item clear-fix"
        :class="systemClass(type)"
        @click="switchSystem(type)"
      >
        <span class="system-type">{{ type.toUpperCase() }}</span>
        <span class="system-count">{{ system.count }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem, isNegative } from '@/utils'

export default {
  name: 'Result',

  computed: {
    ...mapGetters([
      'expressions',
      'binValue',
      'systemType',
      'systemValue'
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
        // 二进制需要4位一组
        if (system === `bin`) {
          // 判断是否为正数
          if (!isNegative(count) && count !== `0`) {
            // 二进制时，按照4位一组补全
            let modCount = count.length % 4
            if (modCount !== 0) {
              count = `0`.repeat(4 - modCount).concat(count)
            }
          }
        }
        systems[system] = {
          count
        }
      }
      return systems
    },
  },

  methods: {
    // 转换可视化表达式
    convertLabel (expression) {
      switch (expression.type) {
        case `value`:
          return convertSystem(expression.value, SYSTEM[`bin`], SYSTEM[this.systemType])
        default:
          return expression.value
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
    line-height: 6vh;
    font-size: 16px;
    text-align: right;
    color: #5c5c5c;
  }
  .system-value {
    height: 12vh;
    line-height: 8vh;
    font-size: 46px;
    text-align: right;
    font-weight: bold;
  }
  .system-item {
    height: 5vh;
    line-height: 5vh;
    border-left: 3px solid #e6e6e6;
    cursor: pointer;
    &:hover {
      background-color: #dadada;
    }
    &.active {
      border-color: #409eff;
    }
  }
  .system-type,
  .system-count {
    float: left;
    font-size: 14px;
    font-weight: bold;
  }
  .system-type {
    width: 55px;
    display: inline-block;
    text-align: center;
  }
  .system-count {
    width: calc(100% - 55px);
    display: inline-block;
  }
}
</style>