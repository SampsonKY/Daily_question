# JavaScript 代码执行

## 引入

```js
比较下面两段代码，试述两段代码的不同之处
// A--------------------------
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();

// B---------------------------
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

首先A、B两段代码输出返回的都是 `"local scope"`。

那么既然输出一样那这两段代码具体的差异在哪呢？慢慢来吧！

## 作用域

> **作用域是指程序源代码中定义变量的区域**，该位置决定了变量的生命周期。
>
> **作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。**
>
> JavaScript 采用**词法作用域**(lexical scoping)，也就是静态作用域。
>
> **函数的作用域在函数定义的时候就决定了**。

例子：

```javascript
var value = 1;
function foo() {
    console.log(value);
}
function bar() {
    var value = 2;
    foo();
}
bar(); //1
```

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

ES6之前的作用域：

* **全局作用域**中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。
* **函数作用域**就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。

**ES6引入了 let 和 const 关键字**，从而使 JavaScript拥有了块级作用域。

## 执行上下文栈（调用栈）

> JavaScript 可执行代码类型有：**全局代码、函数代码、eval 代码**
>
> 当 JavaScript 代码执行一段可执行代码(executable code)时，JavaScript引擎先会对其进行编译，并创建对应的**执行上下文**(execution context)。
>
> 此外在js解释器**运行阶段**还会维护一个环境栈，当执行流进入一个函数时，函数的环境就会被压入环境栈，当函数执行完后会将其环境弹出，并将控制权返回前一个执行环境。环境栈的顶端始终是当前正在执行的环境。
>
> 在浏览器中的js解释器是一个**单线程**模式的实现. 也就是说,浏览器中同一时间只能做一件事情, 其他任何动作或者事件都会扔到一个叫做执行堆栈(Execution Stack)的队列中。
>
> **这里有5个`执行上下文`的关键点需要牢记:**
>
> 1. 单线程
> 2. 同步执行
> 3. 一个全局上下文
> 4. 无限个函数上下文
> 5. 每次调用一个函数都会新建一个新的**执行上下文**, 哪怕是调用它自身.

JavaScript 引擎创建了**执行上下文栈**（Execution context stack，ECS）来管理执行上下文，执行上下文栈就是专门用来管理函数调用关系的一种数据结构。

可以定义一个数组模拟执行上下文栈：

```javascript
ECStack = [];
```

当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以**初始化**的时候首先就会向执行上下文栈压入一个**全局执行上下文**，我们用 `globalContext` 表示它，并且只有当整个应用程序结束的时候，`ECStack` 才会被清空，所以程序结束之前， `ECStack` 最底部永远有个 `globalContext`：

```JavaScript
ECStack = [
    globalContext
];
```

现在 JavaScript 遇到下面的这段代码了：

```JavaScript
function fun3() {
    console.log('fun3')
}

function fun2() {
    fun3();
}

function fun1() {
    fun2();
}

fun1();
```

**当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出**。知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```JavaScript
// 伪代码
// fun1()
ECStack.push(<fun1> functionContext);

// fun1中调用了fun2，还要创建fun2的执行上下文
ECStack.push(<fun2> functionContext);

// fun2还调用了fun3！
ECStack.push(<fun3> functionContext);

// fun3执行完毕
ECStack.pop();
// fun2执行完毕
ECStack.pop();
// fun1执行完毕
ECStack.pop();
// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

可以看出**调用栈是 JavaScript 引擎追踪函数执行的一个机制**，当一次有多个函数被调用时，通过调用栈就能够追踪到哪个函数正在被执行以及各函数之间的调用关系。

可以在控制台打断点，通过”call stack”查看调用栈或者使用 console.trace() 输出当前函数调用关系。

**调用栈是有大小的**，当入栈的执行上下文超过一定数目，JavaScript引擎就会报错，这种错误叫做**栈溢出**。

**回到引入的两个问题：**

让我们模拟第一段代码：

```JavaScript
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```

让我们模拟第二段代码：

```JavaScript
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```

## 变量对象(variable object)

> 每个**执行上下文**都有三个重要的属性：
>
> * 变量对象（Variable object, VO)：与执行上下文相关的数据作用域，存储了上下文中定义的变量和函数声明
> * 作用域链（Scope chain)
> * this
>
> **执行上下文**可以抽象为一个对象：
>
> ```javascript
> executionContext：{
>     variable object：vars,functions,arguments,
>     scope chain: variable object + all parents scopes
>     thisValue: context object
> }
> ```

**变量对象(环境)**：**每一个执行上下文都会分配一个变量对象(variable object)，变量对象的属性由 变量(variable) 和 函数声明(function declaration) 构成。在函数上下文情况下，参数列表(parameter list)也会被加入到变量对象(variable object)中作为属性。变量对象与当前作用域息息相关。不同作用域的变量对象互不相同，它保存了当前作用域的所有函数和变量。**

