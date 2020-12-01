# part 1 作用域和闭包

## 作用域

> 作用域是一套规则，用于确定在何处以及如何查找变量（标识符）。

### 编译原理

> JS实际上是一门编译语言。但其编译过程不是发生在构建之前（js引擎不会有大量的时间用来优化），大部分情况下编译发生在代码执行前几微妙。
>
> 任何JavaScript代码片段在执行前都要进行编译。
>
> 在作用域背后，JavaScript引擎用尽了各种方法（比如JIT,可以延迟编译甚至实施重编译）来保证性能最佳。

传统编译流程中，程序中一段源代码执行之前会经历三个步骤，统称为“**编译**”。

* **分词/词法分析**

  将由字符组成的字符串分解成有意义的代码块，这些代码块被称为**词法单元**

* **解析/语法分析**

  将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“**抽象语法树**”（AST）。

* **代码生成**

  将 AST 转换为可执行代码的过程

比起那些编译过程只有三个步骤的语言的编译器，JavaScript 引擎要复杂得多。例如，在语法分析和代码生成阶段有特定的步骤来对运行性能进行优化，包括对冗余元素进行优化等

### 作用域

#### 三个**角色**

* 引擎：从头到尾负责整个 JavaScript 程序的编译及执行过程
* 编译器：负责语法分析及代码生成等脏活累活
* 作用域：负责收集并维护由所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

#### **`var a = 2; `**

当看到 `var a = 2; ` 时，引擎认为这里有两个完全不同的声明，一个由*编译器在编译时处理*，另一个则由*引擎在运行时处理*。

1. 编译器：程序   --->  词法单元  --->  树结构
2. **代码生成**过程中：
   * 遇到 `var a`，编译器会询问作用域是否已经有一个该名称的变量存在于同一个作用域的集合中。如果是，编译器会忽略该声明，继续进行编译；否则它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为`a`。
   * 接下来编译器会为引擎生成运行时所需的代码，这些代码被用来处理 `a = 2` 这个赋值操作。引擎运行时会首先询问作用域，在当前的作用域集合中是否存在一个叫作 `a` 的变量。如果是，引擎就会使用这个变量；如果否，引擎会继续查找该变量.

   **总结**：变量的赋值操作会执行两个动作，首先编译器会在当前作用域中声明一个变量（如果之前没有声明过），然后在运行时引擎会在作用域中查找该变量，如果能够找到就会对它赋值。

#### 查找变量

>  查找的过程由作用域进行协助，但是引擎执行怎样的查找，会影响最终的查找结果。

如果查找的目的是对变量进行赋值，那么就会使用**LHS 查询**；如果目的是获取变量的值，就会使用**RHS 查询**。

**嵌套作用域**：LHS 和RHS 查询都会在当前执行作用域中开始，如果没有找到所需的标识符，就会向上级作用域继续查找目标标识符，这样每次上升一级作用域，最后抵达全局作用域（顶层），无论是否找到都将停止。

#### 异常

- 不成功的RHS 引用会导致抛出ReferenceError 异常。
- 不成功的LHS 引用会导致自动隐式地创建一个全局变量（非严格模式下），该变量使用LHS 引用的目标作为标识符，或者抛出ReferenceError 异常（严格模式下）。
- RHS 查到一个变量，但尝试对这个变量的值进行不合理的操作，比如试图对一个非函数类型的值进行函数调用，或着引用null 或undefined 类型的值中的属性，那么引擎会抛出另外一种类型的异常，叫TypeError。
- ReferenceError 同作用域判别失败相关，而TypeError 则代表作用域判别成功了，但是对结果的操作是非法或不合理的。

## 词法作用域

> 大多数编程语言采用的都是 词法作用域 。另外一种叫 动态作用域。
>
> **词法作用域就是定义在词法阶段的作用域。**

### 词法阶段

大部分标准语言编译器的第一个工作阶段叫作词法化（也叫单词化）。词法化的过程会对源代码中的字符进行检查，如果是有状态的解析过程，还会赋予单词语义。

**词法作用域就是定义在词法阶段的作用域**。

例子：

```javascript
function foo(a) {
    var b = a * 2;
    function bar(c) {
        console.log( a, b, c );
    }
    bar( b * 3 );
}
foo( 2 ); // 2, 4, 12
```

* 包含着整个全局作用域，其中只有一个标识符：foo。
* 包含着foo 所创建的作用域，其中有三个标识符：a、bar 和b。
* 包含着bar 所创建的作用域，其中只有一个标识符：c。

**作用域查找会在找到第一个匹配的标识符时停止。**

