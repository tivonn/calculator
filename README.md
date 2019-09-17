# calculator

## 项目介绍

本项目以Vue.js开发，实现了win10的程序员版本计算器的所有功能。允许对2、8、10、16进制和8、16、32、64位字长的任意切换，全键盘模式下支持加减乘除、括号、按位与、按位或、按位异或、按位非、取模、（循环）左移右移等功能，位键盘模式下可根据当前字长直接设置二进制数值，除此之外还提供了数值存储功能。页面支持响应式。

## 启动项目

1. npm install
2. npm run serve
3. 访问[本地开发路径](http://localhost:8080/)

## 开发事项

1. 当前显示的值转换为二进制的形式存储，变量名为binValue。binValue的计算方式有两种情况，一种是按下等号后计算得到的值，此时isTemp为false，另一种是输入长串表达式时，找到优先级最高的一串表达式，由这串表达式计算得到的值，此时isTemp为true。当isTemp为true时，按下类型为值的键会重置binValue，并将isTemp设置为false。
2. 表达式以对象数组的形式存储，变量名为expressions，type表示表达式的类型，value表示表达式的值。数值按二进制存储，符号按键位显示的文字存储，在计算的时候转换为对应的符号。
3. 按位非比较特殊，在插入符号后，会将最后一个数字表达式与按位非符号对调，在处理表达式的时候需要进行一些兼容处理。
4. 寻找表达式尾部优先级最高的一串表达式的规则是以数组尾的运算符作为衡量，向前遍历，直到遇到优先级小于衡量运算符优先级的为止，中间这段记为临时计算的表达式，并且需要处理括号的情况。具体规则参照src/components/Keyboard.vue中func:setTempValue的注释。
4. 二进制的位数分为64位、32位、16位、8位，由bitLength区分。符号位（第一位）为1表示负数，但js无法识别出是负数，需要额外处理，将二进制取反加1，再转换为十进制，并加上-号存储。
5. win10的计算器存在一些交互比较奇怪的地方。例如输入了(1+2)再输入(时，会直接将原表达式清空，本计算器在交互上做了改动，最后为)时不允许直接输入(，需要有其它符号间隔开。又例如5Lsh2+8，加法的优先级高于按位左移，应该先计算2+8，但是win10的计算器先计算了按位左移，本计算器则是根据优先级，先计算加法。类似这样交互奇怪的地方还有一些，均做了处理，在此不一一阐述。
6. 在计算非常大的数字时，js原生的parseInt和toString方法会溢出，暂时没有做兼容处理。
