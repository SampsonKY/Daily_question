**1. 含义**

> 一句话，async函数就是Generator函数的语法糖。

```javascript
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

上面代码的函数`gen`可以写成`async`函数，就是下面这样。

```javascript
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

**async 函数对 Generator 函数的改进**

（1）内置执行器。(Generator 函数的执行必须靠执行器，所以才有了`co`模块，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。)

（2）更好的语义。(`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。)

（3）更广的适用性。(`co`模块约定，`yield`命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。)

（4）返回值是 Promise。(`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作。)

**2.async的多种使用形式**

```javascript
// 函数声明
async function foo() {}

// 函数表达式
const foo = async function () {};

// 对象的方法
let obj = { async foo() {} };
obj.foo().then(...)

// Class 的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars');
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`);
  }
}

const storage = new Storage();
storage.getAvatar('jake').then(…);

// 箭头函数
const foo = async () => {};
```

**3.语法**

- **async 函数返回一个 Promise 对象；async 函数内部 return 语句返回的值，会成为then 方法回调函数的参数；async 函数内部抛出错误，会导致返回的 Promise 对象变为reject 状态。抛出的错误对象会被 catch 方法回调函数接收到。**

  ```js
  async function f() {
    return 'hello world';
  }
  
  f().then(v => console.log(v))
  // "hello world"
  
  async function f() {
    throw new Error('出错了');
  }
  
  f().then(
    v => console.log('resolve', v),
    e => console.log('reject', e)
  )
  //reject Error: 出错了
  ```

- `async`函数返回的 Promise 对象，必须等到内部所有`await`命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到`return`语句或者抛出错误。也就是说，**只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。**

- 【**await命令**】正常情况下，
  
- `await`命令后面是一个 **Promise 对象**，返回该对象的结果。
  
  - 如果不是 Promise 对象，就直接返回对应的值。
- `await`命令后面是一个**`thenable`对象**（即定义了`then`方法的对象），那么`await`会将其等同于 Promise 对象。
  
  - `await`命令后面的 **Promise 对象如果变为`reject`状态**，则`reject`的参数会被`catch`方法的回调函数接收到。
- 任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行。
  
- 如果希望即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个`await`放在`try...catch`结构里面，这样不管这个异步操作是否成功，第二个`await`都会执行。另一种方法是`await`后面的 Promise 对象再跟一个`catch`方法，处理前面可能出现的错误。
  
- 如果`await`后面的异步操作出错，那么等同于`async`函数返回的 Promise 对象被`reject`。
- 多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
- `await`命令只能用在`async`函数之中，如果用在普通函数，就会报错。但如果确实希望多个请求并发执行，可以使用`Promise.all`方法。async 函数可以保留运行堆栈。

**4.async 函数的实现原理**

> async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

