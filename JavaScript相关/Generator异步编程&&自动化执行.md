## Generator异步编程概念

> Generator 函数可以**暂停执行和恢复执行**（异步操作需要暂停的地方，都用`yield`语句注明；使用`next`方法分阶段执行`Generator`函数），这是它能封装异步任务的根本原因。
>
> 此外，还有两个特性，使它可以作为异步编程的完整解决方案：
>
> - **函数体内外的数据交换**：`next`返回值的 value 属性，是 Generator 函数向外输出数据；`next`方法还可以接受参数，向 Generator 函数体内输入数据。
> - **错误处理机制**：Generator 函数体外，使用指针对象的`throw`方法抛出的错误，可以被函数体内的`try...catch`代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

**异步任务封装示例**

```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

- 首先执行 Generator 函数，获取遍历器对象。

- 然后使用 next 方法，执行异步任务的第一阶段，即 fetch(url)。

- 注意，由于 fetch(url) 会返回一个 Promise 对象，所以 result 的值为：

- ```js
  { value: Promise { <pending> }, done: false }
  ```

- 最后我们为这个 Promise 对象添加一个 then 方法，先将其返回的数据格式化(`data.json()`)，再调用 g.next，将获得的数据传进去，由此可以执行异步任务的第二阶段，代码执行完毕。

可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是**流程管理却不方便**。

## Generator 的自动执行

### thunk 函数

**含义**：Thunk 函数多参数函数替换成一个只接受回调函数作为参数的单参数函数。

**例子**：

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```

**一个简单的Thunk 函数转换器**

```js
// ES5版本
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

// ES6版本
const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};

//例子
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```

**Thunkify 模块**

生产环境的转换器，建议使用 Thunkify 模块。

安装：`npm install thunkify`

### Generator 函数的流程管理

Generator 函数可以自动执行。

```javascript
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```

上面代码中，Generator 函数`gen`会自动执行完所有步骤。

但，这不适合**异步操作**。如果**必须保证前一步执行完，才能执行后一步**，上面的自动执行就不可行。这时，**Thunk 函数**就能派上用处。以读取文件为例。

```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```

上面代码中，`yield`命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数。

这种方法就是 Thunk 函数，因为它**可以在回调函数里，将执行权交还给 Generator 函数。**

```js
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

**Thunk 函数的自动流程管理**

```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

上面代码的`run`函数，就是一个 Generator 函数的自动执行器。内部的`next`函数就是 Thunk 的回调函数。`next`函数先将指针移到 Generator 函数的下一步（`gen.next`方法），然后判断 Generator 函数是否结束（`result.done`属性），如果没结束，就将`next`函数再传入 Thunk 函数（`result.value`属性），否则就直接退出。

**基于 Promise 对象的自动执行**

还是沿用上面的例子。首先，把`fs`模块的`readFile`方法包装成一个 Promise 对象。

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

然后，手动执行上面的 Generator 函数。

```javascript
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});
```

手动执行其实就是用`then`方法，层层添加回调函数。理解了这一点，就可以写出一个**自动执行器。**

```javascript
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```

上面代码中，只要 Generator 函数还没执行到最后一步，`next`函数就调用自身，以此实现自动执行。

### co模块

以上我们针对 `thunk 函数`和`Promise`两种`Generator异步操作`的一次性执行完毕做了封装，但实际场景中已经存在成熟的工具包了，如果大名鼎鼎的**co**库, 其实核心原理就是我们已经手写过了（就是刚刚封装的Promise情况下的执行代码），只不过源码会各种边界情况做了处理。使用起来非常简单:

```js
const co = require('co');
let g = gen();
co(g).then(res =>{
    
  console.log(res);
})
```

打印结果如下:

```js
001.txt的内容
002.txt的内容
100
```

简单几行代码就完成了`Generator`所有的操作。