这里有一点特殊就是只有 **函数声明(function declaration)** 会被加入到变量对象中，而 **函数表达式(function expression)**则不会。看代码：

```js
// 函数声明
function a(){}
console.log(typeof a); // "function"

// 函数表达式
var a = function _a(){};
console.log(typeof a); // "function"
console.log(typeof _a); // "undefined"
```

函数声明的方式下，`a`会被加入到变量对象中，故当前作用域能打印出 `a`。
函数表达式情况下，`a`作为变量会加入到变量对象中，`_a`作为函数表达式则不会加入，故 `a` 在当前作用域能被正确找到，`_a`则不会。

**关于Global Object**

当js编译器开始执行的时候会初始化一个Global Object用于关联全局的作用域。对于全局环境而言，**全局上下文中的变量对象就是全局对象**。**变量对象对于程序而言是不可读的，只有编译器才有权访问变量对象。**在浏览器端，global object被具象成window对象，也就是说 `global object === window ===全局环境的variable object`。因此**global object对于程序而言也是唯一可读的variable object**。

## 活动对象(activation object)

> 在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。
>
> 活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object ，而只有被激活的变量对象，也就是活动对象上的各种属性才能被访问。
>
> 活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

简言之：**当函数被激活，那么一个活动对象(activation object)就会被创建并且分配给执行上下文。活动对象由特殊对象 arguments 初始化而成。~~随后，他被当做变量对象(variable object)用于变量初始化。~~**
用代码来说明就是：

```JavaScript
function a(name, age){
    var gender = "male";
    function b(){}
}
a(“k”,10);
```

a被调用时，在a的执行上下文会创建一个活动对象AO，并且被初始化为 AO = [arguments]。随后AO又被当做变量对象(variable object)VO进行变量初始化,此时 VO = [arguments].concat([name,age,gender,b])。

## 执行过程

> 每次一个函数被调用的时候,都会创建一个新的执行上下文. 然后, 在Javascript解释器内部, 每次调用一个`执行上下文(Execution context)`都会分为两个阶段：创建阶段、激活/代码执行阶段

**一个执行上下文的生命周期可以分为两个阶段。**

1. **创建阶段**（进入执行上下文）【当一个函数被调用,但是在执行任何内部代码之前】

> 在这个阶段中，执行上下文会分别创建变量对象，建立作用域链，以及确定this的指向。

1. **代码执行阶段**

> 创建完成之后，就会开始执行代码，这个时候，会完成变量赋值，函数引用，以及执行其他代码。

### 进入执行上下文

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：

1. 函数的所有形参 (如果是函数上下文)
   - 由名称和对应值组成的一个变量对象的属性被创建
   - 没有实参，属性值设为 undefined
2. 函数声明
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子：

```JavaScript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};
  b = 3;
}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

### 代码执行

在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值

还是上面的例子，当代码执行完后，这时候的 AO 是：

```JavaScript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

总结：

1. 全局上下文的变量对象初始化是全局对象
2. 函数上下文的变量对象初始化只包括 Arguments 对象
3. 在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
4. 在代码执行阶段，会再次修改变量对象的属性值

## 谈谈变量提升

> 从解释器如何创建`activation object`来看

```javascript
(function() {
    console.log(typeof foo); // 函数指针
    console.log(typeof bar); // 未定义
    var foo = 'hello',
        bar = function() {
            return 'world';
        };
    function foo() {
        return 'hello';
    }

}());
```

**1. 为什么foo变量声明之前我们就能够访问?**

如果我们看上面的创建阶段, 我们知道变量在执行阶段(activation / code execution stage)之前就已经被创建了. 所以当我们的函数开始执行的时候,foo变量在`activation object`中存在了.

**2. foo被定义了两次, 为什么foo被当作是函数而不是undefined或者是字符串呢?**

1. 尽管foo被定义了两次, 我们直到在创建阶段(creation stage)中,函数先于变量创建, 如果其属性名存在的话, 接下来的声明会被跳过
2. 因此, 函数foo的引用在创建阶段的时候先被创建, 解释器接下来发现了变量foo, 但是由于已经存在了foo的名称,因此什么都没有发生和执行

**3. 为什么bar是undefined?**

bar实际上是一个函数变量, 我们变量在创建阶段初始化时的值为undefined.

## 作用域链(execution context and scope chain)