**无论函数在哪里被调用，也无论它如何被调用，它的词法作用域都只由函数被声明时所处的位置决定。**

### 欺骗词法

#### eval

> eval(..) 函数可以接受一个字符串为参数，并将其中的内容视为好像在书写时就存在于程序中这个位置的代码。换句话说，可以在你写的代码中用程序生成代码并运行，就好像代码是写在那个位置的一样。
>
> eval(…)可以对一段包含一个或多个声明的代码字符串进行演算，并借此来修改已经存在的词法作用域（在运行时）。

```javascript
function foo(str, a) {
    eval( str ); // 欺骗！
    console.log( a, b );
}
var b = 2;
foo( "var b = 3;", 1 ); // 1, 3
```

#### with

> with 通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身。
>
> with 声明实际上是根据你传递给它的对象凭空创建了一个全新的词法作用域。
>
> with 本质上是通过将一个对象的引用当作作用域来处理，将对象的属性当作作用域中的标识符来处理，从而创建了一个新的词法作用域（同样是在运行时）。

```javascript
function foo(obj) {
    with (obj) {
    	a = 2;
    }
}
var o2 = {
	b: 3
};
foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2——不好，a 被泄漏到全局作用域上了！
```

#### 性能

JavaScript 引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的词法进行静态分析，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符。

这两个机制的副作用是引擎无法在编译时对作用域查找进行优化，因为引擎只能谨慎地认为这样的优化是无效的。使用这其中任何一个机制都将导致代码运行变慢。不要使用它们。

## 函数作用域和块作用域

### 函数作用域

> 函数作用域的含义是指：属于这个函数的全部变量都可以在整个函数的范围内使用及复用。

#### 用法

* **隐藏内部实现**：从所写的代码中挑选出一个任意的片段，然后用函数声明对它进行包装，实际上就是把这些代码“隐藏”起来了。【最小特权原则：应该最小限度地暴露必要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的API 设计。】
* **避免冲突**：避免同名标识符之间的冲突

**例子**

```javascript
var a = 2;
function foo() {    
    var a = 3;
    console.log( a ); // 3
}
foo(); 
console.log( a ); // 2
```

通过函数作用域，我们将内部变量和函数定义隐藏起来。但存在一些问题，首先，必须声明一个具名函数foo()，意味着foo 这个名称本身“污染”了所在作用域（在这个例子中是全局作用域）。其次，必须显式地通过函数名（foo()）调用这个函数才能运行其中的代码。

**如果函数不需要函数名（或者至少函数名可以不污染所在作用域），并且能够自动运行，**这将会更加理想。

```javascript
var a = 2;
(function foo(){         //这个函数会被当成一个函数表达式
    var a = 3;
    console.log( a ); // 3
})();
console.log( a ); // 2
```

这个代码片段中，**foo被绑定在函数表达式自身的函数中而不是在所在的作用域中**。foo变量名被隐藏在自身中意味着不会非必要地污染外部作用域。

#### 匿名和具名函数

```javascript
setTimeout(function(){
    console.log("I waited 1 second!")
}, 1000)
```

这里的回调参数是一个 **匿名函数表达式** 。方便书写，但也有一些缺点。

* 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难。
* 如果没有函数名，当函数需要引用自身时只能使用已经过期的arguments.callee 引用，比如在递归中。另一个函数需要引用自身的例子，是在事件触发后事件监听器需要解绑自身。
* 匿名函数省略了对于代码可读性/ 可理解性很重要的函数名。一个描述性的名称可以让代码不言自明。

**最佳实践**

```javascript
setTimeout(function timeoutHandler(){
    console.log("I waited 1 second!")
}, 1000)
```

**立即执行函数**

```javascript
var a = 2;
(function foo(global){
    var a = 3;
    console.log( a ); // 3
    console.log(global.a) //2
})(window);  //传递参数
console.log( a ); // 2
```

第一个( ) 将函数变成表达式，第二个( ) 执行了这个函数。

### 块作用域

> 块作用域是一个用来对之前的最小授权原则进行扩展的工具，将代码从在函数中隐藏信息扩展为在块中隐藏信息。
>
> 表面上看JavaScript 并没有块作用域的相关功能。除非你更加深入地研究。

**with**：用with 从对象中创建出的作用域仅在with 声明中而非外部作用域中有效。

**try/catch的catch块**：catch 分句会创建一个块作用域，其中声明的变量仅在catch 内部有效。

**let**：let 关键字可以将变量绑定到所在的任意作用域中（通常是{ .. } 内部）。换句话说，let为其声明的变量隐式地了所在的块作用域。

