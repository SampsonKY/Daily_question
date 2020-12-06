# Map && WeakMap

## Map

### 基础

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

1. **任何具有Iterator接口且每个成员都是一个双元素数组的数据结构都可以当作Map构造函数的参数**

   ```javascript
   const set = new Set([
     ['foo', 1],
     ['bar', 2]
   ]);
   const m1 = new Map(set);
   m1.get('foo') // 1
   
   const m2 = new Map([['baz', 3]]);
   const m3 = new Map(m2);
   m3.get('baz') // 3
   ```

2. **如果对同一个键多次赋值，后面的值将覆盖前面的值。如果读取一个未知的键，则返回`undefined`。**

3. **Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。**

   ```javascript
   const map = new Map();
   
   const k1 = ['a'];
   const k2 = ['a'];
   
   map
   .set(k1, 111)
   .set(k2, 222);
   
   map.get(k1) // 111
   map.get(k2) // 222
   ```

4. **如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如`0`和`-0`就是一个键，布尔值`true`和字符串`true`则是两个不同的键。另外，`undefined`和`null`也是两个不同的键。虽然`NaN`不严格相等于自身，但 Map 将其视为同一个键。**

   ```javascript
   let map = new Map();
   
   map.set(-0, 123);
   map.get(+0) // 123
   
   map.set(true, 1);
   map.set('true', 2);
   map.get(true) // 1
   
   map.set(undefined, 3);
   map.set(null, 4);
   map.get(undefined) // 3
   
   map.set(NaN, 123);
   map.get(NaN) // 123
   ```

### 属性与方法

属性和操作方法

1. **size**属性，返回Map结构的成员总数
2. **set(key,value)**——-`set`方法设置键名`key`对应的键值为`value`，然后返回整个 Map 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。

3. **get(key)**——-`get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

4. **has(key)**——-`has`方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
5. **delete(key)**——-`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`。
6. **clear()**——`clear`方法清除所有成员，没有返回值。

遍历方法：

1. **keys()**---返回键名的遍历器。
2. **values()**—–返回键值的遍历器。
3. **entries()**—–返回所有成员的遍历器。
4. **forEach()**——遍历 Map 的所有成员。

需要特别注意的是，Map 的遍历顺序就是插入顺序。

### 与其他数据结构的转换

1. **Map转为数组**

   ```javascript
   const myMap = new Map()
     .set(true, 7)
     .set({foo: 3}, ['abc']);
   [...myMap]
   // [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
   ```

2. **数组转为Map**

   ```javascript
   new Map([
     [true, 7],
     [{foo: 3}, ['abc']]
   ])
   ```

3. **Map转为对象**

   如果所有 Map 的键都是字符串，它可以无损地转为对象。

   ```javascript
   function strMapToObj(strMap) {
     let obj = Object.create(null);
     for (let [k,v] of strMap) {
       obj[k] = v;
     }
     return obj;
   }
   
   const myMap = new Map()
     .set('yes', true)
     .set('no', false);
   strMapToObj(myMap)
   // { yes: true, no: false }
   ```

   如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。

4. **对象转为Map**

   ```javascript
   //1
   let obj = {"a":1, "b":2};
   let map = new Map(Object.entries(obj));
   //2
   function objToStrMap(obj) {
     let strMap = new Map();
     for (let k of Object.keys(obj)) {
       strMap.set(k, obj[k]);
     }
     return strMap;
   }
   
   objToStrMap({yes: true, no: false})
   // Map {"yes" => true, "no" => false}
   ```

## WeakMap

### 特性

**1. WeakMap 只接受对象作为键名**

```js
const map = new WeakMap();
map.set(1, 2);
// TypeError: Invalid value used as weak map key
map.set(null, 2);
// TypeError: Invalid value used as weak map key
```

**2. WeakMap 的键名所引用的对象是弱引用**

这句话其实让我非常费解，我个人觉得这句话真正想表达的意思应该是：

> WeakMaps hold "weak" references to key objects,

翻译过来应该是 WeakMaps 保持了对键名所引用的对象的弱引用。

我们先聊聊弱引用：

> 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。

在 JavaScript 中，一般我们创建一个对象，都是建立一个强引用：

```js
var obj = new Object();
```

只有当我们手动设置 `obj = null` 的时候，才有可能回收 obj 所引用的对象。

而如果我们能创建一个弱引用的对象：

```js
// 假设可以这样创建一个
var obj = new WeakObject();
```

我们什么都不用做，只用静静的等待垃圾回收机制执行，obj 所引用的对象就会被回收。

我们再来看看这句：

> WeakMaps 保持了对键名所引用的对象的弱引用

正常情况下，我们举个例子：

```js
const key = new Array(5 * 1024 * 1024);
const arr = [
  [key, 1]
];
```

使用这种方式，我们其实建立了 arr 对 key 所引用的对象(我们假设这个真正的对象叫 Obj)的强引用。

所以当你设置 `key = null` 时，只是去掉了 key 对 Obj 的强引用，并没有去除 arr 对 Obj 的强引用，所以 Obj 还是不会被回收掉。

Map 类型也是类似：

```js
let map = new Map();
let key = new Array(5 * 1024 * 1024);

