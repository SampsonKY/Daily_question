# Symbol

## 基础

ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。

**1. Symbol 值通过 Symbol 函数生成，使用 typeof，结果为 "symbol"**

```js
var s = Symbol();
console.log(typeof s); // "symbol"
```

**2. Symbol 函数前不能使用 new 命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。**

**3. instanceof 的结果为 false**

```js
var s = Symbol('foo');
console.log(s instanceof Symbol); // false
```

**4. Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。可以通过实例属性 description 直接返回Symbol的描述。**

```js
var s1 = Symbol('foo');
console.log(s1); // Symbol(foo)

s1.description //'foo'
```

**5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。**

```js
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
```

**6. Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。**

```js
// 没有参数的情况
var s1 = Symbol();
var s2 = Symbol();

console.log(s1 === s2); // false

// 有参数的情况
var s1 = Symbol('foo');
var s2 = Symbol('foo');

console.log(s1 === s2); // false
```

**7. Symbol 值不能与其他类型的值进行运算，会报错。**

```js
var sym = Symbol('My symbol');

console.log("your symbol is " + sym); // TypeError: can't convert symbol to string
```

**8. Symbol 值可以显式转为字符串和布尔值，但不可以转为数值**

```js
var sym = Symbol('My symbol');

console.log(String(sym)); // 'Symbol(My symbol)'
console.log(sym.toString()); // 'Symbol(My symbol)'
Boolean(sym)//true
```

**9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。**

```js
var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
console.log(a[mySymbol]); // "Hello!"
//注意，Symbol值作为对象属性名时不能使用点运算符
```

**10. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。Reflect.ownKeys方法可以返回所有类型的键名。**

```js
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
```

**11. 如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。**

```js
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

console.log(s1 === s2); // true
```

**12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。**

```js
var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2) ); // undefined
```

## 用途

### 定义类的私有变量/方法

User.js

```js
const AGE = Symbol()
const GET_AGE = Symbol()
class User {
    constructor(name, sex, age) {
        this.name = name
        this.sex = sex
        this[AGE] = age
        this[GET_AGE] = function () {
            return this[AGE]
        }
    }
    printAge() {
        console.log(this[GET_AGE]())
    }

}
module.exports = User
```

test.js

```js
let User = require('./User')

let u1 = new User('xm', 'M', 18)
let u2 = new User('xh', 'W', 20)
console.log(u1.name) // xm
console.log(u1.age) // undefined
u1.printAge() // 18
console.log(u2.name) // xh
console.log(u2.age) // undefined
u2.printAge() // 20
```

### 运用在单例模式中

**单例模式指，调用一个类并且在任何时候都返回同一个实例。**

Phone.js

```js
class Phone {
    constructor() {
        this.name = '小米'
        this.price = '1999'
    }
}

let key = Symbol.for('Phone')

if (!global[key]) {
    global[key] = new Phone()
}

module.exports = global[key]
```

test.js

```js
let p1 = require('./Phone')
let p2 = require('./Phone')
console.log(p1 === p2) // true
```

### 消除魔法字符串

有这样一种场景，我们想区分两个属性，其实我们并不在意，这两个属性值究竟是什么，我们在意的是，这两个属性绝对要区分开来！例如:

```jsx
var shapeType = { triangle: 'Triangle'};
function getArea(shape, options) { 
    var area = 0; 
    switch (shape) { 
      case shapeType.triangle:
      area = .5 * options.width * options.height; 
      break; 
    } 
    return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
```

这个时候，我们仅仅是想区分各种形状，因为不同的形状用不同的计算面积的公式。这里使用的是triangle的名字叫做‘Triangle’，而是事实上我们不想对triangle去特地取个名，**我们只想要区分triangle这个形状不同于任何其他形状**，那么这个时候Symbol就派上用场啦！

```dart
const shapeType = {
   triangle: Symbol()
};
```

发现了吗？ 也就是说，我们不用非要去给变量赋一个字符串的值，去区分它和别的变量的值不同，因为去给每个变量取个语义化而又不同的值是一件伤脑子的事，**当我们只需要知道每个变量的值都是百分百不同的即可，这时候我们就可以用Symbol**。

## 内置 Symbol 值

**1.Symbol.hasInstance用于判断某对象是否为某构造器的实例。因此你可以用它自定义 instanceof 操作符在某个类上的行为。**

```js
class Array1 {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof Array1); //true
```

**2.Symbol.isConcatSpreadable符号用于配置某对象作为Array.prototype.concat()方法的参数时是否展开其数组元素。**

```js
const alpha = ['a', 'b', 'c'];
const numeric = [1, 2, 3];
let alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", 1, 2, 3]

numeric[Symbol.isConcatSpreadable] = false;
alphaNumeric = alpha.concat(numeric);

console.log(alphaNumeric);
// expected output: Array ["a", "b", "c", Array [1, 2, 3]]
```

**3.Symbol.iterator 为每一个对象定义了默认的迭代器。该迭代器可以被 `for...of` 循环使用。**

```js
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable] // [1, 2, 3]
```

**…..更多参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)**