**const**：与let类似，但其值是固定的（常量）。

## 提升

> 在编译器的内容说过，引擎会在解释JavaScript 代码之前首先对其进行编译。编译阶段中的一部分工作就是找到所有的声明，并用合适的作用域将它们关联起来。
>
> 因此，包括变量和函数在内的所有声明都会在任何代码被执行前首先被处理。

* 每个作用域都会进行提升操作。
* 函数声明会被提升，但函数表达式不会。
* 函数会首先被提升，然后是变量。
* 重复的var声明会被忽略掉，但出现在后面的函数声明还是可以覆盖前面的。
* 尽可能避免在条件判断等块中声明函数。

## 作用域闭包

> **当函数可以记住并访问所在词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行的。**
>
> 闭包是基于词法作用域书写代码时所产生的自然结果。

**在定时器、事件监听器、Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步（或者同步）任务中，只要使用了回调函数，实际上就是在使用闭包！**

```javascript
function wait(message) {
setTimeout( function timer() {
    console.log( message );
    }, 1000 );
}
wait( "Hello, closure!" );
```

内置的工具函数setTimeout(..) 持有对一个参数的引用。引擎会调用这个函数，而词法作用域在这个过程中保持完整。这就是闭包。

### 循环和闭包

```javascript
for (var i=1; i<=5; i++) {
    setTimeout( function timer() {
        console.log( i );
	}, i*1000 );
}
//输出5次6
```

延迟函数的回调会在循环结束时才执行，尽管循环中的5个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中。

**解决1：IIFE**

```javascript
for (var i=1; i<=5; i++) {
    (function() {
        setTimeout( function timer() {
            console.log( i );
        }, i*1000 );
    })(i);
}
```

在迭代内使用IIFE 会为每个迭代都生成一个新的作用域，使得延迟函数的回调可以将新的作用域封闭在每个迭代内部，每个迭代中都会含有一个具有正确值的变量供我们访问。

**解决2：let**

```javascript
for (var i=1; i<=5; i++) {
    let j = i; // 是的，闭包的块作用域！
    setTimeout( function timer() {
    	console.log( j );
    }, j*1000 );
}
```

let 声明，可以用来劫持块作用域，并且在这个块作用域中声明一个变量。**本质上这是将一个块转换成一个可以被关闭的作用域**。

```javascript
for (let i=1; i<=5; i++) {
    setTimeout( function timer() {
    	console.log( i );
    }, i*1000 );
}
```

for 循环头部的let 声明还会有一个特殊的行为。这个行为**指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。**

### 模块

> 模块是利用闭包最大威力的一个东西。

模块有**两个主要特征**：（1）为创建内部作用域而调用了一个包装函数；（2）包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的闭包。

# part 2 this和原型对象

## 关于this

> this 是在**运行时**进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this 的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。
>
> 当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this 就是记录的其中一个属性，会在函数执行的过程中用到。

### 为什么使用this

```javascript
//使用this
function func(){
    return this.name.toUpperCase()
}
var me = {name: 'ky'}
func.call(me)  //KY

//不使用this，则需要显示传入一个上下文对象
function func(context){
    return context.name.toUpperCase()
}
var me = {name: 'ky'}
func(me)// KY
```

this 提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API 设计得更加简洁并且易于复用。

随着使用模式越来越复杂，显式传递上下文对象会让代码变得越来越混乱，使用this则不会这样。

### 误解

**this 并不是指向函数自身！！**

```javascript
function foo(num) {
    console.log( "foo: " + num );
    this.count++;// 记录foo 被调用的次数
}
foo.count = 0;
var i;
for (i=0; i<10; i++) {
    if (i > 5) {
    	foo( i );  //正确用法，强制this指向foo，foo.call(foo,i)
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9
// foo 被调用了多少次？
console.log( foo.count ); // 0 -- WTF?
```

**this并非指向函数的作用域！！！**

> this 在任何情况下都不指向函数的词法作用域。在JavaScript 内部，作用域确实和对象类似，可见的标识符都是它的属性。但是作用域“对象”无法通过JavaScript代码访问，它存在于JavaScript 引擎内部。

```javascript
function foo() {
    var a = 2;
    this.bar();
}
function bar() {
	console.log( this.a );
}
foo(); // ReferenceError: a is not defined
```

## this全面解析

> 如果要判断一个运行中的函数的 this 绑定，就需要找到这个函数的直接调用位置。然后根据绑定规则判断 this 的绑定对象

### 绑定规则

#### 默认绑定

