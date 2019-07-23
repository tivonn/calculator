<template>
  <div class="heading-container">
    <span class="show-sidebar" title="打开导航" @click.stop="$emit(`show-sidebar`)">
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
  line-height: 5vh;
  .show-sidebar {
    width: 5vh;
    height: 5vh;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #dbdbdb;
    }
  }
  .calculator-mode {
    margin-left: 5px;
    font-size: 20px;
  }
}
</style>