> 当查找变量的时候，会先从当前上下文的变量对象中查找，如果没有找到，就会从父级(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样由多个执行上下文的变量对象构成的链表就叫做**作用域链**。
>
> - scope chain
>   作用域链，它在解释器**进入到一个执行环境时初始化**完成并将其分配给当前执行环境。每个执行环境的作用域链由**当前环境的变量对象及父级环境的作用域链构成。**
>   作用域链具体是如何构建起来的呢，先上代码：
>
>   ```
>   function test(num){
>       var a = "2";
>       return a+num;
>   }
>   test(1);
>   ```
>
>   1. 执行流开始 初始化function test，test函数会维护一个私有属性 [[scope]],并使用当前环境的作用域链初始化，在这里就是 test.[[Scope]]=global scope
>   2. test函数执行，这时候会为test函数创建一个执行环境，然后通过复制函数的[[Scope]]属性构建起test函数的作用域链。此时 test.scopeChain = [test.[[Scope]]]
>   3. test函数的活动对象被初始化，随后活动对象被当做变量对象用于初始化。即 test.variableObject = test.activationObject.contact[num,a] = [arguments].contact[num,a]
>   4. test函数的变量对象被压入其作用域链，此时 test.scopeChain = [ test.variableObject, test.[[scope]]];
>
>   至此test的作用域链构建完成。

### 函数创建

函数的作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 **[[scope]]**，当函数创建的时候，就会保存所有父变量对象到其中，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

举个例子：

```JavaScript
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的[[scope]]为：

```JavaScript
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

### 函数激活

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```JavaScript
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

### 捋一捋

以下面的例子为例，结合着之前讲的变量对象和执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```JavaScript
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```

执行过程如下：

1.checkscope 函数被创建，保存作用域链到 内部属性[[scope]]

```JavaScript
checkscope.[[scope]] = [
    globalContext.VO
];
```

2.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```JavaScript
ECStack = [
    checkscopeContext,
    globalContext
];
```

3.checkscope 函数并不立刻执行，开始做准备工作，第一步：复制函数[[scope]]属性创建作用域链

```JavaScript
checkscopeContext = {
    Scope: checkscope.[[scope]],
}
```

4.第二步：用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```JavaScript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```

5.第三步：将活动对象压入 checkscope 作用域链顶端

```JavaScript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```

6.准备工作做完，开始执行函数，随着函数的执行，修改 AO 的属性值

```JavaScript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```

7.查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```JavaScript
ECStack = [
    globalContext
];
```

## 答案来了

首先是A：

执行过程如下：

1.执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈

```
ECStack = [
   globalContext
];
```

2.全局上下文初始化

```
globalContext = {
    VO: [global],
    Scope: [globalContext.VO],
    this: globalContext.VO
}
```

2.初始化的同时，checkscope 函数被创建，保存作用域链到函数的内部属性[[scope]]

```
checkscope.[[scope]] = [
  globalContext.VO
];
```

3.执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

```
ECStack = [
    checkscopeContext,
    globalContext
];
```

4.checkscope 函数执行上下文初始化：

1. 复制函数 [[scope]] 属性创建作用域链，
2. 用 arguments 创建活动对象，
3. 初始化活动对象，即加入形参、函数声明、变量声明，
4. 将活动对象压入 checkscope 作用域链顶端。

同时 f 函数被创建，保存作用域链到 f 函数的内部属性[[scope]]

```
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope: undefined,
        f: reference to function f() {}
    },
    Scope: [AO, globalContext.VO],
    this: undefined
}
```

5.执行 f 函数，创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈

```
ECStack = [
    fContext,
    checkscopeContext,
    globalContext
];
```

6.f 函数执行上下文初始化, 以下跟第 4 步相同：

1. 复制函数 [[scope]] 属性创建作用域链
2. 用 arguments 创建活动对象
3. 初始化活动对象，即加入形参、函数声明、变量声明
4. 将活动对象压入 f 作用域链顶端

```
fContext = {
    AO: {
        arguments: {
            length: 0
        }
    },
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
    this: undefined
}
```

7.f 函数执行，沿着作用域链查找 scope 值，返回 scope 值

8.f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

```
ECStack = [
   checkscopeContext,
   globalContext
];
```

9.checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

```
ECStack = [
  globalContext
];
```

如果你理解了A的执行流程，那么B的流程在细节上一致，唯一的区别在于B的环境栈变化不一样

```javascript
A: contextStack = [globalContext] ---> contextStack = [checkscopeContext, globalContext] ---> contextStack = [fContext, checkscopeContext, globalContext] ---> contextStack = [checkscopeContext, globalContext] ---> contextStack = [globalContext]

B: contextStack = [globalContext] ---> contextStack = [checkscopeContext, globalContext] ---> contextStack = [fContext, globalContext] ---> contextStack = [globalContext]
```

也就是说，真要说这两段代码有啥不同，那就是他们执行过程中环境栈的变化不一样，其他的两种方式都一样。

其实对于理解这两段代码而言最根本的一点在于，javascript是使用静态作用域的语言，他的作用域在函数创建的时候便已经确定(不含arguments)。

## 引申

这样一段代码

```JavaScript
function setFirstName(firstName){

    return function(lastName){
        return firstName+" "+lastName;
    }
}