> 独立函数调用，this 指向全局对象（函数运行在非严格模式）。
>
> 若使用严格模式，则不能将全部对象用于默认绑定，因此 this 会绑定到 undefined。

```javascript
function foo(){ console.log(this.a)}
var a =2
foo() //2
```

#### 隐式绑定

> 考虑调用位置是否有上下文，或者说是否被某个对象拥有或者包含。
>
> 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this 绑定到这个上下文对象。

```javascript
function foo() {
	console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
obj.foo(); // 2
```

**注意**

* 对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。

  ```javascript
  function foo() {
  	console.log( this.a );
  }
  var obj2 = {
  	a: 42,
  	foo: foo
  };
  var obj1 = {
      a: 2,
      obj2: obj2
  };
  obj1.obj2.foo(); // 42
  ```

* **隐式丢失**：隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把this绑定到全局或者undefined。

  ```javascript
  function foo() {
  	console.log( this.a );
  }
  var obj = {
      a: 2,
      foo: foo
  };
  var bar = obj.foo; // 函数别名！
  var a = "oops, global"; // a 是全局对象的属性
  bar(); // "oops, global"
  ```

  bar 是 obj.foo 的一个引用，但实际上，它引用的是 foo 函数本身，因此此时的 bar() 其实是一个不带任何修饰的函数调用，因此应用了默认规则。

#### 显示绑定

> 在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this 间接（隐式）绑定到这个对象上。
>
> 那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，可以使用 call(..)、apply(..)，它们第一个参数是一个对象，是给this准备的，接着在调用函数时将其绑定到this。

```javascript
function foo(){ console.log(this.a)}
var obj = {a:2}
foo.call(obj) //2
```

**显示绑定仍然无法解决丢失绑定的问题。但其一个变种可以解决！**

* **硬绑定bind()**

  ```javascript
  function foo(something){
      console.log(this.a, something)
      return this.a + something
  }
  var obj = { a:2 }
  var bar = function(){ return foo.aplly(obj, arguments)} //这里将foo的this强制绑定到了obj，无论之后如何调用bar，它总会手动在obj上调用foo,这种绑定是一种显示的强制绑定，称之为硬绑定。
  var b = bar(3) //2,3
  console.log(b) //5
  
  bar.call(window)//硬绑定的bar不可能再修改它的this
  ```

  将上面代码改进，创建一个可以重复使用的辅助函数：

  ```javascript
  function foo(something) {
      console.log( this.a, something );
      return this.a + something;
  }
  // 简单的辅助绑定函数
  function bind(fn, obj) {
      return function() {
      	return fn.apply( obj, arguments );
  	};
  }
  var obj = {
  	a:2
  };
  var bar = bind( foo, obj );
  var b = bar( 3 ); // 2 3
  console.log( b ); // 5
  ```

  **硬绑定是一种非常常用的模式，所以在ES5 中提供了内置的方法Function.prototype.bind**

* **API调用的上下文**

  第三方库的许多函数，以及JavaScript 语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”（context），其作用和bind(..) 一样，确保你的回调函数使用指定的this。

  ```javascript
  function foo(el) {
  	console.log( el, this.id );
  }
  var obj = {
  	id: "awesome"
  };
  // 调用foo(..) 时把this 绑定到obj
  [1, 2, 3].forEach( foo, obj );
  // 1 awesome 2 awesome 3 awesome
  ```

#### new 绑定

> 在JavaScript 中，构造函数只是一些使用new 操作符时被调用的函数。
>
> 包括内置对象函数（比如Number(..)）在内的所有函数都可以用new 来调用，这种函数调用被称为构造函数调用。
> 实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

使用new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行[[ 原型]] 连接。
3. **这个新对象会绑定到函数调用的this。**
4. 如果函数没有返回其他对象，那么new 表达式中的函数调用会自动返回这个新对象。

```javascript
function foo(a) {
	this.a = a;
}
var bar = new foo(2);
console.log( bar.a ); // 2
```

使用new 来调用foo(..) 时，我们会构造一个新对象并把它绑定到foo(..) 调用中的this上。new 是最后一种可以影响函数调用时this 绑定行为的方法，我们称之为new 绑定。

### 优先级

**new 绑定  >  显示绑定  >  隐式绑定  >  默认绑定**

### 绑定例外

> 某些场景下，this的绑定行为会出乎意料。

#### 被忽略的this

如果你把`null` 或者`undefined` 作为this 的绑定对象传入call、apply 或者bind，这些值在调用时会被忽略，实际应用的是**默认绑定**规则。

