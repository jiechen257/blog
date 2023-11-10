---
title: Go处理错误优雅化
categories: golang
tag: error
date: 2023-11-05
---
这篇文章没有叫「最佳实践」，因为我也在摸索阶段，目前只是总结一下个人认为比较好的技巧，不敢说其普适性如何。如果看官 dalao 发现了缺陷或者更好地方案，欢迎评论提出。

> 当前 Go 版本 1.17.5

## Go 的错误处理设计

关于 Go 的错误处理，一直争议不断。其实 Go 本身的争议也不少 😂。这里不进行评价，只是简单地和主流语言对比，总结一下 Go 的特征。

作为一个历史悠久的语言，C 的错误处理非常混乱。典型情况下，C 通过返回值表示执行是否成功，至于失败的具体原因，通过额外的全局变量传递。这种设计的致命缺陷是错误与返回结果混淆在一起，例如函数 `int atoi(const char *str)` ，如果转换出错应该返回什么呢？0？-1？其实都不合理，因为任何数字都有可能代表一个正常的结果。

为此，部分开发者选择利用指针传递结果，而返回值仅表示是否出错。这确实解决了上述问题，但又导致了「参数」语义的混淆。没有经验的同学看到什么入参出参搞的一脸懵比。

而近现代语言通常采用 `try-catch` 的思想。例如 java 与 python。这种模型既分离的错误与返回值和参数，也提供了结构化处理的可能。通过面相对象的思想，开发者可以自定义错误类、子类，它们又可以包装其他错误，确保错误上下文不会丢失。

---

Go 则与众不同。它利用多返回值的特性做到了错误的分离，因此，很多 Go 的函数最后一个返回值都是一个 `error` 来标识是否出错。相比于 C 这是一个进步，但没有提供灵活的捕获机制，这就仁者见仁智者见智了。

**我个人的观点是：不应该试图在 A 语言中复刻 B 语言的功能，而是根据语言自身的特点，在宏观理念的指导下，实现针对性的错误处理方案。** 后文将以这个观点为继续进行探索。

## 基本理念

虽然语法不同，但是一些语言无关的思想还是很重要的，我们应该尽量遵循。

首先，一个错误信息，至少要具有两个作用：

1. 给程序看。可以根据错误类型进入处理分支。
2. 给人看。告诉我们到底发生了什么。

### 不要重复处理错误

私以为这是很容易踩的一个坑，考虑下面的代码：

```go
func foo() (Result, error) {
 result, err := repository.Find(id)
 if err != nil {
   log.Errof(err)
   return Result{}, err
 }
  return result, nil
}
```

这里打印了错误（相当于处理），然后返回它。可以想象，`foo()` 的调用方会再次打印，再返回。最终一个错误会打印出一大堆东西。

### 错误要包含调用栈

调用栈是 debug 的基本需要。如果仅仅是一层层返回 error，那么最顶层的函数将收到最底层的错误。试想你用 Go 写了一个 web 后端，在处理一个支付请求时出现了 io 错误。这对 debug 毫无帮助——无法定位哪个环节出错。

另一个不好的方案是，每一层只返回自己的错误，例如：
```go
func pay(){
  if err := checkOrder(); err!=nil {
    return errors.New("支付异常")
  }
  return nil
}

func checkOrder() error {
  if err := calcMoney(); err!=nil {
    return errors.New("计算金额异常")
  }
  return nil
}

func calcMoney() error {
  if err := querySql(); err!=nil {
    return errors.New("查询数据库异常")
  }
  return nil
}
```
这种情况和上一种相反：顶层函数只能得到最近的错误，对引发的原因一无所知，显然这不是我们希望的。

### 错误要是结构化的

有聪明的同学改造了一下代码来解决丢失调用栈的问题：
```go
func checkOrder() error {
  if err := calcMoney(); err!=nil {
    return fmt.Errorf("计算金额异常：%s", err)
  }
  return nil
}
```
确实，修改后顶层函数得到的异常如下：

> 支付异常：计算金额异常：查询数据库异常

现在基本上可以看出调用栈了，**但仅限于人类**。这个错误是否属于数据库异常？计算机无从得知。~~我们可以通过自然语言处理来解决~~，除非你疯了。

所以需要结构化错误——错误有包含关系，子错误是父错误的一种，顶层函数可以轻松判断异常类型。

### 错误要有上下文

这一点很好理解了，我们希望错误日志包含一些相关的数据，比如用户 id，订单 id 等。

值得注意的是，这个原则要和「不重复处理」结合，否则将会得到这样的天书 log：

> 支付异常 uid=123, orderId=456, reqId=328952104：计算金额异常 uid=123, orderId=456, reqId=328952104：查询数据库异常 uid=123, orderId=456, reqId=328952104

## 实践

### 错误链

