---
title: TS类型体操刷题tips
categories: [tech, front-end]
tags: [front-end, engineering]
abbrlink: 65455
date: 2022-08-27 14:14:33
---

~~类型的运算结果都可以用接口来表示~~ —— type 声明才是万能的

## 重载的简写

```ts
const is: {
    (name: string, state: boolean | undefined): string
    (name: string): string
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0]! : true
    return name && state ? `${statePrefix}${name}` : ''
  }
  
const B: {
    (name: string, state: boolean): string
    (name: string): string
} = (name: string, ...args: [boolean] | []) => {
    console.log(name, ...args)
    return "ss"
}

B("cdjk", false)
B("dfs")
```

## 泛型中 extends 的约束
```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P] 
};
```

需要注意的是 K 是一个 union，keyof T 也将 T 中的属性转换为一个 union。当我们使用 extends 来进行条件约束的时候，TS 会使用 union ` 分发 ` 的特性自动遍历 union K 中的属性与 keyof T 中的属性进行比较。

假设 K 为 'title' | 'completed' | 'invalid' ，T 为 'title' | 'completed' | 'description'。它的过程如下

```ts
step1:  'title' extends 'title' | 'completed' | 'description' //通过
step2:  'completed' extends 'title' | 'completed' | 'description' //通过
step3:  'invalid' extends 'title' | 'completed' | 'description' //未通过，报错
```

如果比较成功则通过，失败则报错，这样我们就实现了所有的关键步骤，通过了所有的测试用例。

## keyof any
> Record<K, V>

```ts
type MyRecord<K  extends keyof any, V> = {
  [key in K]: V
}
```
注意对象的键值只能是 `number | string | symbol` ,所以 K 需要被约束

同时，可以使用 `keyof any` 来代替 `number | string | symbol` ，它返回对象键值类型的所有可能

## 接口或者枚举类型中的 never
> Omit<T, K>

使用 `as never` 来使一个元素消失。

在 TS 中如果一个 union 中的元素是一个 never 类型的，那么 TS 认为这个元素是一个空值，会返回去除这个值之后的结果。

## infer 的使用
> Parameters< T >

在这个条件语句 `T extends (...args: infer P) => any ? P : T` 中，`infer P` 表示待推断的函数参数。

整句含义为：如果 `T` 能赋值给 `(...args: infer P) => any`，则结果是 `(...args: infer P) => any` 类型中的参数 `P`，否则返回为 `T`

infer 的作用：在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用

```typescript
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

## 类中构造器的类型声明方式
> ConstructorParameters< T >

`c:{ new(): T }` 和 `c: new () => T` 是一样的，后者是前者的简写，意即 C 的类型是对象类型且这个对象包含返回类型是 T(类的实例) 的构造函数

```js
// es6, T === new People()
class People: new () => T {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}

// es5
var People = /*#__PURE__*/_createClass(function People(name, age) {
  _classCallCheck(this, People);
  _defineProperty(this, "name", void 0);
  _defineProperty(this, "age", void 0);
  this.name = name;
  this.age = age;
});
```

## 字符串字面量和递归
看到递归的时候，才真正意识到 ts 也是一门编程语言，而不是什么类型的银弹（silver bullet）
```ts
type LastChar<T extends string> =
 T extends `${infer F}${infer R}` ?
  (R extends '' ? F : LastChar<R>) : never;
```

## 元祖类型的属性 length
> LengthOfTuple< T >

```typescript
type LengthOfTuple<T extends any[]> = T['length']
```

## 关于 T extends `${infer L}.${infer R}`
如果 T extends 字面量，则 R 表示剩余参数
如果 T extends 元祖，则 R 表示第二个参数

## 关于 Record<string, unknown>
> implement IsEmptyType< T >

`Record<string, unknown>` 表示任意对象类型
```ts
// 首先判断是不是对象类型
// 其次判断对象的键为空
type IsEmptyType<T> =
  T extends Record<string, unknown> ?
    [keyof T] extends [never] ?
      true : false
    : false;
```

## any类型如何表示
> implement IsAny< T >

```ts
// 想写出这道题必须了解：any 类型在和其他类型进行联合、交叉时等于 any 类型自身
type WhatEverType = true;
type AnotherWhatEverType = [];
type A = WhatEverType & any; // any
type B = WhatEverType | any; // any
type T = WhatEverType extends AnotherWhatEverType & any ? true : false; // true
type Q = WhatEverType extends AnotherWhatEverType | any ? true : false; // true

type IsAny<T> = WhatEverType extends (AnotherWhatEverType & T) ? true : false;

// 举例
type IsAny<T> = 0 extends 1 & T ? true : false;
```