```javascript
function foo() { console.log(this.a)}
var a = 2
foo.call(null) //2
```

**传入null的情况**

* 一种非常常见的做法是使用apply(..) 来**“展开”一个数组，并当作参数传入一个函数**。类似地，bind(..) 可以对参数进行**柯里化**（预先设置一些参数）

  ```javascript
  function foo(a,b) {console.log( "a:" + a + ", b:" + b );}
  // 把数组“展开”成参数
  foo.apply( null, [2, 3] ); // a:2, b:3
  // 使用 bind(..) 进行柯里化
  var bar = foo.bind( null, 2 );
  bar( 3 ); // a:2, b:3
  ```

  这两种方法都需要传入一个参数当作this 的绑定对象。如果函数并不关心this 的话，你仍然需要传入一个占位值，这时null 可能是一个不错的选择

**但总是使用 null 来忽略 this 的绑定可能产生一些副作用。更安全的做法是传入一个特殊的对象（空对象）。**

```javascript
function foo(a,b) {console.log( "a:" + a + ", b:" + b );}
// 我们的DMZ 空对象
var ø = Object.create( null );
// 把数组展开成参数
foo.apply( ø, [2, 3] ); // a:2, b:3
// 使用bind(..) 进行柯里化
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2, b:3
```

#### 间接引用

我们有可能（有意或者无意地）创建一个函数的“间接引用”，在这种情况下，调用这个函数会应用默认绑定规则。

```javascript
function foo() {
console.log( this.a );
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
(p.foo = o.foo)(); // 2
```

#### 软绑定

> 硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改this。
>
> 如果可以给默认绑定指定一个全局对象和undefined 以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this 的能力。

```javascript
if (!Function.prototype.softBind) {
	Function.prototype.softBind = function(obj) {
        var fn = this;
        // 捕获所有 curried 参数
        var curried = [].slice.call( arguments, 1 );
        var bound = function() {
        return fn.apply(
            (!this || this === (window || global)) ?
            obj : this
            curried.concat.apply( curried, arguments )
        );
	};
    bound.prototype = Object.create( fn.prototype );
    return bound;
};
}
```

### this 词法

> 箭头函数不使用this 的四种标准规则，而是根据外层（函数或者全局）作用域来决定this。
>
> 即箭头函数会继承外层函数调用的this绑定。

```javascript
function foo(){
    //返回一个箭头函数
    return (a) => {
        //this继承自foo()
        console.log(this.a)
    }
}
var obj1 = {a:2}
var obj2 = {a:3}
var bar = foo.call(obj1)
bar.call(obj2) //2
```

## 对象

### 语法

```javascript
var obj = { key: value ....} //可一次添加多个键值对
var obj = new Object(); obj.key = value ...
```

### 类型

**六种语言类型**： string 、number、boolean、null、undefined、object

**注意**：typeof null 返回 “object“，这是语言的一个bug。原理：不同的对象在底层都表示为二进制，在JavaScript 中二进制前三位都为0 的话会被判断为object 类型，null 的二进制表示是全0，自然前三位也是0，所以执行typeof 时会返回“object”。

**内置对象**：String、Number、Boolean、Object、Function、Array、Date、RegExp、Error

### 内容

> 对象的内容是由一些存储在特定命名位置的（任意类型的）值组成的，我们称之为属性。
>
> 存储在对象容器内部的是这些属性的名称，它们就像指针（从技术角度来说就是引用）一样，指向这些值真正的存储位置。
>
> 使用. 操作符（属性访问）或者[] 操作符（键访问）访问值。
>
> 对象中，属性名永远是字符串。

#### 属性描述符

> 从ES5 开始，所有的属性都具备了属性描述符。

```javascript
var myObject = {
	a:2
};
Object.getOwnPropertyDescriptor( myObject, "a" );
// {
// value: 2,
// writable: true,
// enumerable: true,
// configurable: true
// }
```

可以使用`Object.defineProperty(..)`来添加一个新属性或者修改一个已有属性（如果它是configurable）并对特性进行设置。

```javascript
var myObject = {};
Object.defineProperty( myObject, "a", {
    value: 2,
    writable: true,   //是否可以修改属性的值
    configurable: true, //属性是否可配置和删除，修改为false是单向操作，无法撤销
    enumerable: true  //属性是否出现在对象的属性枚举中
} );
myObject.a; // 2
```

#### 不变性

* **对象常量**

  结合`writable:false` 和`configurable:false` 就可以创建一个真正的常量属性（不可修改、
  重定义或者删除）

  ```javascript
  var myObject = {};
  Object.defineProperty( myObject, "FAVORITE_NUMBER", {
      value: 42,
      writable: false,
      configurable: false
  } );
  ```

