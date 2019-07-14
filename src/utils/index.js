import { SYSTEM } from '@/utils/enum'

// 进制转换
export const convertSystem = (oldVlalue, from, to) => {
  let newValue = parseInt(oldVlalue, from).toString(to)
  // 十六进制需要转换为大写
  if (to === SYSTEM[`hex`]) {
    newValue = newValue.toUpperCase()
  }
  return newValue
}

// 二进制取反加一
export const inversePlusOne = (value) => {
  return eval(`(0b${value.map(bit => bit === `1` ? `0` : `1`).join('')} +0b1)`)
}

// 判断是否为负数
export const isNegative = value => {
  return value.charAt(0) === `-`
}

// 取绝对值
export const absValue = systemValue => {
  return isNegative(systemValue)
    ? systemValue.slice(1, systemValue.length)
    : systemValue
}
