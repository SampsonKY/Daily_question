---
title: Js 事件
categories: 前端学习
tags: JavaScript
---

# JS事件

## 一、 事件与事件流

先来看它们的定义：

> **事件**，就是通过文档或浏览器窗口中发生的一些特定的交互瞬间。
>
> **事件**是您在编程时系统内发生的动作或者发生的事情— 系统会在事件出现的时候触发某种信号并且会提供一个自动加载某种动作（例如：运行一些代码）的机制。
>
> **事件流**描述的是从页面中接收事件的顺序。
>
> 事件流包括**事件冒泡**和**事件捕获**，两者分别由微软和网景公司提出。两个概念都是为了解决页面中事件发生顺序的问题。
>
> **事件冒泡**的思想是：从最具体的元素（文档中嵌套层次最深的那个节点）开始接收，然后逐级向上传播到最不具体的节点（文档）。
>
> **事件捕获**的思想是：不太具体的节点应该更早接受到事件，而最具体的节点应该最后接收到事件。
>
> **DOM事件流**：在**DOM2级事件**中规定，事件流包括三个阶段：事件捕获阶段、处于目标阶段、事件冒泡阶段。首先发生的是事件捕获，为截获事件提供了机会；然后是实际的目标接收到事件；最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

比如：

```html
<!DOCTYPE html>
<html>
<head>
	<title>事件</title>
</head>
<body>
	<div>aaaa</div>
</body>
</html>
```

如果单击了`<div>`标签，在事件冒泡的概念下，`click`事件传播顺序：`div -> body -> html -> document`;在事件捕获的概念下,`click`事件传播的顺序：`document -> html -> body -> div`.

在DOM事件流中，实际的目标（`<div>`元素）在捕获阶段不会接收到事件。这意味着在捕获阶段，事件从`document`到`<html>`再到`<body>`就停止了。下一个阶段是“处于目标阶段”，于是事件在`<div>`上发生，并在事件处理中看成冒泡阶段的一部分。然后冒泡阶段发生，事件又传播回文档。

【注意】：对于**事件代理**而言，在事件捕获或事件冒泡阶段处理并没有明显的优劣之分，但由于事件冒泡的事件流模型被所有主流的浏览器兼容，从兼容角度来说，建议使用事件冒泡模型。**最好只在需要在事件到达目标之前截获它的时候将将事件处理程序添加到捕获阶段**。

几个题目，看你是否懂了：

1. 
   ```html
   <div id="s1">s1
       <div id="s2">s2</div>
   </div>
   <script>
       s1.addEventListener("click", function (e) {
           console.log("s1 捕获事件");
       }, true);
       s2.addEventListener("click", function (e) {
           console.log("s2 捕获事件");
       }, true);
       //点击s1，结果为：s1捕获事件
       //点击s2, 结果为：s1捕获事件，s2捕获事件
   </script>
   ```

2. ```html
   <div id="s1">s1
   	<div id="s2">s2</div>
   </div>
   <script>
   	s1.addEventListener("click", function (e) {
   		console.log("s1 冒泡事件");
   	}, false);
   	s2.addEventListener("click", function (e) {
   		console.log("s2 冒泡事件");
   	}, false);
   	//点击s1：s1冒泡事件
   	//点击s2: s2冒泡事件，s1冒泡事件
   </script>
   ```

3. ```html
   <div id="s1">s1
   	<div id="s2">s2</div>
   </div>
   <script>
   	s1.addEventListener("click", function (e) {
   			console.log("s1 冒泡事件");
   		}, false);
   	s2.addEventListener("click", function (e) {
   			console.log("s2 冒泡事件");
   		}, false);
   
   	s1.addEventListener("click", function (e) {
   			console.log("s1 捕获事件");
   		}, true);
   
   	s2.addEventListener("click", function (e) {
   			console.log("s2 捕获事件");
   		}, true);
   		//点击s1: s1冒泡，s1捕获
   		//点击s2: s1捕获事件 s2冒泡事件 s2捕获事件 s1冒泡事件
   </script>
   ```

   当事件捕获和事件冒泡一起存在的情况:

   先记被点击的DOM节点为target节点

   1. document 往 target节点，捕获前进，遇到注册的捕获事件立即触发执行
   2. 到达target节点，触发事件（对于target节点上，是先捕获还是先冒泡则捕获事件和冒泡事件的注册顺序，先注册先执行）
   3. target节点 往 document 方向，冒泡前进，遇到注册的冒泡事件立即触发

   总结：

   - 对于非target节点则先执行捕获在执行冒泡
   - 对于target节点则是先执行先注册的事件，无论冒泡还是捕获

