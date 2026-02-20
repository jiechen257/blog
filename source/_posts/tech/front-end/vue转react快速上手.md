---
title: vue转react快速上手
categories: [tech, front-end]
tags: [front-end, framework]
abbrlink: 7380
date: 2022-04-25 21:52:01
---

## JSX

先介绍 React 唯一的一个语法糖：JSX。

```html
<div class='box' id='content'>
  <div class='title'>Hello</div>
  <button>Click</button>
</div>
```

上面的 DOM 结构可以看出，要每个标签只有 3 个信息：标签名、属性、子元素，所以上面等同于下面的 JSON 结构：

```js
{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello']
    },
    {
      tag: 'button',
      attrs: null,
      children: ['Click']
    }
  ]
}
```

当你写下这个 React 组件时：

```tsx
import React from 'react';

function MyComponent(props) {
    return <div>{props.hello}</div>
}
```

最终会被自动工具翻译成：

```javascript
import React from 'react';

function MyComponent(props) {
    return React.createElement('div', null, props.hello);
}
```

理解 JSX 语法并不困难，简单记住一句话，遇到 `{}` 符号内部解析为 JS 代码，遇到成对的 `<>` 符号内部解析为 HTML 代码。React 就是通过这个小小语法糖，实现在 JS 里面写 HTML，可能有小伙伴会说 HTML 与 JS 分离不是更好吗？责职分明，混合只会更乱。但当你体验到代码自动提示，自动检查，以及调试时精确定位到一行代码的好处时，就清楚 React 和 Vue 的差距了。

## 语法糖转换