var setLastName = setFirstName("kuitos");
var name = setLastName("lau");


// 乍看之下这段代码没有任何问题，但是世界就是这样，大部分东西都禁不起考究。
// 调用setFirstName函数时返回一个匿名函数，该匿名函数会持有setFirstName函数作用域的变量对象(里面包含arguments和firstName)，不管匿名函数是否会使用该变量对象里的信息，这个持有逻辑均不会改变。
// 也就是当setFirstName函数执行完之后其执行环境被销毁，但是他的变量对象会一直保存在内存中不被销毁(因为被匿名函数hold)。同样的，垃圾回收机制会因为变量对象被一直hold而不做回收处理。这个时候内存泄露就发生了。这时候我们需要做手动释放内存的处理。like this:
setLastName = null;
// 由于匿名函数的引用被置为null，那么其hold的setFirstName的活动对象就能被安全回收了。
// 当然，现代浏览器引擎(以V8为首)都会尝试回收闭包所占用的内存，所以这一点我们也不必过多处理。
```

ps：最后，关于闭包引起的内存泄露那都是因为浏览器的gc问题(IE8以下为首)导致的，跟js本身没有关系。

## 关于ES6的块级作用域

在 ES6 之前，ES 的作用域只有两种：全局作用域和函数作用域。

* **全局作用域**中的对象在代码中的任何地方都能访问，其生命周期伴随着页面的生命周期。

* **函数作用域**就是在函数内部定义的变量或者函数，并且定义的变量或者函数只能在函数内部被访问。函数执行结束之后，函数内部定义的变量会被销毁。

**ES6 引入了 let 和 const 关键字，从而使 JavaScript 拥有了块级作用域**

let 和 const 定义的变量与 var 不同，它们在编译阶段会放到**词法环境（Lexical Environment)中**。

由此可以将 执行上下文 抽象为：

```javascript
executionContext：{
    variable environment: {
        variable object：vars,functions,arguments,
        scope chain: variable object + all parents scopes
    }
    lexical environment: let,const
    thisValue: context object
}
```

用一段代码来分析：

```javascript
function foo(){
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b) 
    console.log(c)
    console.log(d)
}   
foo()
```

**执行过程**

**第一步编译并创建执行上下文**

<img src="https://static001.geekbang.org/resource/image/f9/67/f9f67f2f53437218baef9dc724bd4c67.png" alt="img" style="zoom:50%;" />

* 函数内部通过 var 声明的变量，在编译阶段全都被存放到变量环境里面了。
* 通过 let 声明的变量，在编译阶段会被存放到词法环境（Lexical Environment）中。
* 在函数的作用域块内部，通过 let 声明的变量并没有被存放到词法环境中。

**第二步继续执行代码**

<img src="https://static001.geekbang.org/resource/image/7e/fa/7e0f7bc362e0dea21d27dc5fb08d06fa.png" alt="img" style="zoom:50%;" />

* 当进入函数的作用域块时，作用域块中通过 let 声明的变量，会被存放在词法环境的一个单独的区域中，这个区域中的变量并不影响作用域块外面的变量

* 其实，**在词法环境内部，维护了一个小型栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出，这就是词法环境的结构。**

* 当执行到作用域块中的 `console.log(a)` 时，需要在词法环境和变量环境中查找 变量a的值，具体查找方式是：**沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给 JavaScript 引擎，如果没有查找到，那么继续在变量环境中查找。**

  <img src="https://static001.geekbang.org/resource/image/06/08/06c06a756632acb12aa97b3be57bb908.png" alt="img" style="zoom:50%;" />

* 当作用域块执行结束后，其内部定义的变量就会从词法环境的栈顶唐初，最终的执行上下文如图：

  <img src="https://static001.geekbang.org/resource/image/d4/28/d4f99640d62feba4202aa072f6369d28.png" alt="img" style="zoom:50%;" />

以上就是词法环境的结构和工作机制，**块级作用域就是通过词法环境的栈结构来实现的，而变量提升是通过变量环境来实现，通过这两者的结合，JavaScript 引擎也就同时支持了变量提升和块级作用域了。**

## 参考

[[翻译]JS的执行上下文和堆栈详解(What is the Execution Context & Stack in JavaScript?)](https://pjf.name/blogs/what-is-execution-context-and-stack-in-javascript.html)

[冴羽的博客](https://github.com/mqyqingfeng/Blog)

[一道js面试题引发的思考](https://github.com/kuitos/kuitos.github.io/issues/18)

[《浏览器工作原理与实践》](https://time.geekbang.org/column/intro/216)