曾经，在 Go 中做到保留调用栈和结构化是很麻烦的，为此 [errors](https://github.com/pkg/errors) 开源库被广泛使用。不过 Go 1.13 一定程度上增强了错误处理，Go 2 也计划进一步改善。因此这个库已进入维护状态。

现在，调用栈不再需要我们自己构造，通过 `fmt.Errorf("... %w", ..., err)` 就可以包装一个错误，层层套娃形成错误链。相应的，通过 `errors.Is()` 或 `errors.As()` 可以判断一个错误（链）是否是（包含）另一个错误，前者要求严格相等，后者只需类型一致。不知不觉中，「结构化」也基本上实现了。

等等！为什么说「基本」？虽然标准库提供了判断错误类型的方法，但是错误类型是啥？相比 java 中抛出一个具体异常，Go 中基本上只会返回底层错误接口 `error`，而没有具体结构体，那怎么判断呀？难道又要回到 `err.msg` 的时代？当然不是，包装一个错误，除了使用 `fmt` 之外，还可以自己定义一个结构体。实际上，`fmt.Errorf()` 返回的是 `wrapError`，相当于是便捷函数，用于无需明确错误类型的场景。

### 自定义结构体

自定义错误结构体不仅帮助识别错误类型，还顺便解决了下上下文问题。通过简单的 string 自然是 OK 的，不过为了让上下文本身也可以被程序识别，更好的办法是作为结构体的一个字段：
```go
type orderError struct {
  orderId int
  msg string
  err error
}

func (e *orderError) Error() string {
    return e.msg
}

func (e *orderError) Unwrap() error {
    return e.err
}
```

这个结构体不仅实现了 error 接口，还额外拥有 `Unwrap()` 方法，这样就可以包装其他异常，确保不丢失调用栈。

那么就可以这么来返回：
```go
func checkOrder() error {
  if err := calcMoney(); err!=nil {
    return return orderError{123, "计算金额异常", err}
  }
  return nil
}
```
### 公开 OR 私有

有了自己的结构体，随之而来的就是它需要公开吗？这个问题标准库已经给出了答案：一般不需要。所以我们见到的大多数函数，只返回 `error` 而不是 `xxxError`。根据网上的资料，这么做旨在隐藏实现细节，提高 lib 的灵活性，减少升级时需要考虑的兼容问题。

不公开结构体，也就是意味着外部无法通过 `errors.As()` 判断了，为此，需要公开一个函数帮助外部确认这是否是属于本 lib 的错误。
```go
func IsOrderError(err error) bool {
  return errors.As(err, orderError)
}
```
## Error Check Hell

上面已经总结了返回错误的结构，符合一开始提出的基本理念。在实际代码中，错误检查可能会充斥着项目，甚至每一个调用都裹着一个 `if` 来及时打断并返回——因为 Go 没有 throw 或 raise 机制。看下面这个恶心的例子：
```go
func checkPersion(*p Persion) error {
  if err := checkAttr(p.name); err != nil{
    return err
  }
  if err := checkAttr(p.age); err != nil{
    return err
  }
  if err := checkAttr(p.country); err != nil{
    return err
  }
  if err := checkAttr(p.work); err != nil{
    return err
  }
  return nil
}
```

### 抽取匿名函数

> 此方法适用于连续调用同一个函数。

把错误检查抽取到匿名函数中，若已经存在错误，那么不真正执行，直接返回。
```go
func checkPersion(*p Persion) error {
  var err error
  check := func(attr interface{}){
    if err != nil{
      return
    }
    err = checkAttr(attr)
  }

  check(p.name)
  check(p.age)
  check(p.country)
  check(p.work)
  // more check
  return err
}
```

### 利用 panic

> ⚠️ 使用 panic 来代替 error 是错误的习惯。不要滥用此技巧。

```go
// checkAttr() 不再返回 error 而是直接 panic
func checkAttr(attr interface{}) {
  if attr == nil{
    panic(checkErr{...})
  }
}

func checkPersion(*p Persion) (err error) {
  defer func() {
    if r := recover(); r != nil {
      // 恢复 checkAttr() 的 panic 转为 error
      err = r.(checkErr)
    }
  }()

  // do any thing
}

```

用 panic 简化 check 的关键在于 recover 时只处理已知的错误，对于未知情况应该继续传递 panic。因为 panic 原则上仅用于不可恢复的严重错误（例如数组越界），如果不分情况一律 recover 则可能会掩盖 bug 引发未知的后果。

有的网站给出下面这种写法，非常不推荐，除非你知道自己在干嘛：
```go
func checkPersion(*p Persion) (err error) {
  defer func() {
    if r := recover(); r != nil {
      var ok bool
      // 这里对于未知错误也一并捕获了
      err, ok = r.(error)
      if !ok {
        err = fmt.Errorf("failed to check persion: %v", r)
      }
    }
  }()
  // do any thing
}
```

尽管很多网站都宣传不要滥用 panic，但我认为，如果像第一个例子那样，确保自己只捕获已知的异常来简化 error check，应该不算做滥用——此时 panic 不会对包外部的调用者造成任何影响——原来会 panic 的现在依然会 panic，原来会返回 error 的现在依然只返回 error。Go 的官方文档 [effective go](https://go.dev/doc/effective_go) 也承认了这种用法：

> With our recovery pattern in place, the `do` function (and anything it calls) can get out of any bad situation cleanly by calling `panic`. We can use that idea to simplify error handling in complex software.

有了 recovery 模式，我们就可以随时通过调用 panic 简单地摆脱异常情况，可以使用该思想来简化复杂软件中的错误处理。