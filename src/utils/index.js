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

// 按照位数补全前缀
export const setPrefixBit = (binValue, totalLength) => {
  if (!isNegative(binValue)) {
    // 非负数直接补0
    return `0`.repeat(totalLength - binValue.length).concat(binValue)
  } else {
    // 负数需要前缀全部为1，取反加1
    let positiveValue = absValue(binValue)
    let oldLength = positiveValue.length
    let value = inversePlusOne(positiveValue.split(''), false)
    // 在取反后，前缀为0会被忽略，在出现位数减少的时候需要补全
    value = `0`.repeat(oldLength - value.length).concat(value)
    return `1`.repeat(totalLength - value.length).concat(value)
  }
}

// 去除前缀多余的0
export const deletePrefixZero = (value) => {
  let index = value.split('').findIndex(bit => bit !== `0`)
  return index > -1 ? value.slice(index, value.length) : `0`
}

// 二进制取反加一
export const inversePlusOne = (value, needNegative) => {
  let newValue = eval(`(0b${value.map(bit => bit === `1` ? `0` : `1`).join('')} +0b1)`)
  return convertSystem(`${needNegative ? `-`: ``}${newValue}`, SYSTEM[`dec`], SYSTEM[`bin`])
}

// 给二进制数字加上0x
export const concat0B = (value) => {
  if (isNegative(value)) {
    return `-0B${absValue(value)}`
  } else {
    return `0B${value}`
  }
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