## 二、事件处理程序

> 事件是用户或浏览器自生执行的某种动作。**而响应某个事件的函数就叫做事件处理程序（或事件侦听器）**。

### HTML中的事件处理程序

```html
<input type="button" value="click me" onclick="alert('Clicked')" />
```


* 某个元素支持的每种事件都可以使用一个与相应事件处理程序同名的HTML特性来制定。这个特性的值应该是能够执行的JavaScript代码。
* 在HTML中定义的事件处理程序可以包含要执行的具体动作，也可以调用在页面中其他地方定义的脚本。

**独到之处**：

1. 会创建一个封装着元素属性值的函数。这个函数有一个局部变量`event`，也就是**事件对象**。通过`event`变量，可以直接访问事件对象，不用自己定义，也不用从函数的参数列表中读取。
2. 在这个函数内部，`this`的值等于事件的**目标元素**。
3. 拓展作用域的方式

**缺点**：

1. 存在一个时差问题，因为用户可能会在HTML元素一出现在页面上就触发相应的事件，但当时的事件处理程序有可能尚不具备执行条件。**为此，很多HTML事件处理程序都会被封装在一个`try-catch`块中，以便错误不会浮出水面。**
2. 这样拓展事件处理程序的作用域链在不同浏览器中会导致不同结果。
3. **HTML与JavaScript代码紧密耦合。**

### DOM0级事件处理程序

```javascript
var btn = document.getElementById("myBtn");
btn.onclick = function(){
    alert("Clicked");
};
```

* 将一个函数赋值给一个事件处理程序属性这种传统方法依然被所有现代浏览器所支持的原因是：简单、跨浏览器优势。
* 我们首先要做的就是必须取得一个要操作的对象的引用。
* 每个元素（包括window和document）都有自己的事件处理程序属性，将这种属性的值设为一个函数，就可以指定事件处理程序。

**【注意】**：

1. 使用DOM0级事件方法指定的事件处理程序被认为是**元素的方法**。因此，这时候的事件处理程序是在**元素的作用域**中运行，即**程序中的`this`引用当前元素。**
2. 可以在事件程序中通过`this`访问元素的任何属性和方法。
3. 以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理。
4. 可以通过将事件处理程序设置为`null`来删除DOM0级方法指定的事件处理程序

### DOM2级事件处理程序

```javascript
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function(){
    alert(this.id);
},false);
btn.removeEventListener("click", function(){
    alert("this.id");
},false);
```

* DOM2级事件定义了两个方法，用于指定和删除事件处理程序的操作：`addEventListener()`和`removeEventListener()`。所有DOM节点都包含这两个方法，并且它们都接受3个参数：**要处理的事件名**、**作为事件处理程序的函数**和**一个布尔值**。如果这个布尔值参数为`true`，表示在捕获阶段调用事件处理程序；为`false`表示在冒泡阶段调用事件处理程序。
* 与DOM0级方法一样，这里添加的事件处理程序也是**在其依附的元素的作用域中运行**。
* 使用这种方法的**主要好处**是可以添加多个事件处理程序，并且事件处理程序会按照添加它们的顺序触发。
* 通过传入`addEventListener()`添加的事件处理程序只能用`removeEventListener()`来移除；移除时传入的参数与添加处理程序时使用的参数相同。也意味着通过`addEventListener()`添加的匿名函数无法移除。比如上面的例子。

### IE事件处理程序

```javascript
var btn = document.getElementById("myBtn");
btn.attachEvent("onclick", function(){
    alert(this.id);
});
btn.detachEvent("onclick", function(){
    alert("this.id");
});
```

* IE实现了和DOM中类似的两个方法: `attachEvent()`和`detachEvent()`。这两个方法接收两个参数：**事件处理程序的名称**和**事件处理程序函数**。通过`attachEvent()`添加的事件处理程序都会被添加到冒泡阶段。
* 在IE中使用`attachEvent()`与使用DOM0级方法的主要区别在于事件处理程序中的**作用域**。在使用DOM0级方法的情况下，事件处理程序会在其所属元素的作用域内运行；在使用`attachEvent()`方法的情况下，事件处理程序会在全局作用域中运行，因此`this`等于`window`。
* `attachEvent()`也可以用来为一个元素添加多个事件处理程序。但以相反的顺序被触发。
* 使用 `attachEvent()`添加的事件可以通过`detachEvent()`来移除。条件是必须提供相同的参数。这意味着添加的匿名函数无法移除。

