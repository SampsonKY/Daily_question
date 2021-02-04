---
title: Js 定时器
categories: 前端学习
tags: javascript
---
# JavaScript定时器
## 一、什么是定时器

JavaScript提供了一些原生的方法来实现延时去执行某一段代码，下面简单介绍一下：

`setTimeout`:设置一个定时器，在定时器到期后执行一次函数或代码段，

```JavaScript
var timeoutId = window.setTimeout(func|code, delay);
```

> - timeoutId: 定时器ID
> - func: 延迟后执行的函数
> - code: 延迟后执行的代码字符串，不推荐使用原理类似eval()
> - delay: 延迟的时间（单位：毫秒），默认值为0

`setInterval`: 以固定的时间间隔重复调用一个函数或者代码段[·](http://caibaojian.com/javascript-timer.html)

```
var intervalId = window.setInterval(func|code, delay);
```

> - intervalId: 重复操作的ID
> - func: 延迟调用的函数
> - code: 代码段
> - delay: 延迟时间，没有默认值

另外，还有两种不常见的定时器：`setImmediate`, `requestAnimationFrame`。

## 二、定时器的工作原理以及不定时的原理

> JavaScript是一个**单线程的解释器**，因此一定时间内只能执行一段代码。为了要控制执行的代码，就有一个JavaScript任务队列。这些任务会按照它们添加到队列的顺序执行。`setTimeout()`的第二个参数告诉JavaScript再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行；如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。

**【注意】**：

1. 首先，**JavaScript是以单线程的方式运行的**。JavaScript的主要用途是与用户互动，以及操作DOM。若以多线程的方式，则可能出现冲突。假设有两个线程同时操作一个DOM元素，线程1要求浏览器删除DOM，而线程2却要求修改DOM样式，这时浏览器就无法决定采用哪个线程的操作。（但是JavaScript有个基于“Event Loop”并发的模型。<此处不讨论。。>）
2. js既然是单线程的，也就意味着所有任务需要排队。所有任务可以分成两种，一种是**同步任务**（synchronous），另一种是**异步任务**（asynchronous）
   * 同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务，形成了一个执行栈
   * 异步任务指的是，不进入主线程，而进入"任务队列"（task queue）的任务。"任务队列"是一个事件的队列（可以当作消息的队列来理解）。IO设备完成一项任务or异步任务有了运行结果，就在"任务队列"中添加一个事件，表示相关的操作可以进入"执行栈"，就等着执行栈调用了。
3. **因为`setTimeout`, `setInterval`是异步任务，调用之后不会直接进入执行栈，而是进入任务队列，所以只有等到当前执行栈没有其他操作，它们才会进入执行栈中执行，** 以上就是为什么定时器**不总是定时**的原因了。
4. 如果`delay`时间周期设为0，相当于一个插队操作

## 三、实例

例1：

```JavaScript
var a = true;
setTimeout(function(){
    a = false;
}, 1000);
 
while(a){}
 
console.log(a);
```

`console.log(a)`永远不会执行,因为JavaScript是单线程的，且定时器的回调将在等待当前正在执行的任务完成后才执行，而`while(a){}`直接进入了死循环，一直占用线程，不会给回调函数执行机会。

例2：

```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, 0);
}
```

代码会输出`5 5 5 5 5`。当`i = 0`时，生成一个定时器，将回调函数插入到事件队列中，等待当前队列中无任务执行时立即执行，而此时`for`循环正在执行，所以回调被搁置。当for循环执行完之后，队列中存在5个回调函数，它们都将执行`console.log(i)`的操作，因为当前JS代码中并没有使用块级作用域，所以`i`的值在`for`循环结束后一直为5.

例3：

```JavaScript
var obj = {
    msg: 'obj',
    shout: function () {
        alert(this.msg);
    },
    waitAndShout: function() {
        setTimeout(function () {
            this.shout();
        }, 0);    
    }
};
obj.waitAndShout();
```

这个问题涉及到了`this`的指向问题，由`setTimeout()`调用的代码运行在与与所在函数完全分离的执行环境上。这会导致这些代码中包含的`this`关键字会指向`window`（或全局）对象，`window`对象中并不存在`shout`方法，所以就会报错。

可以这样修改：

```JavaScript
var obj = {
    msg: 'obj',
    shout: function () {
        alert(this.msg);
    },
    waitAndShout: function() {
        var self = this; //这里将this赋给一个变量
        setTimeout(function () {
            self.shout();
        }, 0);    
    }
};
obj.waitAndShout();
```

## 四、注意事项

1. 我们可以使用`clearTimeout()`和`clearInterval()`方法来取消定时器
2. 对于`setTimeout(f, 0)`指定时间为0，并不是说回调函数`f`会马上执行，而是会在下一轮事件循环一开始就执行。
3. 在使用超时调用时，没必要跟踪超时调用ID，因为每次执行代码之后，如果不再设置另一次超时调用，调用就会自行停止。
4. 最好不要使用间歇调用

## 五、参考

* 《JavaScript高级程序设计》第三版

* MDN

* [JS 定时器的四种写法及简介](http://caibaojian.com/javascript-timer.html)

* [定时器](https://javascript.ruanyifeng.com/advanced/timer.html#toc5)

* [js定时器，你所要了解的那点事](https://juejin.im/post/5acd8006f265da239236b172)