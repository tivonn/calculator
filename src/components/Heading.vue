<template>
  <div class="heading-container">
    <span title="打开导航">
      <svg class="iconfont">
        <use xlink:href="#icon-caidanlan"></use>
      </svg>
    </span>
    <span class="calculator-mode">程序员</span>
  </div>
</template>

<script>
export default {
  name: 'Heading'
}
</script>

<style lang='scss'>
.heading-container {
  height: 5vh;
  padding-left: 10px;
  line-height: 5vh;
  .calculator-mode {
    margin-left: 15px;
    font-size: 20px;
  }
}
</style>