### 跨浏览器的事件处理程序

```javascript
var EventUtil = {
    addHandler: function(element, type, handler){
        if(element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if( element.attachEvent){
            element.attachEvent("on"+type,handler);
        } else{
            element["on"+type] = handler;
        }
    },
    removeHandler:function(element, type, handler){
        if(element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if( element.detachEvent){
            element.detachEvent("on"+type,handler);
        } else{
            element["on"+type] = null;
        }
    }
};

EventUtil.addHandler(btn,"click",handler);
```

## 三、事件对象

在触发DOM上某个事件时，会产生一个事件对象`event`，这个对象中包含所有与事件有关的信息。包括导致事件的元素，事件的类型以及其他与特定事件相关的信息。

### DOM中的事件对象

1.兼容DOM的浏览器会将一个`event`对象传入到事件处理程序中。无论指定事件处理程序时使用什么方法（DOM0级或DOM2级），都会传入`event`对象。

```javascript
btn.onclick = function(event){
    alert(event.type); //"click"
};  
```

2.在通过HTML特性指定事件处理程序时，变量`event`中保存着`event`对象。

```html
<input type="button" value="Click me" onclick="alert(event.type)">
```

以这种方式提供`event`对象，可以让HTML特性事件处理程序与JavaScript函数执行相同的操作。

`event`对象中包含着与创建它的特定事件有关的属性和方法。

* 在事件处理程序内部对象`this`始终等于`currentTarget`的值，而`target`则只包含事件的**实际目标**。
* 要阻止特定事件的默认行为，可以使用`preventDefault()`方法。
* 只有`cancelable`为`true`的事件，才可以使用`preventDefault()`方法
* `stopPropagation()`方法用于立即停止事件在DOM层次中的传播，即进一步取消事件的捕获或冒泡。
* 事件对象的`eventPhase`属性可以用来确定事件当前正位于事件流的哪个阶段。

**只有在事件处理程序执行期间，`event`对象才会存在；一旦事件处理程序执行完成，`event`对象就会被销毁。**

### IE中的事件对象

**情况1**.DOM0级方法添加事件处理程序时，`event`对象作为`window`对象的一个属性存在。

**情况2.**如果事件处理程序是使用`attachEvent()`添加的，那么就会有一个`event`对象作为参数传入事件处理程序函数中。

**情况3**.如果通过HTML特性制定的事件处理程序，那么可以通过一个名叫event的变量来访问event对象。

IE的event对象也包含与创建它的事件相关的属性和方法：

* `cancelBubble`属性  -----  取消冒泡
* `returnValue`属性  ----- 取消事件的默认行为
* `srcElement`属性 ---- 事件的目标
* `type`属性 --- 事件的类型

**因为事件处理程序的作用域是根据指定它的方式来确定的，所以不能认为this会始终等于事件目标。故而，最好还是使用`event.srcElement`比较保险。**

### 跨浏览器的事件对象

```javascript
var EventUtil = {
    addHandler: function(...){...},
    getEvent: function(event){
        return event? event:window.event;
    },
    getTarget: function(event){
        return event.target||event.srcElement;
    },
     preventDefault: function(event){
         if(event.preventDefault){
             event.perventDefalut();
         } else{
             event.returnValue = false;
         }
     },
     removeHandler:....
     
     stopPropagation:function(event){
         if(event.stopPropagation){
             event.stopPropagation();
         } else{
             event.cancelBubble = true;
         }
     }
};
```

## 四、内存和性能

在JavaScript中，添加到页面上的事件处理程序数量直接关系到页面的整体运行性能。导致这一问题的原因有很多，首先，每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。其次，必须事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。

**事件委托**就是解决方案，事件委托利用了事件冒泡，只指定一个事件处理程序就可以管理某一类的所有事件。**使用事件委托，只需要在DOM树中尽量最高的层次上添加一个事件处理程序。**

内存中存有那些“过时不用”的“空事件处理程序”，也是造成web应用程序内存与性能问题的主要原因。在不需要的时候**移除事件处理程序**也是一种解决方案。

## 五、参考

* [JS中事件冒泡与捕获](https://segmentfault.com/a/1190000005654451)
* JavaScript高级程序设计