习惯 Vue 的同学都知道很多语法糖，比如 `v-if`、`v-for`、`v-bind`、`v-on` 等，相比 Vue，React 只有一个语法糖，那就是 jsx/tsx。`v-if` 这些功能在 React 上都是通过原生 javascript 实现的，慢慢你会发现，其实你学的不是 React，而是 Javascipt，React 赋予你通过 js 完整控制组件的能力，这部分明显比 Vue 的语法糖更加灵活，糖太多容易引来虫子（Bug）。 ![satisfied](https://content.hackertalk.net/emoji/g/64/1f606.png)

### v-if 条件渲染

vue 中写法是这样：

```html
<template>
  <div>
    <h1 v-if="awesome1">Vue is awesome!</h1>
    <h1 v-else>else</h1>
    <h1 v-if="awesome2">Oh no</h1>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      awesome1: true,
      awesome2: false,
    }
  }
}
</script>
```

在 React 函数组件中只需这样：

```tsx
import React, { useState } from 'react';

function Index() {
  const [awesome1, setAwesome1] = useState(true);
  const [awesome2, setAwesome2] = useState(false);

  return (
    <div>
      {awesome1 ? <h1>React is awesome!</h1> : <h1>Oh no</h1>}
      {awesome2 && <h1>React is awesome!</h1>}
    </div>
  );
}

export default Index;
```

只需使用 js 三目运算符语法即可完成条件渲染的功能。或者使用 && 逻辑，记住下面一句话就能过理解了：

> 遇到 `{}` 符号内部解析为 JS 代码，遇到成对的 `<>` 符号内部解析为 HTML 代码

### v-for 列表渲染

Vue 中写法：

```html
<template>
  <ul id="array-rendering">
    <li v-for="item in items">
      {{ item.message }}
    </li>
  </ul>
</template>

<script>
module.exports = {
  data() {
    return {
      items: [{ message: 'Foo' }, { message: 'Bar' }]
    }
  }
}
</script>
```

React 写法：

```tsx
import React, { useState } from 'react';

function Index() {
  const [items, setItems] = useState([{ message: 'Foo' }, { message: 'Bar' }]);

  return (
    <ul id="array-rendering">
      {items.map((item, id) => <li key={id}>{item.message}</li>)}
    </ul>
  );
}

export default Index;
```

React 通过 js 的数组语法 map，将数据对象映射为 DOM 对象。只需学会 js，无需记住各种指令，如果要做列表过滤，直接使用 `items.filter(...).map(...)` 链式调用即可，语法上更加灵活，如果为了提高渲染性能，使用 useMemo 进行优化即可，类似 Vue 的 computed。

### v-model

Vue 中 v-model 是一个数据绑定语法糖，本质上还是单向数据流，下面的子组件通过 update:title 同步 title 参数。

```javascript
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```

React 写法较为简单，不需要像 Vue 一样填鸭代码，记住各种规则，所有数据和事件通过 props 传递就行了：

```tsx
import React from 'react';

interface Props {
  title: string;
  onUpdateTitle: (title: string) => void;
}

function MyComponent(props: Props) {
  return <input
    type='text'
    value={props.title}
    onInput={e => props.onUpdateTitle(e.target.value)}
  />
}
```

更加容易整合 typescript 实现类型推断，需要的逻辑都由 JS 完成，无需记住各种指令、使用方法，参数命名规则。

## 事件处理

Vue 中写法

```html
<template>
  <div id="inline-handler">
    <button @click="say('hi')">Say hi</button>
    <button @click="say('what')">Say what</button>
  </div>
</template>

<script>
module.exports = {
  methods: {
    say(message) {
      alert(message)
    }
  }
}
</script>
```

React 写法：

```tsx
import React, { useState } from 'react';

function Index() {
  const onClick = (message) => () => alert(message);

  return (
    <div id="inline-handler">
      <button onClick={onClick('hi')}>Say hi</button>
      <button onClick={onClick('what')}>Say what</button>
    </div>
  );
}

export default Index;
```

这里用了函数[柯里化](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)，一般事件处理这样就行了：

```tsx
import React from 'react';

function Index() {
  const onClick = () => alert('hi');

  return (
    <div id="inline-handler">
      <button onClick={onClick}>Say hi</button>
    </div>
  );
}

export default Index;
```

如果需要优化缓存事件处理函数，使用 useCallback 即可。可以看到 Vue 中的事件触发 `this.$emit('click')` 或者父组件中的代码 `v-on="say('hi')"` 都使用了字符串的写法，这样非常不利于类型推断，不利于代码重构。React 的函数写法或者 class 写法都直接使用 js 语法，没有而外的东西，相比 Vue 更容易通过 IDE 进行重构优化。React 中无论方法还是变量，都是采用驼峰命名法，也可以自由定制，Vue 中必须混合小写中隔线、驼峰、字符串组合，不利于统一代码规范。

## 插槽

Vue 中写法：

```html
<template>
  <button class="btn-primary">
    <slot></slot>
  </button>
</template>

<script>
module.exports = {
  methods: {}
}
</script>
```

React 写法：

```tsx
import React from 'react';

function Index() {
  return (
    <button classNames="btn-primary">
      {props.children}
    </button>
  );
}

export default Index;
```

React 的插槽写法没有 Vue 那么复杂，也没有“备用内容”、“具名插槽”、“渲染作用域”、“作用域插槽”、“动态插槽名”，这些概念和特殊情况的处理，一切通过 JS 逻辑搞定就行了，怎么方便怎么来，比如备用内容的实现：

```tsx
import React from 'react';

function Index() {
  // 默认情况下使用 Summit 作为按钮文字
  return (
    <button classNames="btn-primary">
      {props.children === null ? 'Summit' : props.children}
    </button>
  );
}

export default Index;
```

## 样式 & 属性

这部分 Vue 的写法实在是太麻烦了。。。每次我都要查查文档具体怎么用，对象语法、数组语法、内联样式，要记住的有点多，Vue 动态修改样式的写法：

```html
<template>
  <div
    class="static"
    :class="{ active: isActive, 'text-danger': hasError }"
  ></div>
</template>

<script>
module.exports = {
  data() {
    return {
      isActive: true,
      hasError: false
    }
  }
}
</script>
```

React 写法：

```tsx
import React, { useState } from 'react';

function Index() {
  const [isActive, setIsActive] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      classNames={`static ${isActive ? 'active':'} ${hasError? 'text-danger':''}`}
    ></div>
  );
}

