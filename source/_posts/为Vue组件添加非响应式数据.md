---
title: 为Vue组件添加非响应式数据
date: 2022-09-27 21:47:50
tags: vue
categories: front-end
---

> vue的数据来源包括 `data`，`computed`，`自定义options(vm.$options)`，`实例外(export default外)`

在vue组件中data内函数返回的对象默认是响应式的，这种响应式被用在模板更新、watch变更、computed依赖

此外还有一种场景，数据本身并不需要响应式，多见于 `常量` 或者一些`第三方库`，这里就总结下添加非响应式数据的几种方式

## 避免把数据挂载到data内函数返回的对象上
### 1. 将数据定义在export default之外
```js
const bigData = {
  ...
}
export default {
  ...
}
```

- 不能在模板内使用
- 其中一个实例对象的内改变数据，另一个对象内的数据也会被改变
	- 实质是定义在组件这个类上面的，是类的内部变量，被所有实例对象共享

应用场景：不需要在模板内使用的常量、不变配置项等

### 2. 将数据定义在组件的自定义属性中
```js
export default {
  ···
  bigData: { // 自定义属性
    ....
  },
  methods: {
    doSomething() {
      return this.$options.bigData // 访问方式
    }
  }
}
```

- 弊端在于数据的定义被分在了2个地方，添加的自定义属性对不了解的人会产生误解，使用时也会增加调用链
- 如果数据更改，需要手动调用this.$forceUpdate()才能使模板更新

## 利用Vue无法检测对象属性的添加来实现
> 受现代 JavaScript 的限制 (而且 Object.observe 也已经被废弃)，Vue 无法检测到对象属性的添加或删除。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的

### 3. 在created或者mounted中使用 this.bigData
待实例完成初始化observe后，加入属性
```js
export default {
  data() {
    return {}
  },
  created() {
    this.bigData = {
      ···
    }
  }
  ···
}
```

- 同样的，数据的定义被分在了2个地方

## 剖析observe函数来寻找办法
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}


export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)  // 切入口2
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  // 省略
}
  /**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {  // 切入口3
    return
  }
  // 省略响应式处理代码
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&  // 切入口1
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}

```

### 4. 使用Object.preventExtensions和Object.seal

> Object.isExtensible(value)返回为false

preventExtensions
```js
export default {
  data() {
    return {
      bigData: Object.preventExtensions({
        ···
      })
    }
  }
}
```

Object.freeze()
```js
let a = { prop: 1, prop2: 2 } // undefined
Object.freeze(a) // {prop: 1, prop2: 2}
a.prop = 3 // 3
a // {prop: 1, prop2: 2}

// Object.freeze()冻结的是值，仍然可以将变量的引用替换掉
a = {prop44: 44} // {prop44: 44}
a // {prop44: 44}

// 注意区分const和Object.freeze
// const表示声明常量 不能再赋值 且声明时必须初始化
const TEST = 1
TEST = 2 // 报错:TypeError: Assignment to constant variable.

function deepFreeze (obj) {
  let names = Object.getOwnPropertyNames(obj)
  names.forEach(name => {
    var property = obj[name]
    if (typeof(property) === 'object' && property !== null) {
      deepFreeze(property)
    }
    return Object.freeze(property)
  })
}
```

当bigData值改变时，都需要重新调用一次
```js
updateBigData (newBigData) {
    this.bigData = Object.preventExtensions(newBigData)
  }
```

这种写法bigData属性是响应式的，值改变后模板会自动更新；当然如果是bigData某个属性改变，仍然需要手动调用this.$forceUpdate()

### 5. 使属性不可枚举
> 使挂载的数据key不在Object.keys(obj)返回的数组中

```js
export default {
  data() {
    const data = {
      bigData: {
        ···
      }
      ··· // 其他属性
    }
    Object.defineProperty(data, 'bigData', {
      enumerable: false
    })
    return data
  }
}
```


## 整体对比

![](http://cdn.becase.top/20220901110405.png)

## 参考
[Object.freeze() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)

[Object.isFrozen() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)

[vue性能提升-非响应式数据](https://juejin.cn/post/6855129007093596173)
