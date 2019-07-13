import { SYSTEM } from '@/utils/enum'

// 进制转换
export const convertSystem = (number, from, to) => {
  let value = parseInt(number, from).toString(to)
  // 针对不同进制定制化
  if (to === SYSTEM[`hex`]) {
    // 十六进制时，将A-F转换为大写
    value = value.toUpperCase()
  } else if (to === SYSTEM[`bin`]) {
    // 判断是否为负数
    if (value.charAt(0) !== `-`) {
      // 二进制时，按照4位一组补全
      if (value !== `0`) {
        let modCount = value.length % 4
        if (modCount !== 0) {
          value = `0`.repeat(4 - modCount).concat(value)
        }
      }
    }
  }
  return value
}