* **禁止扩展**

  禁止一个对象添加新属性并且保留已有属性， 可以使用`Object.preventExtensions(..)`

  ```javascript
  var myObject = {
  	a:2
  };
  Object.preventExtensions( myObject );
  myObject.b = 3;
  myObject.b; // undefined
  ```

* **密封**
    `Object.seal(..)` 会创建一个“密封”的对象，这个方法实际上会在一个现有对象上调用`Object.preventExtensions(..)` 并把所有现有属性标记为`configurable:false`。所以，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性（虽然可以修改属性的值）。
    
* **冻结**
  `Object.freeze(..)` 会创建一个冻结对象，这个方法实际上会在一个现有对象上调用`Object.seal(..)` 并把所有“数据访问”属性标记为`writable:false`，这样就无法修改它们
  的值。
  这个方法是你可以应用在对象上的级别最高的不可变性，它会禁止对于对象本身及其任意直接属性的修改（这个对象引用的其他对象是不受影响的）。
  
  你可以“深度冻结”一个对象，具体方法为，首先在这个对象上调用`Object.freeze(..)`，然后遍历它引用的所有对象并在这些对象上调用`Object.freeze(..)`。但是一定要小心，因为这样做有可能会在无意中冻结其他（共享）对象。

#### [[Get]]

```javascript
var myObject = {
	a: 2
};
myObject.a; // 2
```

在语言规范中，`myObject.a` 在`myObject` 上实际上是实现了`[[Get]]` 操作（有点像函数调用：`[[Get]]()`）。对象默认的内置`[[Get]]` 操作首先在对象中查找是否有名称相同的属性，如果找到就会返回这个属性的值。

如果没有找到名称相同的属性，按照[[Get]] 算法的定义会遍历可能存在的[[Prototype]] 链，也就是原型链）。
如果无论如何都没有找到名称相同的属性，那[[Get]] 操作会返回值undefined。

#### [[Put]]

你可能会认为给对象的属性赋值会触发[[Put]] 来设置或者创建这个属性。但是实际情况并不完全是这样。

[[Put]] 被触发时，实际的行为取决于许多因素，包括对象中是否已经存在这个属性（这是最重要的因素）。

如果已经存在这个属性，[[Put]] 算法大致会检查下面这些内容。

1. 属性是否是访问描述符？如果是并且存在setter 就调用setter。

2. 属性的数据描述符中writable 是否是false ？如果是，在非严格模式下静默失败，在
    严格模式下抛出TypeError 异常。

3. 如果都不是，将该值设置为属性的值。


如果对象中不存在这个属性，[[Put]] 操作会更加复杂。

#### Getter 和 Setter

> getter 是一个隐藏函数，会在获取属性值时调用。setter 也是一个隐藏函数，会在设置属性值时调用。
>
> 当你给一个属性定义getter、setter 或者两者都有时，这个属性会被定义为“**访问描述符**”（和“数据描述符”相对）。
>
> 对于访问描述符来说，JavaScript 会忽略它们的value 和writable 特性，取而代之的是关心set 和get（还有configurable 和enumerable）特性。

```javascript
var myObject = {
// 给a 定义一个getter
    get a() {
        return 2;
    }
};
Object.defineProperty(
    myObject, // 目标对象
    "b", // 属性名
    { // 描述符
        // 给b 设置一个getter
        get: function(){ return this.a * 2 },
        // 确保b 会出现在对象的属性列表中
        enumerable: true
	}
);
myObject.a; // 2
myObject.b; // 4
```

不管是对象文字语法中的`get a() { .. }`，还是`defineProperty(..)` 中的显式定义，二者都会在对象中创建一个不包含值的属性，对于这个属性的访问会自动调用一个隐藏函数，它的返回值会被当作属性访问的返回值

#### 存在性

* `in` 操作符会检查属性是否在对象及其`[[Prototype]]` 原型链中。相比之下，
  `hasOwnProperty(..)` 只会检查属性是否在`myObject` 对象中，不会检查`[[Prototype]]` 链。
* `in` 操作符实际上检查的是某个**属性名**是否存在。对于数组来说这个区别非常重要，4 in [2, 4, 6] 的结
  果为false，因为[2, 4, 6] 这个数组中包含的属性名是0、1、2，没有4。
* `Object.keys(..)` 会返回一个数组，包含所有可枚举属性，`Object.getOwnPropertyNames(..)`
  会返回一个数组，包含所有属性，无论它们是否可枚举。
