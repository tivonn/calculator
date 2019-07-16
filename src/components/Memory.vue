<template>
  <div class="memory-container">
    <p class="memory-title">存储</p>
    <template v-if="memories.length">
      <ul class="memory-list">
        <li
          v-for="(memory, index) in showMemories"
          :key="memory.id"
          class="memory-item"
        >
          <p class="memory-value">{{ memory.value }}</p>
          <div>
            <span class="operation-item" @click="deleteMemory(index)">MC</span>
            <span class="operation-item" @click="updateMemory(`+`, index)"
              >M+</span
            >
            <span class="operation-item" @click="updateMemory(`-`, index)"
              >M-</span
            >
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
import { convertSystem, concat0B } from '@/utils'

export default {
  name: 'Memory',

  computed: {
    ...mapGetters([
      'binValue',
      'systemType',
      'memories'
    ]),

    showMemories () {
      return this.memories.map(memory => {
        return Object.assign({
          value: convertSystem(memory.value, SYSTEM[`bin`], SYSTEM[this.systemType])
        })
      })
    }
  },

  methods: {
    addMemory () {
      this.$store.dispatch('setMemories', [{
        id: new Date().getTime(),  // 使用当前时间戳作为id
        value: this.binValue
      }].concat(this.memories))
    },

    deleteMemory (index) {
      // 为了不直接修改到state的数据，先浅拷贝一次再进行赋值
      let memories = this.memories.slice()
      memories.splice(index, 1)
      this.$store.dispatch('setMemories', memories)
    },

    updateMemory (arithmetic, index) {
      let newValue = eval(`${concat0B(this.memories[index].value)}${arithmetic}${concat0B(this.binValue)}`).toString(SYSTEM[`bin`])
      this.$store.dispatch('updateMemory', {
        id: this.memories[index].id,
        newValue
      })
    },

    resetMemory () {
      this.$store.dispatch('setMemories', [])
    }
  }
}
</script>

<style lang="scss">
.memory-container {
  width: 400px;
  float: left;
  padding-top: 10px;
  padding-left: 20px;
  .memory-title {
    width: 35px;
    height: 25px;
    margin-bottom: 30px;
    border-bottom: 3px solid #409eff;
    text-align: center;
    font-weight: bold;
  }
  .memory-list {
    max-height: calc(100vh - 105px);
    overflow: auto;
  }
  .memory-item {
    height: 100px;
    padding: 0 20px;
    text-align: right;
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
    line-height: 60px;
    font-size: 22px;
    font-weight: bold;
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
    position: fixed;
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
    font-weight: bold;
  }
}
</style>
