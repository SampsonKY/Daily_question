## Generator

**概念**：

* Generator 函数是 ES6 提供的一种异步编程解决方案。语法上可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
* Generator 函数是分段执行的，`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行。
* 调用 Generator 函数，返回一个**遍历器对象**（遍历器对象生成函数），代表 Generator 函数的内部指针。以后，每次调用遍历器对象的`next`方法，就会返回一个有着`value`和`done`两个属性的对象。`value`属性表示当前的内部状态的值，是`yield`表达式后面那个表达式的值；`done`属性是一个布尔值，表示是否遍历结束。

**理解：**

* **next方法的运行逻辑**【（1）遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。】

* **yield表达式和return语句的区别**【相似之处在于，都能返回紧跟在语句后面的那个表达式的值。区别在于每次遇到`yield`，函数暂停执行，下一次再从该位置继续向后执行，而`return`语句不具备位置记忆的功能。一个函数里面，只能执行一次（或者说一个）`return`语句，但是可以执行多次（或者说多个）`yield`表达式。正常函数只能返回一个值，因为只能执行一次`return`；Generator 函数可以返回一系列的值，因为可以有任意多个`yield`。】
* `next`方法可以带一个**参数**，该参数就会被当作上一个`yield`表达式的返回值。
* `for...of`循环，扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。

**方法**：

* **Generator.prototype.throw()** — Generator 函数返回的遍历器对象，都有一个`throw`方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
* **Generator.prototype.return()** — 可以返回给定的值，并且终结遍历 Generator 函数。
* **next()、throw()、return()的共同点**：让 Generator 函数恢复执行，并且使用不同的语句替换`yield`表达式。

**yield* 表达式**

* 如果`yield`表达式后面跟的是一个**遍历器对象**，需要在`yield`表达式后面加上星号，表明它返回的是一个遍历器对象。这被称为`yield*`表达式。
* `yield*`后面的 Generator 函数（没有`return`语句时），不过是`for...of`的一种简写形式，完全可以用后者替代前者。反之，在有`return`语句时，则需要用`var value = yield* iterator`的形式获取`return`语句的值。

**Generator 函数中的this**

* Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的`prototype`对象上的方法。
* Generator 函数也不能跟`new`命令一起用

**含义：**

- **Generator与状态机**

  ```js
  var clock = function* () {
    while (true) {
      console.log('Tick!');
      yield;
      console.log('Tock!');
      yield;
    }
  };
  ```

  上面就是一个状态机的例子，clock函数共有两种状态，每运行一次，就改变一次状态。

- **Generator与协程（生成器实现机制）**

  **协程**：协程是一种比线程更加轻量级的存在，协程处在线程的环境中，**一个线程可以存在多个协程**，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

  **协程的运作过程**：一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将 **JS 线程的控制权转交给 B协程**，那么现在 B 执行，A 就相当于处于暂停的状态。

  **例子：**

  ```js
  function* A() {
    console.log("我是A");
    yield B(); // A停住，在这里转交线程执行权给B
    console.log("结束了");
  }
  function B() {
    console.log("我是B");
    return 100;// 返回，并且将线程执行权还给A
  }
  let gen = A();
  gen.next();
  gen.next();
  
  // 我是A
  // 我是B
  // 结束了
  ```

  在这个过程中，A 将执行权交给 B，也就是 `A 启动 B`，我们也称 A 是 B 的**父协程**。因此 B 当中最后`return 100`其实是将 100 传给了父协程。

  需要强调的是，对于协程来说，它并不受操作系统的控制，完全由用户自定义切换，因此并没有进程/线程**上下文切换**的开销，这是**高性能**的重要原因。

  

