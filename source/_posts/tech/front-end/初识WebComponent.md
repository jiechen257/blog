---
title: 初识WebComponent
categories: front-end
tags: WebComponent
abbrlink: 43136
date: 2023-02-16 21:47:50
---

## 背景
> **组件化** 已经成为目前主流的前端开发模式，其可复用性这一大特点是一众复制粘贴工程师的福音。目前我们实现组件化主要是依托于各大框架如 **Vue** ， **React** ， **Angular** 。这些框架基本都是在遵从浏览器的规则下制定出自己的一套开发规则和书写语法使开发者的项目获得组件化的能力

随着近年来组件化框架的盛行，官方也推行了一套组件化的解决方案和原生API上的支持 —— **Web Component** 。
## Web Component 是什么
**Web Components** 是一系列加入 **w3c** 的 **HTML** 和 **DOM** 的特性，使得开发者可以创建可复用的组件

> 由于 **web components** 是由 **w3c** 组织去推动的，因此它很有可能在不久的将来成为浏览器的一个标配。

关键字：**原生、定制化标签**

使用 **Web Component** 编写的组件是脱离框架的，换言之，也就是说使用 **Web Component** 开发的组件库，是适配所有框架的，不会像 **Antd** 这样需要对 **Vue** 、 **React** 等框架出不同的版本
## 使用 Web Component

### Web Component 核心技术

- **Custom elements（自定义元素）**：一组 **JavaScript API**，允许您定义 **custom elements** 及其行为，然后可以在您的用户界面中按照需要使用它们
- **Shadow DOM（影子DOM）**：一组 **JavaScript API**，用于将封装的 **"影子" DOM 树** 附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突
- **HTML templates（HTML模板）**： **< template >** 和 **< slot >** 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用 
- **HTML Imports（HTML导入）**：一旦定义了 **自定义组件**，最简单的重用它的方法就是使其定义细节保存在一个单独的文件中，然后使用导入机制将其导入到想要实际使用它的页面中。 **HTML** 导入就是这样一种机制，尽管存在争议 — **Mozilla** 根本不同意这种方法，并打算在将来实现更合适的

### 实现一个简单的组件
1.  定义自定组件:
    ```scala
class MyButton extends HTMLElement {
	constructor () {
		super();
		const template = document.getElementById('mybutton');
		const content = template.content.cloneNode(true);
		this.appendChild(content);
	}
}
    ```
（神似 react）
    
2.  定义组件模板:
    ```xml
<template id="mybutton">
	<button>Add</button>
</template>
    ```
    
3.  注册组件:
    ```javascript
window.customElements.define('my-button', MyButton);
    ```
    
4.  使用组件:
    ```css
<body>
	<my-button></my-button>
</body>
    ```

这样， 一个简单的 **Web Component** 就完成了。

### 生命周期
和一般框架中的组件一样，**Web Component** 的组件为了支持更多场景的应用也是有生命周期的。

常用的生命周期方法如下:
-   **connectedCallback**
    当 **web component** 被添加到 **DOM** 时，会调用这个回调函数，这个函数只会被执行一次。可以在这个回调函数中完成一些初始化操作，比如更加参数设置组件的样式。
-   **disconnectedCallback**
    当 **web component** 从文档 **DOM** 中删除时执行。
-   **adoptedCallback**
    当 **web component** 被移动到新文档时执行。
-   **attributeChangedCallback**
    被监听的属性发生变化时执行

## 与React的结合
就像刚刚所使用的，看起来 WebComponent 和 React 很想，但实际上二者是互补的关系

React中使用的API都是声明式的，react封装了对DOM的操作并做了一定的优化； 而WebComponent中则是命令式的，它的方法都是基于原生DOM进行操作的（要不然咋说它是原生组件技术，doge）