export default Index;
```

React 里面直接采用 JS 的模板字符串语法，如果样式太多，可以使用 [classnames](https://github.com/JedWatson/classnames) 这个 npm 包，优雅传递各种状态，使用非常简单：

```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
```

## 状态管理

Vue 的状态管理官方推荐使用 Vuex 也可采用 Redux。

![](https://content.markdowner.net/pub/ayGdm8-E9W8vL0)

引用官方文档一段话：

> 如果你是来自 React 的开发者，可能会对 Vuex 和 Redux 间的差异表示关注，Redux 是 React 生态环境中最流行的 Flux 实现。Redux 事实上无法感知视图层，所以它能够轻松的通过一些简单绑定和 Vue 一起使用。Vuex 区别在于它是一个专门为 Vue 应用所设计。这使得它能够更好地和 Vue 进行整合，同时提供简洁的 API 和更好的开发体验。

这段话其实暴露了 Vuex 的一个缺陷，它和 Vue 强绑定，无法独立存在，这种一些项目升级和迁移时会有很大的麻烦。Redux 作为 React 的状态管理方案之一其实不依赖于 React。

React 周边的状态管理方案特别多，如 [Redux](https://redux.js.org/)、[Mobx](https://mobx.js.org/README.html)、[Recoil](https://recoiljs.org/) 等，各有各的亮点，其中使用最多的应该是 Redux。

![](https://content.markdowner.net/pub/N60Y8m-B496n8n)

Redux 周边生态也很丰富，可以更加下图选择不同的方案：

![](https://content.markdowner.net/pub/1Bj2wp-BqwjqgE)

-   [redux-thunk](https://github.com/reduxjs/redux-thunk)
-   [redux-promise](https://github.com/redux-utilities/redux-promise)
-   [redux-saga](https://github.com/redux-saga/redux-saga)
-   [redux-observable](https://redux-observable.js.org/)

由于这部分代码较多，不详细写，不过如果你熟悉 Vuex 的概念，转到 Redux 应该不难。Vuex + axios 的做法和 Redux + redux-thunk 的写法类似，不过现在 redux-saga 的方案被更多复杂项目采用，其中很重要的原因是 saga 的概念编写异步代码非常优雅，且能够很好地解决[竟态问题](https://efe.baidu.com/blog/defusing-race-conditions-when-using-promises/)（如果采用 Vuex + axios 的写法会异常复杂、冗长），高度定制。

如果你要迁移 Vue 到 React，建议采用的方案是 Redux + saga，saga 的概念不是那么容易懂，学习需要一些时间，但当你学会的时候就会明白这种写法比直接用 Promise 好太多了。

## 生命周期

Vue 的生命周期这里不再重复，查询官方文档即可，React 生命周期如图：

![](https://content.markdowner.net/pub/wY5qBd-VX04gM0)

图片可以在[这里](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)找到。一般情况下 class 写法主要用到 componentDidMount 和 componentWillUnmount 钩子，React 的函数写法下可以用 useEffect 的执行函数和清理函数去模拟 mount 和 unmount 过程：

```tsx
import React, { useRef, useEffect } from 'react';

function Index() {
  const ref = useRef(null);
  
  useEffect(() => {
    console.log('mounted');

    return () => {
      console.log('will unmount');
    };
  }, []);

  return <input ref={ref}/>
}

export default Index;
```

useEffect 的原理这里不多说，可以看看相关文章：[轻松学会 React 钩子：以 useEffect() 为例](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)。其实从 React hook 中可以看到，React 在慢慢淡化生命周期的概念，减少自己对用户代码的侵入，将更多控制权交给用户。

## 原生 DOM 操作

这部分 Vue 和 React 都是采用 ref 写法，Vue：

```html
<template>
  <input ref="input" />
</template>

<script>
module.exports = {
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
}
</script>
```

React 写法：

```tsx
import React, { useRef, useEffect } from 'react';

function Index() {
  const ref = useRef(null);
  
  useEffect(() => {
    ref.current?.focuse();
  }, []);

  return <input ref={ref}/>
}

export default Index;
```

useEffect 是 [React hook](https://reactjs.org/docs/hooks-intro.html)，在依赖数组为空的时候效果类似 componentDidMount 的生命周期函数（类似 Vue 的 mounted）。此外 useRef 不止用在这里，也可以挂载一些其他的东东，实现一些复杂操作，比如 previousValue 和对象属性等。

## 路由

大部分项目都是采用 [react-router](https://reactrouter.com/) 这个路由方案，定制能力强、API 丰富。

## 插件和工具

浏览器安装 [React Develop tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=zh-CN&from=hw798&lid=407) 和 [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=zh-CN&from=hw798&lid=407) 两个插件即可。

