## 引入

```javascript

var bar = {
    myName:"time.geekbang.com",
    printName: function () {
        console.log(myName)
    }    
}
function foo() {
    let myName = "极客时间"
    return bar.printName
}
let myName = "极客邦"
let _printName = foo()
_printName() //极客邦
bar.printName() //极客邦
```

两者输出均为“极客邦”，因为在 printName 函数中使用的变量 myName 是属于全局作用域下的。这是由 JavaScript 的词法作用域决定的。

但是，**在对象内部的方法中使用对象内部的属性是一个非常普遍的需求**。JavaScript 基于这个需求，搞出了另一套 **this机制**。

## this 是什么

前面介绍 JavaScript 代码执行流程的时候，提到执行上下文包含 变量环境、词法环境、作用域链，还有一个接下来要介绍的 **this**。

**this 是和执行上下文绑定的。**执行上下文分为全局执行上下文、函数执行上下文和eval执行上下文，对应的this为全局执行上下文的this，函数执行上下文的this，eval中的this。

**this 与作用域链没有关联。**两者是不同的机制。

### 全局执行上下文的 this

全局执行上下文中的 this 指向 window 对象。

### 函数执行上下文中的 this

可以通过以下方法来设置函数执行上下文中的 this 值。

**1. 通过函数的 call 和 apply 方法设置**

**2.通过对象调用方法设置**

```javascript
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
  }
}
myObj.showThis() // myObj 可以认为 myObj.showThis.call(myObj)
var foo = myObj.showThis
foo() // window对象
```

* **在全局环境中调用一个函数，函数内部的 this 指向的是全局变量 window。**
* **通过一个对象来调用其内部的一个方法，该方法的执行上下文中的 this 指向对象本身。**

**3.通过构造函数中设置**

```javascript
function CreateObj(){
    this.name = 'KY'
}
var myObj = new CreateObj() //构造函数中的this指向myObj
```

## this的设计缺陷以及应对方案

**嵌套函数中的this不会从外层函数中继承**

```javascript
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
    function bar(){console.log(this)}  //window
    bar()
  }
}
myObj.showThis()
```

函数 bar 中的 this 指向的是全局 window 对象。

**技巧**

在 showThis 函数中声明一个变量 self 用来保存 this，然后在 bar 函数中使用 self。**把 this 体系转换为了作用域的体系。**

```javascript
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
    var self = this
    function bar(){
      self.name = "极客邦"
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

**也可以使用箭头函数**

```javascript
var myObj = {
  name : "极客时间", 
  showThis: function(){
    console.log(this)
    var bar = ()=>{
      this.name = "极客邦"
      console.log(this)
    }
    bar()
  }
}
myObj.showThis()
console.log(myObj.name)
console.log(window.name)
```

 ES6 中的箭头函数并不会创建其自身的执行上下文，所以箭头函数中的 this 取决于它的外部函数。