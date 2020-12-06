---
title: Promise
categories: 前端学习
tags: javascript
---
# Promise

## 一、Promise 出现的原因

我们用jQuery的Ajax获取数据时都是以**回调函数**方式获取的数据。

```javascript
请求1(function(请求结果1){
    处理请求结果1
})
```

但如果，当我们需要发送**多个异步请求**并且每个请求之间需要**互相依赖**，那我们只能以嵌套方式来解决,

```javascript
请求1(function(请求结果1){
    请求2(function(请求结果2){
        请求3(function(请求结果3){
            请求4(function(请求结果4){
                ...
            })
        })
    })
})
```

这样一来，在处理越多的异步逻辑是，就需要越深的回调嵌套，这便是臭名昭著的“**回调地狱**”，这种编码方式存在着一些问题：

* 代码书写顺序和执行顺序不一致，不利于阅读和维护
* 代码的复用性差，代码臃肿
* 回调函数基本上是匿名函数，bug追踪困难

为了解决这个问题，`Promise`规范出现了。

```JavaScript
new Promise(请求1)
	.then(请求2(请求结果1))
	.then(请求3(请求结果2))
	.then(请求4(请求结果3))
	.catch(处理异常(异常信息))
```



## 二、Promise的定义和使用

### 1. `Pomise`的定义

Promise 是**异步编程**的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点：

1. **对象的状态不受外界影响**。Promise对象代表一个异步操作，有三种状态：`pending`(进行中)、`fulfilled`(已成功)和`rejeted`(已失败)。只有异步操作的结果，可以决定当前是那种状态，任何其他操作都无法改变这个状态。
2. **一旦状态改变，就不会再变，任何时候都可以得到这个结果**。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为resolved(已定型)。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

为了方便，后文的`resolved`统一只指`fulfilled`状态，不包含`rejected`状态。

有了`Promise`对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise`对象提供统一的接口，使得控制异步操作更加容易。

`Promise`也有一些缺点。首先，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。第三，当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 2. Promise对象的使用

Promise 对象是一个构造函数，`new Promise` 会返回一个 promise对象，并且`new Promise()`可以接收一个`excutor`执行函数作为参数, `excutor`有两个**函数类型**形参`resolve`和`reject`。

**Promise既是一个对象，也是一个函数。**

下面代码创造了一个Promise实例

```javascript
const promise = new Promise(function(resolve, reject){
    //some code..
    if(/*异步操作成功*/){
       resolve(value);
	} else{
    	reject(error);
     }
});
```

`resolve`函数的作用是，将`Promise`对象的状态从 pending 变为 resolved，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；`reject`函数的作用是，将`Promise`对象的状态从 pending 变为 rejected，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

#### promise对象方法

1. `then`方法

   then方法接收两个回调函数作为参数，第一个回调函数是Promise对象变为`resolved`时调用，第二个回调函数是`Promise`对象的状态变为`rejected`时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受`Promise`对象传出的值作为参数。

   ```javascript
   promise.then(function(success){
       //异步操作成功在这里执行
       //对应于上面所说的resolve()方法
   }, function(error){
       //异步操作失败在这里执行
       //对应于上面所说的reject()方法
   })
   //也可以这样写
   promise.then(function(success){
       //异步操作成功在这里执行
       //对应于上面所说的resolve()方法
   }).catch(function(error){
       //异步操作失败在这里执行
       //对应于上面所说的reject()方法
   });
   ```

2. `catch`方法

   ```JavaScript
   //上面的例子也可以这样写
   promise.then(function(success){
       //异步操作成功在这里执行
       //对应于上面所说的resolve()方法
   }).catch(function(error){
       //异步操作失败在这里执行
       //对应于上面所说的reject()方法
   });
   ```

3. `Promise.all` 接收一个promise对象数组作为参数

   只有全部为resolve才会调用 通常会用来处理 多个并行异步操作

   ```javascript
   const p1 = new Promise((resolve, reject) => {
       resolve(1);
   });
   const p2 = new Promise((resolve, reject) => {
       resolve(2);
   });
   const p3 = new Promise((resolve, reject) => {
       resolve(3);
   });
   Promise.all([p1, p2, p3]).then(data => { 
       console.log(data); // [1, 2, 3] 结果顺序和promise实例数组顺序是一致的
   }, err => {
       console.log(err);
   });
   ```

4. `Promise.race` 接收一个promise对象数组为参数

   `Promise.race` 只要有一个promise对象进入 `FulFilled` 或者 Rejected 状态的话，就会继续进行后面的处理。

   ```javascript
   function timerPromisefy(delay) {
       return new Promise(function (resolve, reject) {
           setTimeout(function () {
               resolve(delay);
           }, delay);
       });
   }
   var startDate = Date.now();
   
   Promise.race([
       timerPromisefy(10),
       timerPromisefy(20),
       timerPromisefy(30)
   ]).then(function (values) {
       console.log(values); // 10
   });
   ```

5. `Promise.resolve` 返回一个fulfilled状态的promise对象

   ```
   Promise.resolve('hello').then(function(value){
       console.log(value);
   });
   
   Promise.resolve('hello');
   // 相当于
   const promise = new Promise(resolve => {
      resolve('hello');
   });
   ```

6. `Promise.reject` 返回一个rejected状态的promise对象

   ```
   Promise.reject(24);
   new Promise((resolve, reject) => {
      reject(24);
   });
   ```

## 三、Promise与事件循环

Promise在初始化时，传入的函数是同步执行的，然后注册 then 回调。注册完之后，继续往下执行同步代码，在这之前，then 中回调不会执行。同步代码块执行完毕后，才会在事件循环中检测是否有可用的 promise 回调，如果有，那么执行，如果没有，继续下一个事件循环。

关于 Promise 在事件循环中还有一个 微任务的概念（microtask）。

## 四、参考

* [Promise原理讲解 && 实现一个Promise对象 (遵循Promise/A+规范)](Promise原理讲解 && 实现一个Promise对象 (遵循Promise/A+规范))

* [Promise 对象](http://es6.ruanyifeng.com/#docs/promise)
* [深入学习 ES6 之 Promise](https://mp.weixin.qq.com/s/hdvPdTUR7lfnoWl2aO2Cig)

