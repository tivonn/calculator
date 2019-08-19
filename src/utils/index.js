import store from '@/store'
import { SYSTEM } from '@/utils/enum'

// 进制转换
export const convertSystem = (oldVlalue, from, to) => {
  let newValue = parseInt(oldVlalue, from).toString(to)
  return newValue
}

// 将二进制根据间隔分组，转换为其它进制
export const convertCount = (value, system, interval) => {
  value = setIntervalPrefix(value, interval, `0`)
  let systemValue = ``
  let groupCount = value.length / interval
  for (let i = 0; i < groupCount; i++) {
    let groupValue = value.slice(i * interval, (i + 1) * interval)
    systemValue = systemValue.concat(convertSystem(groupValue, SYSTEM[`bin`], system))
  }
  return systemValue
}

// 根据间隔的长度补全位数
export const setIntervalPrefix = (value, interval, prefix) => {
  let modCount = value.length % interval
  if (modCount) {
    return prefix.repeat(interval - modCount).concat(value)
  } else {
    return value
  }
}

// 根据不同进制的显示规则处理值
export const convertValue = (value, system, needIntervalChar) => {
  if (isNegative(value)) {
    // 负数时，除十进制外，其余进制不用负号表示。二进制先求原码，转换为反码后再加1，十六进制和八进制需要以二进制为基准，转换显示
    switch (system) {
      case (`hex`):
        // 十六进制，需要将二进制从右到左每4位合并为一组再转换
        value = convertCount(convertBitValue(value, SYSTEM[`hex`]), SYSTEM[`hex`], 4)
        break
      case (`dec`):
        // 十进制不需要做额外处理
        break
      case (`oct`):
        // 八进制，需要将二进制从右到左每3位合并为一组再转换
        value = convertCount(convertBitValue(value, SYSTEM[`oct`]), SYSTEM[`oct`], 3)
        break
      case (`bin`):
        // 二进制，需要补全位数后取原码再取反码加1显示
        value = convertBitValue(value, SYSTEM[`bin`])
        break
    }
  }
  let newValue
  if (needIntervalChar) {
    const convertMap = {
      'hex': {
        char: ` `,
        interval: 4
      },
      'dec': {
        char: `,`,
        interval: 3
      },
      'oct': {
        char: ` `,
        interval: 3
      },
      'bin': {
        char: ` `,
        interval: 4
      }
    }
    let { char, interval } = convertMap[system]
    // 先将符号省略，根据间隔插入分隔符后再补上符号
    newValue = `${isNegative(value) ? `-` : ``}${insertIntervalChar(absValue(value), char, interval)}`
  } else {
    newValue = value
  }
  // 十六进制需要大写
  if (system === `hex`) {
    newValue = newValue.toUpperCase()
  }
  return newValue
}

// 根据位数计算二进制值
export const convertBitValue = (value, system) => {
  let binValue = convertSystem(value, system, SYSTEM[`bin`])
  let bitValue = setPrefixBit(binValue, store.getters.bitLengthCount)
  return bitValue
}

// 根据间隔插入字符
export const insertIntervalChar = (str, char, interval) => {
  let length = str.length
  // 字符长度不足间隔，则直接返回原字符
  if (length <= interval) return str
  let newStr = ``
  for (let i = length - 1; i >= 0; i--) {
    if (i === 0) {
      // 最前面的一节
      newStr = str.slice(0, length % interval || interval).concat(newStr)
    } else if ((length - i) % interval === 0) {
      // 插入分隔符
      newStr = char.concat(str.slice(i, i + interval)).concat(newStr)
    }
  }
  return newStr
}

// 按照位数补全前缀
export const setPrefixBit = (binValue, totalLength) => {
  if (!isNegative(binValue)) {
    // 非负数直接补0
    return `0`.repeat(totalLength - binValue.length).concat(binValue)
  } else {
    // 负数需要前缀全部为1，并将值取绝对值后取反加1
    let positiveValue = absValue(binValue)
    let oldLength = positiveValue.length
    let value = inversePlusOne(positiveValue, false)
    // 在取反后，前缀为0会被忽略，在出现位数减少的时候需要补全
    value = `0`.repeat(oldLength - value.length).concat(value)
    if (totalLength - value.length > 0) {
      return `1`.repeat(totalLength - value.length).concat(value)
    } else if (totalLength - value.length === 0) {
      return value
    } else {
      return value.split('').slice(-totalLength, value.length).join('')
    }
  }
}

// 去除前缀多余的0
export const deletePrefixZero = (value) => {
  let index = value.split('').findIndex(bit => bit !== `0`)
  return index > -1 ? value.slice(index, value.length) : `0`
}

// 二进制取反加一
export const inversePlusOne = (value, needNegative) => {
  let inverseValue = concat0B(value.split('').map(bit => bit === `1` ? `0` : `1`).join(''))
  // eslint-disable-next-line
  let newValue = eval(`(${inverseValue} + ${concat0B(`1`)})`)
  newValue = convertSystem(newValue, SYSTEM[`dec`], SYSTEM[`bin`])
  return `${needNegative ? `-` : ``}${newValue}`
}

// 给二进制数字加上0B
export const concat0B = (value) => {
  return isNegative(value) ? `-0B${absValue(value)}` : `0B${value}`
}

// 判断是否为负数
export const isNegative = value => {
  return value[0] === `-`
}

// 取绝对值
export const absValue = systemValue => {
  return isNegative(systemValue) ? systemValue.slice(1, systemValue.length) : systemValue
}

// 处理连续的减号，例如1--1（即1减负1），将其变为1+1，否则无法进行eval计算
export const convertMinus = expressions => {
  return expressions.replace(/--/g, '+')
}

// 计算
export const calculate = (expressions) => {
  // eslint-disable-next-line
  let calculateResult = eval(convertMinus(expressions))
  let binResult = convertSystem(calculateResult, SYSTEM[`dec`], SYSTEM[`bin`])
  return handleOverflow(binResult)
}

// 处理溢出
export const handleOverflow = (value) => {
  // 原本的正负会决定溢出后是否需要添加负号
  let isNegativeValue = isNegative(value)
  let bitLengthCount = store.getters.bitLengthCount
  // 从字符串尾部开始截取
  value = value.slice(-bitLengthCount, value.length)
  // 处理负数
  if (value.length === bitLengthCount && value[0] === `1`) {
    // 舍去符号位，按位取反再加1，求出十进制对应的正值，再根据isNegativeValue加上负号存储
    value = inversePlusOne(absValue(value), !isNegativeValue)
  }
  return value
}

// 计算两个符号的数量差
export const extraSymbol = (expressions, moreSymbol, lessSymbol) => {
  let extraCount = 0
  for (let expression of expressions) {
    if (expression.value === moreSymbol) {
      extraCount++
    } else if (expression.value === lessSymbol) {
      extraCount--
    }
  }
  return extraCount
}
