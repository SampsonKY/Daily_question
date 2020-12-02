# class

## 基本语法

### 简介

JavaScript 语言中，生成实例对象的传统方法是通过构造函数。

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```
ES6写法：
```javascript
class Point {
  constructor(x, y) { //构造方法
    this.x = x;       //this关键字则代表实例对象
    this.y = y;
  }

  toString() {        //定义类的方法时，前面不能加function
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

**类的数据类型就是函数，类本身就指向构造函数。**

```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
Point.__proto__ === Funtion.prototype
```

**在类的实例上面调用方法，其实就是调用原型上的方法。**

```javascript
class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
```

**类的所有方法都定义在类的原型上，可以使用Object.assign方法一次性向类添加多个方法**

```javascript
class Point {
    constructor(){
        
    }
}
Object.assign(Point.prototype,{
    toString(){},
    toValue(){}
})
```

**类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与ES5不一致**

### constructor方法

`constructor`方法是类的默认方法，通过`new`命令生成对象实例时，**自动调用**该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。

`constructor`方法默认返回实例对象（即`this`）。

类必须使用`new`调用，否则会报错

### 类的实例对象

**与 ES5 一样，实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）。**

```javascript
//定义类
class Point {

  constructor(x, y) {
    this.x = x; //实例属性
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

**与 ES5 一样，类的所有实例共享一个原型对象。**

```javascript
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__
//true
```

### 取值函数（getter）和存值函数（setter）

与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

上面代码中，`prop`属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

存值函数和取值函数是设置在属性的 **Descriptor** 对象上的。

```javascript
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```

上面代码中，存值函数和取值函数是定义在`html`属性的**描述对象**上面，这与 ES5 完全一致。

### 注意

**采用 Class 表达式，可以写出立即执行的 Class。**

```javascript
//class表达式
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
//立即执行
let person = new class { 
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

**类不存在变量提升。**

**类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式**

**`name`属性总是返回紧跟在`class`关键字后面的类名。**

**类的方法内部如果含有`this`，它默认指向类的实例。**

但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，`printName`方法中的`this`，默认指向`Logger`类的实例。但是，如果将这个方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错。

一个比较简单的解决方法是，**在构造方法中绑定`this`**，这样就不会找不到`print`方法了。

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

另一种解决方法是使用箭头函数。

```javascript
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```

箭头函数内部的`this`总是指向**定义时所在的对象**。上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以`this`会总是指向实例对象。

### 私有方法和私有属性

**提案：在属性名前使用#**

模拟实现私有方法：

一种做法是在命名上加以区别。

```javascript
class Widget {

  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}
```

上面代码中，`_bar`方法前面的下划线，表示这是一个只限于内部使用的私有方法。但是，这种命名是不保险的，在类的外部，还是可以调用到这个方法。

另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的。

```javascript
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```

上面代码中，`foo`是公开方法，内部调用了`bar.call(this, baz)`。这使得`bar`实际上成为了当前模块的私有方法。

还有一种方法是利用`Symbol`值的唯一性，将私有方法的名字命名为一个`Symbol`值。

```javascript
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```

### Class静态属性，静态方法，实例属性

如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“**静态方法**”。

父类的静态方法，可以被子类继承。

如果静态方法中包含`this`关键字，这个`this`指的是类，而不是实例。

静态方法也是可以从`super`对象上调用的。

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

**实例属性**除了定义在`constructor()`方法里面的`this`上面，也可以定义在类的最顶层。

```javascript
class foo {
  bar = 'hello';
  baz = 'world';

  constructor() {
    // ...
  }
}
```

**静态属性**指的是 Class 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性。

```javascript
// 老写法
class Foo {
  // ...
}
Foo.prop = 1;

// 新写法
class Foo {
  static prop = 1;
}
```

### new.target属性

`new`是从构造函数生成实例对象的命令。ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```javascript
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4); // 输出 true
```

子类继承父类时，`new.target`会返回子类。通过这个特性可以写出不能独立使用，必须继承后才能使用的类。

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

## 继承

 ### 简介

* Class 可以通过`extends`关键字实现继承。

* **子类必须在`constructor`方法中调用`super`方法**，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。

* ES5 的继承，实质是先创造子类的实例对象`this`，然后再将父类的方法添加到`this`上面（`Parent.apply(this)`）。**ES6 的继承机制**完全不同，实质是先将父类实例对象的属性和方法，加到`this`上面（所以必须先调用`super`方法），然后再用子类的构造函数修改`this`。

* 如果子类没有定义`constructor`方法，这个方法会被默认添加。

* 在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y);
    this.color = color; 
  }
}
```

### super关键字

`super`这个关键字，既可以当作**函数**使用，也可以当作**对象**使用。

**第一种情况**，`super`作为函数调用时，代表**父类的构造函数**。ES6 要求，子类的构造函数必须执行一次`super`函数。并且只能用在子类的构造函数中。

```javascript
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```

上面代码中，子类`B`的构造函数之中的`super()`，代表调用父类的构造函数。这是必须的，否则 JavaScript 引擎会报错。

注意，`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

