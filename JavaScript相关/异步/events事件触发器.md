## 引入

大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）。

例如，net.Server 会在每次有新连接时触发事件，fs.ReadStream 会在打开文件时触发事件，stream会在数据可读时触发事件。

**所有能触发事件的对象都是 EventEmitter 类的实例**。 这些对象有一个 **eventEmitter.on()** 函数，用于将一个或多个函数绑定到命名事件上。 事件的命名通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性键。

**当 EventEmitter 对象触发一个事件时，所有绑定在该事件上的函数都会被同步地调用**。 被调用的监听器返回的任何值都将会被**忽略并丢弃**。

例子，一个简单的 EventEmitter 实例，绑定了一个监听器。 eventEmitter.on() 用于注册监听器， eventEmitter.emit() 用于触发事件。
```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发事件');
});
myEmitter.emit('event');
```

## eventEmitter.emit()
eventEmitter.emit() 方法可以传任意数量的参数到监听器函数。 当监听器函数被调用时， this 关键词会被指向监听器所绑定的 EventEmitter 实例。
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // 打印:
  //   a b MyEmitter {
  //     domain: null,
  //     _events: { event: [Function] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined } true
});
myEmitter.emit('event', 'a', 'b');
```
也可以使用 ES6 的箭头函数作为监听器。但 this 关键词不会指向 EventEmitter 实例：
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');
```

## 异步 vs 同步
EventEmitter 以注册的顺序同步地调用所有监听器。 这样可以确保事件的正确排序，并有助于避免竞态条件和逻辑错误。 当适当时，监听器函数可以使用 setImmediate() 和 process.nextTick() 方法切换到异步的操作模式：
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('异步地发生');
  });
});
myEmitter.emit('event', 'a', 'b');
```

## 仅处理事件一次
使用 eventEmitter.once() 可以注册最多可调用一次的监听器。 当事件被触发时，监听器会被注销，然后再调用。
```js
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 不触发
```

## 错误事件
当 EventEmitter 实例出错时，应该触发 'error' 事件。 这些在 Node.js 中被视为特殊情况。

作为最佳实践，应该始终为 'error' 事件注册监听器。
```js
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('错误信息');
});
myEmitter.emit('error', new Error('错误'));
// 打印: 错误信息
```
通过使用符号 errorMonitor 安装监听器，可以监视 'error' 事件但不消耗触发的错误。
```js
const myEmitter = new MyEmitter();
myEmitter.on(EventEmitter.errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('错误'));
// 仍然抛出错误并使 Node.js 崩溃。
```