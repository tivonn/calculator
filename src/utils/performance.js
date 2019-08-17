// 节流
export function throttle(fn, minDelay = 250, scope = null) {
  let lastCall = 0
  let timer = 0
  return function () {
    let now = +new Date()
    if (now - lastCall < minDelay) {
      // 使节流函数最后一次必定会执行
      clearTimeout(timer)
      return timer = setTimeout(fn.bind(scope || this, ...arguments), minDelay)
    }
    lastCall = now
    clearTimeout(timer)
    fn.apply(scope || this, arguments)
  }
}