**第二种情况**，`super`作为对象时，在**普通方法**中，指向**父类的原型对象**；在**静态方法**中，指向**父类**。

```javascript
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
   super();
   console.log(super.p()); // super.p()相当于A.prototype.p()
  }
}

let b = new B();
```

ES6 规定，在子类**普通方法**中通过`super`调用父类的方法时，方法内部的**`this`指向当前的子类实例**。由于`this`指向子类实例，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x=3; //相当于 this.x=3
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 3
```

在子类的**静态方法**中通过`super`调用父类的方法时，方法内部的**`this`指向当前的子类**，而不是子类的实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;//子类的静态方法
B.m() // 3
```

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用`super`关键字。

```javascript
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

### 类的 `prototype` 属性和`__proto__`属性

Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在**两条继承链**。

（1）子类的`__proto__`属性，表示**构造函数的继承**，总是指向父类。

（2）子类`prototype`属性的`__proto__`属性，表示**方法的继承**，总是指向父类的`prototype`属性。ES5中只有这一条。

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

原因：**类的继承是按照下面模式实现的**

```javascript
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
//等同于 B.prototype.__proto__ = A.prototype
//等同于 B.prototype = Object.create(A.prototype)

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
// 等同于 B.__proto__ = A
const b = new B();

//Object.setPrototypeOf方法的实现
Object.setPrototypeOf = (obj, proto) =>{
    obj.__proto__ = proto;
    return obj
}
```

**理解**：作为一个对象，子类（`B`）的原型（`__proto__`属性）是父类（`A`）；作为一个构造函数，子类（`B`）的原型对象（`prototype`属性）是父类的原型对象（`prototype`属性）的实例。

下面，讨论两种情况。第一种，**子类继承`Object`类。**

```javascript
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

这种情况下，`A`其实就是构造函数`Object`的复制，`A`的实例就是`Object`的实例。

第二种情况，**不存在任何继承。**

```javascript
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

这种情况下，`A`作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承`Function.prototype`。但是，`A`调用后返回一个空对象（即`Object`实例），所以`A.prototype.__proto__`指向构造函数（`Object`）的`prototype`属性。

### Object.getPrototypeOf()

`Object.getPrototypeOf`方法可以用来从子类上获取父类。

```javascript
Object.getPrototypeOf(ColorPoint) === Point
Object.getPrototypeOf(ColorPoint.prototype) === Point.prototype
// true
```

因此，可以使用这个方法判断，一个类是否继承了另一个类。

### 原生构造函数的继承

原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。

- Boolean()
- Number()
- String()
- Array()
- Date()
- Function()
- RegExp()
- Error()
- Object()

**ES5**子类无法获得原生构造函数的内部属性，导致**无法继承原生构造函数**。ES5 是先新建子类的实例对象`this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数

**ES6 允许继承原生构造函数**定义子类，因为 ES6 是先新建父类的实例对象`this`，然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。下面是一个继承`Array`的例子。

```javascript
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert();
x // [1, 2]
```

