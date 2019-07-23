<template>
  <div class="memory-container">
    <p class="memory-title">内存</p>
    <template v-if="memories.length">
      <ul class="memory-list">
        <li
          v-for="(memory, index) in memories"
          :key="memory.id"
          class="memory-item"
          @click="setBinValue(memory)">
          <p class="memory-value">{{ convertValue(showMemoryValue(memory.value), systemType) }}</p>
          <div>
            <span class="operation-item" @click.stop="deleteMemory(index)">MC</span>
            <span class="operation-item" @click.stop="updateMemory(`+`, index)">M+</span>
            <span class="operation-item" @click.stop="updateMemory(`-`, index)">M-</span>
          </div>
        </li>
      </ul>
      <span class="reset-memory" title="清除所有内存" @click="resetMemory">
        <svg class="iconfont">
          <use xlink:href="#icon-lajitong"></use>
        </svg>
      </span>
    </template>
    <p v-else class="no-memory">内存中没有内容</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SYSTEM } from '@/utils/enum'
import { convertSystem, convertValue, concat0B, calculate, handleOverflow } from '@/utils'

export default {
  name: 'Memory',

  computed: {
    ...mapGetters([
      'binValue',
      'systemType',
      'bitLengthCount',
      'memories'
    ])
  },

  methods: {
    addMemory () {
      this.$store.dispatch('setMemories', [{
        id: new Date().getTime(), // 使用当前时间戳作为id
        value: this.binValue
      }].concat(this.memories))
      this.$nextTick(() => { this.addAnimation() })
    },

    addAnimation () {
      let el = document.querySelectorAll('.memory-item')[0]
      el.style.height = `0`
      el.style.opacity = `0`
      // 动画队列
      setTimeout(() => {
        el.style.height = `100px`
      }, 100)
      setTimeout(() => {
        el.style.opacity = `1`
      }, 600)
    },

    // 选择memory处理过溢出后的值作为binValue
    setBinValue (memory) {
      this.$store.dispatch('setBinValue', convertSystem(this.showMemoryValue(memory.value), SYSTEM[this.systemType], SYSTEM[`bin`]))
    },

    deleteMemory (index) {
      this.deleteAnimation(index)
      // 为了不直接修改到state的数据，先浅拷贝一次再进行赋值
      setTimeout(() => { // 延迟500ms执行是为了让动画执行完毕
        let memories = this.memories.slice()
        memories.splice(index, 1)
        this.$store.dispatch('setMemories', memories)
      }, 500)
    },

    deleteAnimation (index) {
      let el = document.querySelectorAll('.memory-item')[index]
      el.style.height = `0`
    },

    updateMemory (arithmetic, index) {
      let leftValue = concat0B(this.memories[index].value)
      let rightValue = concat0B(this.binValue)
      let calculateResult = calculate(`${leftValue}${arithmetic}${rightValue}`)
      let binResult = convertSystem(calculateResult, SYSTEM[`dec`], SYSTEM[`bin`])
      let newValue = handleOverflow(binResult, this.bitLengthCount)
      this.$store.dispatch('updateMemory', {
        id: this.memories[index].id,
        newValue
      })
    },

    resetMemory () {
      this.$store.dispatch('setMemories', [])
    },

    // 用于展示的值
    showMemoryValue (value) {
      // 先处理溢出，再转换进制
      return convertSystem(handleOverflow(value, this.bitLengthCount), SYSTEM[`bin`], SYSTEM[this.systemType])
    },

    // 根据不同进制的显示规则处理值
    convertValue (value, system) {
      return convertValue(value, system)
    }
  }
}
</script>

<style lang="scss">
.memory-container {
  height: 99vh;
  position: relative;
  padding-left: 20px;
  .memory-title {
    width: 35px;
    height: 5vh;
    line-height: 5vh;
    border-bottom: 3px solid #409eff;
    text-align: center;
    font-weight: bold;
  }
  .memory-list {
    max-height: calc(92vh - 40px);
    margin-top: 2vh;
    overflow: auto;
  }
  .memory-item {
    padding-right: 10px;
    overflow: hidden;
    text-align: right;
    transition: height .5s;
    cursor: pointer;
    &:hover {
      background-color: #f2f2f2;
      .operation-item {
        border-color: #f2f2f2;
        &:hover {
          border-color: #e6e6e6;
        }
      }
    }
  }
  .memory-value {
    height: 60px;
    padding-left: 5px;
    line-height: 70px;
    overflow-x: auto;
    overflow-y: hidden;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
  }
  .operation-item {
    width: 50px;
    height: 36px;
    display: inline-block;
    margin-left: 20px;
    line-height: 36px;
    border: 2px solid #e6e6e6;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
  }
  .reset-memory {
    width: 40px;
    height: 40px;
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    line-height: 40px;
    border: 3px solid #e6e6e6;
    text-align: center;
    cursor: pointer;
    &:hover {
      border-color: #f2f2f2;
    }
  }
  .no-memory {
    margin-top: 2vh;
    font-weight: bold;
  }
}
</style>
