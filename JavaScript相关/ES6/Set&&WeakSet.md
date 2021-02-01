# Set && WeakSet

## Set

### 基本

它类似于数组，但成员的值都是唯一的，没有重复。

#### 初始化

Set 本身是一个构造函数，用来生成 Set 数据结构。

```js
let set = new Set();
```

Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

```js
let set = new Set([1, 2, 3, 4, 4]);
console.log(set); // Set(4) {1, 2, 3, 4}

set = new Set(document.querySelectorAll('div'));
console.log(set.size); // 66

set = new Set(new Set([1, 2, 3, 4]));
console.log(set.size); // 4
```

1. **数组去重的2种方法**

   ```js
   [...new Set(array)]
   
   Array.from(new Set(array))
   ```

2. **向Set加入值不会发生类型转换，所以5和“5”是两个不同的值。Set内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（`===`），主要的区别是向 Set 加入值时认为`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。两个对象总是不相等的**

   ```js
   let set = new Set();
   let a = NaN;
   let b = NaN;
   set.add(a);
   set.add(b);
   set // Set {NaN}
   
   let set = new Set();
   set.add({});
   set.size // 1
   set.add({});
   set.size // 2
   ```

#### 属性和方法

操作方法有：

1. add(value)：添加某个值，返回 Set 结构本身。
2. delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
3. has(value)：返回一个布尔值，表示该值是否为 Set 的成员。
4. clear()：清除所有成员，无返回值。

举个例子：

```js
let set = new Set();
console.log(set.add(1).add(2)); // Set [ 1, 2 ]

console.log(set.delete(2)); // true
console.log(set.has(2)); // false

console.log(set.clear()); // undefined
console.log(set.has(1)); // false
```

之所以每个操作都 console 一下，就是为了让大家注意每个操作的返回值。

遍历方法有：

1. keys()：返回键名的遍历器
2. values()：返回键值的遍历器
3. entries()：返回键值对的遍历器
4. forEach()：使用回调函数遍历每个成员，无返回值

**注意 keys()、values()、entries() 返回的是遍历器**

```js
let set = new Set(['a', 'b', 'c']);
console.log(set.keys()); // SetIterator {"a", "b", "c"}
console.log([...set.keys()]); // ["a", "b", "c"]

let set = new Set(['a', 'b', 'c']);
console.log(set.values()); // SetIterator {"a", "b", "c"}
console.log([...set.values()]); // ["a", "b", "c"]

let set = new Set(['a', 'b', 'c']);
console.log(set.entries()); // SetIterator {"a", "b", "c"}
console.log([...set.entries()]); // [["a", "a"], ["b", "b"], ["c", "c"]]

let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(key + ': ' + value));
// 1: 1
// 2: 2
// 3: 3
```

属性：

1. Set.prototype.constructor：构造函数，默认就是 Set 函数。
2. Set.prototype.size：返回 Set 实例的成员总数。

#### 用法

1. 数组去重

2. 并集，交集，差集

   ```js
   let a = new Set([1, 2, 3]);
   let b = new Set([4, 3, 2]);
   
   // 并集
   let union = new Set([...a, ...b]);
   // Set {1, 2, 3, 4}
   
   // 交集
   let intersect = new Set([...a].filter(x => b.has(x)));
   // set {2, 3}
   
   // 差集
   let difference = new Set([...a].filter(x => !b.has(x)));
   // Set {1}
   ```

   

## WeakSet

### 含义

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，**WeakSet 的成员只能是对象，而不能是其他类型的值。**

```javascript
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
```

上面代码试图向 WeakSet 添加一个数值和`Symbol`值，结果报错，因为 WeakSet 只能放置对象。

其次，**WeakSet 中的对象都是弱引用**，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为`0`，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

这些特点同样适用于本章后面要介绍的 WeakMap 结构。

### 语法

WeakSet 是一个构造函数，可以使用`new`命令，创建 WeakSet 数据结构。

```javascript
const ws = new WeakSet();
```

作为构造函数，WeakSet 可以接受一个数组或类似数组的对象作为参数。（实际上，任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数。）该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。

```javascript
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

注意，是`a`数组的成员成为 WeakSet 的成员，而不是`a`数组本身。这意味着，数组的成员只能是对象。

```javascript
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

上面代码中，数组`b`的成员不是对象，加入 WeakSet 就会报错。

WeakSet 结构有以下三个**方法**。

- add(value)：向 WeakSet 实例添加一个新成员。
- delete(value)：清除 WeakSet 实例的指定成员。
- has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

```javascript
const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
```

WeakSet 没有`size`属性，没有办法遍历它的成员。

```javascript
ws.size // undefined
ws.forEach // undefined

ws.forEach(function(item){ console.log('WeakSet has ' + item)})
// TypeError: undefined is not a function
```

上面代码试图获取`size`和`forEach`属性，结果都不能成功。

WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

下面是 WeakSet 的另一个例子。

```javascript
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```

上面代码保证了`Foo`的实例方法，只能在`Foo`的实例上调用。这里使用 WeakSet 的好处是，`foos`对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑`foos`，也不会出现内存泄漏。