* `Object.keys(..)`和`Object.getOwnPropertyNames(..)` 都只会查找对象直接包含的属性。

### 遍历

* `for..in` 循环可以用来遍历对象的可枚举属性列表（包括[[Prototype]] 链），但无法直接获取属性值，其实际遍历的是属性名。
* ES5 中增加了一些数组的辅助迭代器，包括`forEach(..)`、`every(..)` 和`some(..)`。每种辅助迭代器都可以接受一个回调函数并把它应用到数组的每个元素上，唯一的区别就是它们对于回调函数返回值的处理方式不同。`forEach(..)` 会遍历数组中的所有值并忽略回调函数的返回值。`every(..)` 会一直运行直到回调函数返回`false`（或者“假”值），`some(..)` 会一直运行直到回调函数返回`true`（或者
  “真”值）。
* ES6的`for..of` 循环可以直接遍历属性值。`for..of` 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的`next()` 方法来遍历所有返回值。

## 混合对象“类”

> 类是一种设计模式。许多语言提供了对于面向类软件设计的原生语法。JavaScript 也有类似的语法，但是和其他语言中的类完全不同。

**传统的类**

* 类意味着复制。
* 传统的类被实例化时，它的行为会被**复制**到实例中。类被继承时，行为也会被复制到子类中。
* 多态（在继承链的不同层次名称相同但是功能不同的函数）看起来似乎是从子类引用父类，但是本质上引用的其实是复制的结果。

JavaScript 并不会（像类那样）自动创建对象的副本。一个对象并不会被复制到其他对象，它们会被关联起来。

JavaScript开发者也想出了一个方法来模拟类的复制行为，这个方法就是**混入**。

**显示混入**

```javascript
// 非常简单的mixin(..) 例子:
function mixin( sourceObj, targetObj ) {
    for (var key in sourceObj) {
    // 只会在不存在的情况下复制
        if (!(key in targetObj)) {
            targetObj[key] = sourceObj[key];
        }
    }
    return targetObj;
}
var Vehicle = {
    engines: 1,
    ignition: function() {
    	console.log( "Turning on my engine." );
	},
    drive: function() {
        this.ignition();
        console.log( "Steering and moving forward!" );
    }
};
var Car = mixin( Vehicle, {
    wheels: 4,
    drive: function() {
        Vehicle.drive.call( this ); //确保drive()在Car对象的上下文中执行
        console.log(
        	"Rolling on all " + this.wheels + " wheels!"
        );
    }
} );
//注意：我们处理的不再是类了，因为在JavaScript 中不存在类，Vehicle 和Car 都是对象，供我们分别进行复制和粘贴。
```

**函数实际上没有被复制，复制的是函数引用**。

## 原型

### [[Prototype]]

> **JavaScript中的对象有一个特殊[[Prototype]]内置属性**，其实就是对于其他对象的引用。几乎所有的对象在创建时[[Prototype]]属性都会被赋予一个非空的值。
>
> 所有普通的[[Prototype]]链最终都会指向内置的 Object.prototype

**用处**

前面说过，当试图**引用对象的属性时**会触发[[Get]] 操作，比如`myObject.a`。对于默认的[[Get]] 操作来说，第一步是检查对象本身是否有这个属性，如果有的话就使用它。但是如a不在`myObject`中，就需要使用对象的[[Prototype]]链了。这个过程会持续到找到匹配的属性名或者查找完整条[[Prototype]] 链。如果是后者的话，[[Get]] 操作的返回值是undefined。

**属性的设置和屏蔽**

```javascript
myObject.foo = "bar"
```

* 如果myObject 对象中包含名为foo 的普通数据访问属性，这条赋值语句只会修改已有的属性值。
* 如果foo不直接存在于 myObject 中而是存在于原型链上层时，`myObject.foo = “bar”`会出现三种情况
  * 如果在[[Prototype]] 链上层存在名为foo 的普通数据访问属性并且没有被标记为只读（writable:false），那就会直接在myObject 中添加一个名为foo 的新属性，它是屏蔽属性。
  * 如果在[[Prototype]] 链上层存在foo，但是它被标记为只读（writable:false），那么无法修改已有属性或者在myObject 上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
  * 如果在[[Prototype]] 链上层存在foo 并且它是一个setter（参见第3 章），那就一定会调用这个setter。foo 不会被添加到（或者说屏蔽于）myObject，也不会重新定义foo 这个setter。

### ”类“

> 在JavaScript 中，类无法描述对象的行为，（因为根本就不存在类！）对象直接定义自己的行
> 为。JavaScript 中只有对象。

