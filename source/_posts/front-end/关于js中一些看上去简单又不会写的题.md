---
title: 关于js中一些看上去简单又不会写的题
date: 2022-05-13 22:08:08
tags: JavaScript
categories: front-end
---
## x !== x 返回true
```js
const x = ? // Please fill in the value of "x?
if (x !== x) {
  console.log('hello fatfish')
}
```

如果你有仔细阅读 `es6` 的教程的话，就知道这个问题是一个典型的demo
```js
const x = NaN // Please fill in the value of "x?
if (x !== x) {
  console.log('hello fatfish')
}
console.log(NaN === NaN) // false
console.log(x !== x) // true
console.log(Number.isNaN(x)) // true
```

## (!isNan(x) && x !== x) 返回 true
现在难度提高
```js
const x = ? // Please fill in the value of "x?
if(!isNaN(x) && x !== x) {
  console.log('hello fatfish')
}
```

你知道 `Object.defineProperty()` 吗？

请参考[Object.defineProperty() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

```js
window.x = 0 // Any value is OK
Object.defineProperty(window, 'x', {
  get () {
    return Math.random()
  }
})
console.log(x) // 0.12259077808826002
console.log(x === x) // false
console.log(x !== x) // true
```

## 如何使得 x === x+1
使用极大值  `Number.MAX_SAFE_INTERGER` 
参考 [Number.MAX_SAFE_INTEGER - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)

```js
const x =  Number.MAX_SAFE_INTEGER + 1// Please fill in the value of "x?
if (x === x + 1) {
  console.log('hello fatfish')
}
```

## 如何使得 x > x
 使用 `Symbol.toPrimitive` 

```js
const x = { // Please fill in the value of "x?
  value: 1,
  [ Symbol.toPrimitive ] () {
    console.log('x', this.value)
    return --this.value
  }
}

if (x > x) {
  console.log('hello fatfish')
}
```


## 实现 typeof x === ‘undefined’ && x.length > 0

答案是 `document.all()`

```js
const x = document.all // Please fill in the value of "x?
if(typeof x === 'undefined' && x.length > 0) {
  console.log('hello fatfish')
}

console.log(x)
console.log(typeof x)
console.log(x === undefined)
```


参考 [javascript - Why is document.all falsy? - Stack Overflow](https://stackoverflow.com/questions/10350142/why-is-document-all-falsy/62005426)
