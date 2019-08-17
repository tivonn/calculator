<template>
  <div class="click-ring-container"></div>
</template>

<script>
export default {
  name: 'ClickRing',

  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },

    clickPosition: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.setClickRing()
    },

    setClickRing () {
      let el = document.querySelector('.click-ring-container')
      let { x, y } = this.clickPosition
      el.style.left = `${x}px`
      el.style.top = `${y}px`
      setTimeout(() => {
        el.style.transform = `scale(0.6)`
      }, 100)
      setTimeout(() => {
        this.$emit('input', false)
      }, 400)
    }
  }
}
</script>

<style lang='scss'>
.click-ring-container {
  width: 40px;
  height: 40px;
  position: fixed;
  top: -100px;
  left: -100px;
  z-index: 9999;
  border-radius: 50%;
  box-shadow: 0 0 20px 20px #f2f2f2;
  transition: transform .3s ease;
}
</style>