react官方也有说明，详情参考：[Web Components – React](https://react.docschina.org/docs/web-components.html)
### 在 Web Component 中使用 React
```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

### 在 React 中使用 Web Component
```scala
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> **Web Components** 的组件 **video** 可能会公开 **play()** 和 **pause()** 方法。要访问 **Web Components** 的命令式 **API**，你需要使用 **ref** 直接与 **DOM** 节点进行交互
如果你使用的是第三方 **Web Components**，那么最好的解决方案是编写 **React** 组件包装该 **Web Components**。

**Web Components** 触发的事件可能无法通过 **React** 渲染树正确的传递。 你需要在 **React** 组件中手动添加事件处理器来处理这些事件。

## demo演示
![https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63928cab8ae54cb5be882ec5eb1dc757~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/63928cab8ae54cb5be882ec5eb1dc757~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

如果我们想要实现原生组件复用，就需要把代码写在一个js文件里面，引入该js文件，就等于引入了组件。

```html
//index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
    //引入编写好的组件，在这里引入文件，注意要添加defer关键字
  <script src="./MyList/index.js" defer></script>
  <body>
    <div>
        //使用组件
      <my-list id="node">
          <!--原生支持插槽  -->
        <slot>web component</slot>
      </my-list>
    </div>
    <script>
        //因为是原生，所以我们需要获取dom节点行后续操作
      const node = document.getElementById("node");
        //我们将变量转换一下格式，就能传递给子组件
      node.dataset.arr = JSON.stringify(["吃饭", "睡觉"]);
    </script>
  </body>
</html>
```

```javascript
//index.js
const template = document.createElement("template");
//在js文件中，我们想要书写html和css就必须要借助innerHTML，在其内部书写我们的样式和结构
template.innerHTML = `
  <style>
    #contain {
      display: flex;
      flex-direction: column
    }
    input {
      width: 200px
    }
  </style>
  <div id="contain">
    <span><slot></slot></span>
    <div>
     <input type="text" id=input>
     <button id="mybutton" data-text1="111111">添加</button>
    </div>
  </div>
`;
class MyList extends HTMLElement {
  constructor() {
    //因为我们的组件继承于HTMLElement，所以需要调用super关键字  
    super();
    // 获取标签
    const content = template.content.cloneNode(true);
    const mybutton = content.getElementById("mybutton");
    const input = content.getElementById("input");
    const contain = content.getElementById("contain");

    // 获取props
    const arr = JSON.parse(this.dataset.arr);
   //进行事件的监听
    mybutton.addEventListener("click", () => {
      arr.push(input.value)
      const li = document.createElement("li");
      li.innerText = input.value;
      contain.appendChild(li);
    });
    // 将数据渲染到页面
    arr.forEach((item) => {
      const li = document.createElement("li");
      li.innerText = item;
      contain.appendChild(li);
    });
     //初始化一个影子dom
    this.attachShadow({ mode: "closed" }).appendChild(content);
  }
}
// 注册组件
window.customElements.define("my-list", MyList);
```

## 相应框架
从上面的案例看的出来这种原生dom操作的开发效率还是太低，这里再推荐一个WebComponent的封装框架：[Stencil](https://stenciljs.com/)

> 有人就疑惑了，WebComponent不是强调不依赖vue、react等框架吗？

是的，它是不依赖vue、react等框架，但并不表示他不能像js拥有jQuery一样，拥有自己的封装库。
封装出来的`语法题`和强依赖的`运行环境`，二者的关系需要弄清楚

### 框架使用示例
```js
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',            // the name of the component's custom HTML tag
  styleUrl: 'my-component.css',   // css styles to apply to the component
  shadow: true,                   // this component uses the ShadowDOM
})
export class MyComponent {
  // The component accepts two arguments:
  @Prop() first: string;
  @Prop() last: string;

   //The following HTML is rendered when our component is used
  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.last}
      </div>
    );
  }
}
```

使用
```html
<my-component first="Stencil" last="JS"></my-component>
```

## 参考
[Web Component | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

[Web Component入门](https://juejin.cn/post/7174289059521495071)

[Stencil](https://stenciljs.com/)