#### ”类“函数

> 所有函数默认都会拥有一个名为 prototype 的公有并不可枚举的属性，它会指向另一个对象，即函数的原型对象。

利用这种函数的特殊性质来模仿类。

```javascript
function Foo() {
// ...
}
var a = new Foo();
Object.getPrototypeOf( a ) === Foo.prototype; // true
```

在 JavaScript 中，并没有类似传统类的复制机制。你不能创建一个类的多个实例，只能创建多个对象，它们[[Prototype]] 关联的是同一个对象。但是在默认情况下并不会进行复制，因此这些对象之间并不会完全失去联系，它们是**互相关联的**。

实际上，new Foo() 这个函数调用实际上并没有直接创建关联，这个关联只是一个意外的副作用。new Foo() 只是间接完成了我们的目标：一个关联到其他对象的新对象。

继承意味着复制操作，JavaScript（默认）并不会复制对象属性。相反，JavaScript 会在两个对象之间创建一个关联，这样一个对象就可以通过**委托**访问另一个对象的属性和函数。

#### ”构造函数“

Foo 和其他函数没有任何区别。函数本身并不是构造函数，但是当且仅当使用new时，就会把这个函数调用变成一个“构造函数调用”。实际上，new 会劫持所有普通函数并用构造对象的形式来调用它。

### (原型)继承

```javascript
function Foo(name) {
	this.name = name;
}
Foo.prototype.myName = function() {
	return this.name;
};
function Bar(name,label) {
    Foo.call( this, name );
    this.label = label;
}
// 我们创建了一个新的Bar.prototype 对象并关联到Foo.prototype
Bar.prototype = Object.create( Foo.prototype ); //Object.setProptotypeOf(Bar.prototype,Foo.prototype)
// 注意！现在没有Bar.prototype.constructor 了
// 如果你需要这个属性的话可能需要手动修复一下它
Bar.prototype.myLabel = function() {
	return this.label;
};
var a = new Bar( "a", "obj a" );
a.myName(); // "a"
a.myLabel(); // "obj a"
```

#### 检查“类”关系

* `a instanceof Foo;`    判断在a 的整条[[Prototype]] 链中是否有指向Foo.prototype 的对象
* `Foo.prototype.isPrototypeOf( a ); // true`
* `b.isPrototypeOf( c );`    判断b 是否出现在c 的[[Prototype]] 链中（两个对象之间的关系）
* `Object.getPrototypeOf(a)`   直接获取一个对象的[[Prototype]]链

**`.__proto__`**

`.__proto__` 看起来很像一个属性，但是实际上它更像一个getter/setter。

```javascript
Object.defineProperty( Object.prototype, "__proto__", {
    get: function() {
    	return Object.getPrototypeOf( this );
    },
    set: function(o) {
        // ES6 中的setPrototypeOf(..)
        Object.setPrototypeOf( this, o );
        return o;
    }
} );
```

### 对象关联

#### 创建关联

JavaScript 的 [[Prototype]] 机制和类不一样，那这个机制的意义是什么呢？

**Object.create(…)**

```javascript
if (!Object.create) {
    Object.create = function(o) {
        function F(){}
        F.prototype = o;
        return new F();
    };
}
```

Object.create(..) 会创建一个新对象并把它关联到我们指定的对象，这样我们就可以充分发挥[[Prototype]] 机制的威力（委托）并且避免不必要的麻烦（比如使用new 的构造函数调用会生成.prototype 和.constructor 引用）。

**Object.create(null)** 会创建一个拥有空（ 或者说null）[[Prototype]]链接的对象，这个对象无法进行委托。由于这个对象没有原型链，所以instanceof 操作符（之前解释过）无法进行判断，因此总是会返回false。这些特殊的空[[Prototype]] 对象通常被称作“字典”，它们完全不会受到原型链的干扰，因此非常适合用来存储数据。

我们并不需要类来创建两个对象之间的关系，只需要通过委托来关联对象就足够了。而Object.create(..) 不包含任何“类的诡计”，所以它可以完美地创建我们想要的关联关系。

## 行为委托

> [[Prototype]] 机制就是指对象中的一个内部链接引用另一个对象。
>
> 如果在第一个对象上没有找到需要的属性或者方法引用，引擎就会继续在[[Prototype]]关联的对象上进行查找。同理，如果在后者中也没有找到需要的引用就会继续查找它的[[Prototype]]，以此类推。这一系列对象的链接被称为“原型链”。
>
> 换句话说，JavaScript 中这个机制的本质就是对象之间的关联关系。

