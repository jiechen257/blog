---
title: SSL建立的三个随机数作用
tags: ssl
categories: cs-basics
abbrlink: 25789
date: 2022-05-27 22:01:01
---
## 概述
首先再重温下 `TLS四次握手` 的过程：
1. 客户端向服务端发送协议版本号、一个随机数和可以使用的加密方法
2. 服务端接受后，确认加密的方法，向客户端发送一个随机数和自己数字证书
3. 客户端首先检查数字证书是否有效，如果有效，就再生成一个随机数，用数字证书提供的公钥加密再发给服务端，同时提供一个前面所有内容的hash值发给服务端以供校验
4. 服务端接收后，使用自己的私钥对数据解密，同时也发一个前面所有内容的hash值供客户端校验

双方再有了三个随机数之后，按照之前约定的加密方法，使用三个随机数生成一个密钥，之后双方通信，就是用这个密钥对数据加密后再传输

其中有用到三个随机数，用来做什么，为什么是三个？

## 分析
具体过程，图示如下（1-9）：
![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312051854392.png)

其中建立 SSL 的三个随机数分别是：
- ClientHello 中存在的一个随机数，令为 A
- ServerHello 中存在的一个随机数，令为 B
- ClientKeyExchange中的随机密码串

## 随机数的作用

先看第三个随机数，这是一个被称为 `Pre-master secret` 的随机密码串，由加密算法提供

当客户端生成了 `Pre-master secret` 后，结合原来的 A 和 B 使用算法算出一个 `master secret` ，根据这个推到出 `hash secret`和`session secret`，这两个结果完全是依据三个随机数推到出来的，只有双方知道

通信：
- 双方使用对称加密算法进行加密，用hash secret对HTTP报文做一次运算生成一个MAC，附在HTTP报文的后面，然后用session-secret加密所有数据（HTTP+MAC），然后发送。
- 接收方则先用session-secret解密数据，然后得到HTTP+MAC，再用相同的算法计算出自己的MAC，如果两个MAC相等，证明数据没有被篡改

> MAC(Message Authentication Code)称为报文摘要，能够查知报文是否遭到篡改，从而保护报文的完整性

## 为什么是三个

SSL协议默认不信任 `每个主机都能产生完全随机的随机数`， 如果随机数不随机，那么 `pre-master secret` 就可能被破解（因为密钥交换算法是公开的算法），所以必须引入新的随机因素，那么客户端和服务器加上pre-master secret三个随机数一同生成的密钥就不容易被猜出了，一个伪随机可能完全不随机，可是是三个伪随机就十分接近随机了，每增加一个自由度，随机性增加的可不是一

## 参考
[HTTPS通信的过程的三个随机数的作用](https://blog.csdn.net/qq_31442743/article/details/116199453)

[为什么是三个随机数](https://www.csdn.net/tags/MtTaEg2sMjM0NjA5LWJsb2cO0O0O.html)

[ SSL_ 随机数_的作用](https://cloud.tencent.com/developer/article/1415674)

