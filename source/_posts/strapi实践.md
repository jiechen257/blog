---
categories: new-power
date: 2023-03-23 11:53:4
tags: strapi
---

## 背景
因为需要一个上传图片的接口，自己又不想为了一个接口专门去开一个后端项目来写，之前有接触过strapi，一直没去深入了解，趁这个机会就学学 strapi

> strapi 是什么？
> 一句话总结：一个可以简单、快速、自动生成安全可靠后端 api 的框架，前端开发一大利器

## 概述
官网：[strapi](https://strapi.io/) ，这个名字取自 bootstrap 的后缀 strap，然后因为它是一个提供快速生成安全可靠的 api 架构，然后再加了一个 i，合并就是 strapi，bootstrap 的有启动的意

### 使用
可以先跟着这篇博客简单做个 demo
——[新手入坑：strapi官网教程的简单示例学习](https://blog.csdn.net/qq_36812165/article/details/115533628#:~:text=%E4%BB%8B%E7%BB%8D%20Strapi%20%E6%98%AF%E4%B8%80%E7%A7%8D%E7%81%B5%E6%B4%BB%E7%9A%84%E3%80%81%E5%BC%80%E6%94%BE%E6%BA%90%E7%A0%81%E7%9A%84%E6%97%A0%E5%A4%B4%20CMS%20%EF%BC%8C%E5%BC%80%E5%8F%91%E8%80%85%E5%8F%AF%E4%BB%A5%E8%87%AA%E7%94%B1%E9%80%89%E6%8B%A9%E8%87%AA%E5%B7%B1%E5%96%9C%E6%AC%A2%E7%9A%84%E5%B7%A5%E5%85%B7%E5%92%8C%E6%A1%86%E6%9E%B6%EF%BC%8C%E7%BC%96%E8%BE%91%E5%99%A8%E4%B9%9F%E5%8F%AF%E4%BB%A5%E8%BD%BB%E6%9D%BE%E5%9C%B0%E7%AE%A1%E7%90%86%E5%92%8C%E5%88%86%E5%8F%91%E5%86%85%E5%AE%B9%E3%80%82,%E9%80%9A%E8%BF%87%E4%BD%BF%E7%AE%A1%E7%90%86%E9%9D%A2%E6%9D%BF%E5%92%8C%20API%20%E5%8F%AF%E6%89%A9%E5%B1%95%E9%80%9A%E8%BF%87%E6%8F%92%E4%BB%B6%E7%B3%BB%E7%BB%9F%EF%BC%8C%20Strapi%20%E4%BD%BF%E4%B8%96%E7%95%8C%E4%B8%8A%E6%9C%80%E5%A4%A7%E7%9A%84%E5%85%AC%E5%8F%B8%E5%8A%A0%E9%80%9F%E5%86%85%E5%AE%B9%E4%BA%A4%E4%BB%98%EF%BC%8C%E5%90%8C%E6%97%B6%E5%BB%BA%E7%AB%8B%E7%BE%8E%E4%B8%BD%E7%9A%84%E6%95%B0%E5%AD%97%E4%BD%93%E9%AA%8C%E3%80%82)

## 具体api

### 数据库配置
strapi在默认下是安装了[sqlite](https://so.csdn.net/so/search?q=sqlite&spm=1001.2101.3001.7020)数据库，并且默认把数据放在.tmp/data.db中，并且被gitignore了

官方配置文档：[Strapi Developer Docs](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html)

数据库的配置在`config/database.js`中，这里贴出mysql的配置文件
——需要在数据库中先创建数据库
——需要 mysql 的npm包，`npm i mysql --save`

```js
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: '数据库ip地址',
        port:  3306,
        database: 'test',
        username: '用户名',
        password: '密码',
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
```

重启服务后就会发现数据库中多了几张表
![](http://cdn.becase.top/20220520145135.png)

同时原先的数据也会消失，因为数据的引用关系已经从 sqlite的db文件转为本地数据库
![](http://cdn.becase.top/20220520145257.png)


### http请求说明

![](http://cdn.becase.top/20220520145400.png)

关于通过ajax post/put relation数据的，根据设置一对多/一对一，字段的类型为number[]/number，填入对应数据的id即可

### 路由配置

![](http://cdn.becase.top/20220520145619.png)
1. method 就是请求的方法
2. path 请求的路径
3. handler 请求用到的方法，在这里为relation.find，表示会用到在relation文件夹下的`controllers/{表名}.js`中的find函数。但默认下find函数已经在系统中存在了，所以`controllers/{表名}.js`中没有find函数


## 上传图片
兜兜转转找了很久才发现，并不能直接通过 strapi 的一般方式上传图片，这里的一般方式指的是 （创建实体表——开放权限——发布——接口请求）

原因——strapi 不支持设置请求头（Content-type）为 `multipart/form-data` 后发起 `POST` 请求上传图片
![](http://cdn.becase.top/20220520150924.png)


可以看看这个 Issues ：[POST multipart/form-data on generated API for file upload · Issue #1316 · strapi/strapi · GitHub](https://github.com/strapi/strapi/issues/1316#)

解决办法：直接使用 strapi 的插件 `upload模块`

### upload模块位置
![](http://cdn.becase.top/20220520150327.png)

![](http://cdn.becase.top/20220520150340.png)

### 配置请求头和body参数
![](http://cdn.becase.top/20220520150805.png)

![](http://cdn.becase.top/20220520150811.png)

### 成功获取到返回数据
![](http://cdn.becase.top/20220520150843.png)

项目会在 `public/uploads` 目录下转存图片，其实你通过 `http://[ip]:[port]/upload`  访问的图片就是这里的图片，项目本身只是提供了一层映射关系


## 参考
[POST multipart/form-data on generated API for file upload · Issue #1316 · strapi/strapi · GitHub](https://github.com/strapi/strapi/issues/1316#)

[strapi入门](https://blog.csdn.net/qq_41535611/article/details/107912549)

[Strapi Developer Docs](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html#open-source-contribution)

[strapi的使用](https://blog.csdn.net/m0_37820751/article/details/112800805)

