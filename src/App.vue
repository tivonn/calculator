<template>
  <div id="app">
    <div class="calculator-container">
      <p class="calculator-mode">程序员</p>
      <result></result>
      <p class="function-list clear-fix">
        <span class="function-item" title="全键盘">全</span>
        <span class="function-item" title="比特绷板键盘">比</span>
        <span class="function-item switch-length">QWORD</span>
        <span class="function-item" title="内存存储">MS</span>
      </p>
      <keyboard></keyboard>
    </div>
    <memory></memory>
  </div>
</template>

<script>
import Result from "@/components/Result"
import Keyboard from "@/components/Keyboard"
import Memory from "@/components/Memory"

export default {
  name: 'app',

  components: {
    Result,
    Keyboard,
    Memory
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  .calculator-container {
    width: calc(100% - 400px);
    float: left;
  }
  .calculator-mode {
    height: 45px;
    padding-left: 10px;
    line-height: 45px;
    font-size: 20px;
  }
  .function-item {
    width: 100px;
    height: 35px;
    float: left;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .switch-length {
    width: calc(100% - 300px);
  }
}
</style>
