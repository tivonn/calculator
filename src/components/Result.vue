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
import { mapState, mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem } from '@/utils'

export default {
  name: 'Result',

  computed: {
    ...mapState([,
      'expressions',
      'systemType',
      'binValue'
    ]),

    ...mapGetters([
      'systemValue'
    ]),

    // 显示的表达式
    showExpressions () {
      return this.expressions.map(expression => this.convertLabel(expression)).join(``)
    },

    // 生成进制列表
    systems () {
      let systems = {}
      for (let system in SYSTEM) {
        systems[system] = {
          count: convertSystem(this.binValue, SYSTEM[`bin`], SYSTEM[system])
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

    systemClass (type) {
      return {
        active: type === this.systemType
      }
    },

    // 切换进制
    switchSystem (type) {
      this.$store.commit('setSystemType', type)
    }
  }
}
</script>

<style lang='scss'>
.result-container {
  .expressions {
    height: 40px;
    margin-top: 5px;
    font-size: 14px;
    text-align: right;
    color: #5c5c5c;
  }
  .system-value {
    margin-top: 15px;
    font-size: 24px;
    text-align: right;
    font-weight: bold;
  }
  .system-item {
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
    height: 30px;
    float: left;
    line-height: 30px;
    font-size: 13px;
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