// 建立了 map 对 key 所引用对象的强引用
map.set(key, 1);
// key = null 不会导致 key 的原引用对象被回收
key = null;
```

我们可以通过 Node 来证明一下这个问题：

```js
// 允许手动执行垃圾回收机制
node --expose-gc

global.gc();
// 返回 Nodejs 的内存占用情况，单位是 bytes
process.memoryUsage(); // heapUsed: 4640360 ≈ 4.4M

let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);
global.gc();
process.memoryUsage(); // heapUsed: 46751472 注意这里大约是 44.6M

key = null;
global.gc();
process.memoryUsage(); // heapUsed: 46754648 ≈ 44.6M

// 这句话其实是无用的，因为 key 已经是 null 了
map.delete(key);
global.gc();
process.memoryUsage(); // heapUsed: 46755856 ≈ 44.6M
```

如果你想要让 Obj 被回收掉，你需要先 `delete(key)` 然后再 `key = null`:

```js
let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);
map.delete(key);
key = null;
```

我们依然通过 Node 证明一下：

```js
node --expose-gc

global.gc();
process.memoryUsage(); // heapUsed: 4638376 ≈ 4.4M

let map = new Map();
let key = new Array(5 * 1024 * 1024);
map.set(key, 1);
global.gc();
process.memoryUsage(); // heapUsed: 46727816 ≈ 44.6M

map.delete(key);
global.gc();
process.memoryUsage(); // heapUsed: 46748352 ≈ 44.6M

key = null;
global.gc();
process.memoryUsage(); // heapUsed: 4808064 ≈ 4.6M
```

这个时候就要说到 WeakMap 了：

```js
const wm = new WeakMap();
let key = new Array(5 * 1024 * 1024);
wm.set(key, 1);
key = null;
```

当我们设置 `wm.set(key, 1)` 时，其实建立了 wm 对 key 所引用的对象的弱引用，但因为 `let key = new Array(5 * 1024 * 1024)` 建立了 key 对所引用对象的强引用，被引用的对象并不会被回收，但是当我们设置 `key = null` 的时候，就只有 wm 对所引用对象的弱引用，下次垃圾回收机制执行的时候，该引用对象就会被回收掉。

我们用 Node 证明一下：

```js
node --expose-gc

global.gc();
process.memoryUsage(); // heapUsed: 4638992 ≈ 4.4M

const wm = new WeakMap();
let key = new Array(5 * 1024 * 1024);
wm.set(key, 1);
global.gc();
process.memoryUsage(); // heapUsed: 46776176 ≈ 44.6M

key = null;
global.gc();
process.memoryUsage(); // heapUsed: 4800792 ≈ 4.6M
```

所以 WeakMap 可以帮你省掉手动删除对象关联数据的步骤，所以当你不能或者不想控制关联数据的生命周期时就可以考虑使用 WeakMap。

总结这个弱引用的特性，就是 WeakMaps 保持了对键名所引用的对象的弱引用，即垃圾回收机制不将该引用考虑在内。只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

也正是因为这样的特性，WeakMap 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakMap 不可遍历。

所以 WeakMap 不像 Map，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有 size 属性，也不支持 clear 方法，所以 WeakMap只有**四个方法可用：get()、set()、has()、delete()。**

### 应用

#### 1. 在 DOM 对象上保存相关数据

传统使用 jQuery 的时候，我们会通过 `$.data() `方法在 DOM 对象上储存相关信息(就比如在删除按钮元素上储存帖子的 ID 信息)，jQuery 内部会使用一个对象管理 DOM 和对应的数据，当你将 DOM 元素删除，DOM 对象置为空的时候，相关联的数据并不会被删除，你必须手动执行 `$.removeData() `方法才能删除掉相关联的数据，WeakMap 就可以简化这一操作：

```js
let wm = new WeakMap(), 
element = document.querySelector(".element");
wm.set(element, "data");

let value = wm.get(elemet);
console.log(value); // data

element.parentNode.removeChild(element);
element = null;
```

#### 2. 数据缓存

从上一个例子，我们也可以看出，当我们需要关联对象和数据，比如在不修改原有对象的情况下储存某些属性或者根据对象储存一些计算的值等，而又不想管理这些数据的死活时非常适合考虑使用 WeakMap。数据缓存就是一个非常好的例子：

```js
const cache = new WeakMap();
function countOwnKeys(obj) {
    if (cache.has(obj)) {
        console.log('Cached');
        return cache.get(obj);
    } else {
        console.log('Computed');
        const count = Object.keys(obj).length;
        cache.set(obj, count);
        return count;
    }
}
```

#### 3. 私有属性

WeakMap 也可以被用于实现私有变量，不过在 ES6 中实现私有变量的方式有很多种，这只是其中一种：

```js
const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        privateData.set(this, { name: name, age: age });
    }

    getName() {
        return privateData.get(this).name;
    }

    getAge() {
        return privateData.get(this).age;
    }
}

export default Person;
```