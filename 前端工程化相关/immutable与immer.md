JavaScript 中的对象一般是可变的（Mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。为了解决这个问题，一般使用深浅拷贝来避免被修改，但这样做造成了 CPU 和内存的浪费。Immutable 可以很好解决这些问题

## Immutable

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 **Persistent Data Structure**（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 **Structural Sharing**（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

具体点来说，immutable 对象数据内部采用是多叉树的结构，凡是有节点被改变，那么它和与它相关的所有上级节点都更新

<img src="https://user-gold-cdn.xitu.io/2019/10/20/16de7a154c8b30b8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="img" style="zoom:80%;" />

**Immutable优点**

* 降低了可变数据带来的复杂度。可变（Mutable）数据耦合了 Time 和 Value 的概念，造成了数据很难被回溯。
* 节省内存。Immutable.js 使用了 Structure Sharing 会尽量复用内存。没有被引用的对象会被垃圾回收。
*  Undo/Redo，Copy/Paste，时间旅行。因为每次数据都是不一样的，只要把这些数据放到一个数组里储存起来，想回退到哪里就拿出对应数据即可，很容易开发出撤销重做这种功能。
* 拥抱函数式编程

**缺点**

* 学习成本
* 增加了资源文件大小
* 容易与原生对象混淆

immutable库有很多，这里主要对比 immutable.js 和 immer.js 这两个库。

## immutable.js

### 基本语法

#### 1.fromJS

它的功能是将 JS 对象转换为 immutable 对象。

```js
import {fromJS} from 'immutable';
const immutableState = fromJS ({
    count: 0
});
```

#### 2. toJS

将 immutable 对象转换为 JS 对象。但是值得注意的是，这个方法并没有在 immutable 库中直接导出，而是需要让 immutable 对象调用。比如:

```
const jsObj = immutableState.toJS ();
```

#### 3.get/getIn

用来获取 immutable 对象属性。通过与 JS 对象的对比来体会一下：

```js
//JS 对象
let jsObj = {a: 1};
let res = jsObj.a;
//immutable 对象
let immutableObj = fromJS (jsObj);
let res = immutableObj.get ('a');
//JS 对象
let jsObj = {a: {b: 1}};
let res = jsObj.a.b;
//immutable 对象
let immutableObj = fromJS (jsObj);
let res = immutableObj.getIn (['a', 'b']);// 注意传入的是一个数组
```

#### 4.set

用来对 immutable 对象的属性赋值。

```js
let immutableObj = fromJS ({a: 1});
immutableObj.set ('a', 2);
```

#### 5. merge

新数据与旧数据对比，旧数据中不存在的属性直接添加，旧数据中已存在的属性用新数据中的覆盖。

```js
let immutableObj = fromJS ({a: 1});
immutableObj.merge ({
    a: 2,
    b: 3
});// 修改了 a 属性，增加了 b 属性
```

### 更多认识

#### 比较

两个 immutable 对象可以使用 `===` 来比较，这样是直接比较内存地址，性能最好。但即使两个对象的值是一样的，也会返回 `false`：

```js
let map1 = Immutable.Map({a:1, b:1, c:1});
let map2 = Immutable.Map({a:1, b:1, c:1});
map1 === map2;             // false
```

为了直接比较对象的值，immutable.js 提供了 `Immutable.is` 来做『值比较』，结果如下：

```js
Immutable.is(map1, map2);  // true
```

`Immutable.is` 比较的是两个对象的 `hashCode` 或 `valueOf`（对于 JavaScript 对象）。由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 `hashCode` 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。

#### 与const和Object.freeze区别

`Object.freeze` 和 ES6 中新加入的 `const` 都可以达到防止对象被篡改的功能，但它们是 shallowCopy 的。对象层级一深就要特殊处理了。

#### Cursor 的概念

由于 Immutable 数据一般嵌套非常深，为了便于访问深层数据，Cursor 提供了可以直接访问这个深层数据的引用。

### 实践

#### 与 React 搭配使用， Pure Render

React 做性能优化时可以使用 `shouldComponentUpdate()`，但它默认返回 `true`，即始终会执行 `render()` 方法，然后做 Virtual DOM 比较，并得出是否需要做真实 DOM 更新，这里往往会带来很多无必要的渲染并成为性能瓶颈。

当然我们也可以在 `shouldComponentUpdate()` 中使用使用 deepCopy 和 deepCompare 来避免无必要的 `render()`，但 **deepCopy 和 deepCompare 一般都是非常耗性能的**。

**Immutable 则提供了简洁高效的判断数据是否变化的方法**，只需 `===` 和 `is` 比较就能知道是否需要执行 `render()`，而这个**操作几乎 0 成本**，所以可以极大提高性能。修改后的 `shouldComponentUpdate` 是这样的：

```js
import { is } from 'immutable';

shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};

  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }

  for (const key in nextProps) {
    if (thisProps[key] !== nextProps[key] || ！is(thisProps[key], nextProps[key])) {
      return true;
    }
  }

  for (const key in nextState) {
    if (thisState[key] !== nextState[key] || ！is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```

#### 与 redux 搭配使用

使用 [redux-immutablejs](https://link.zhihu.com/?target=https%3A//github.com/indexiatech/redux-immutablejs) 来提供支持。

## immer.js

### 基本语法

#### 概念说明

* currentState：被操作对象的最初状态
* draftState：根据 currentState 生成的草稿状态，它是 currentState 的代理，对 draftState 所做的任何修改都将被记录并用于生成 nextState 。在此过程中，currentState 将不受影响
* nextState：根据 draftState 生成的最终状态
* produce 生产：用来生成 nextState 或 producer 的函数
* producer 生产者：通过 produce 生成，用来生产 nextState ，每次执行相同的操作
* recipe 生产机器：用来操作 draftState 的函数

#### 常用 API

* **produce**第一种使用方式

  ```js
  produce(currentState, recipe: (draftState) => void | draftState, ?PatchListener): nextState
  ```

  ```js
  let currentState = {a:[], p:{x:1}}
  let nextState = produce(currentState, (draft)=>{
      draft.a.push(2)
  })
  currentState.a === nextState.a // false
  currentState.p === nextState.p // true
  ```

  通过produce生成的nextState是被冻结的（freeze），当直接修改nextState会报错，这样使其成为了真正的不可变数据。

* **produce**第二种使用方式

  利用高阶函数特点，提前生成一个生产者 producer

  ```js
  produce(recipe: (draftState) => void | draftState, ?PatchListener)(currentState):nextState
  ```

  ```js
  let producer = produce((draft) => {
    draft.x = 2
  });
  let nextState = producer(currentState);
  ```

  **recipe**没有返回值，nextState是根据recipe函数中的draftState生成的；有返回值是根据返回值生成的。

### 用immer优化react项目

#### 优化setState方法

定义一个state对象

```js
state = {
  members: [
    {
      name: 'ronffy',
      age: 30
    }
  ]
}
```

**使用setState**

```JS
const { members } = this.state;
this.setState({
  members: [
    {
      ...members[0],
      age: members[0].age + 1,
    },
    ...members.slice(1),
  ]
})
//函数形式
const { members } = this.state;
this.setState({
  members: [
    {
      ...members[0],
      age: members[0].age + 1,
    },
    ...members.slice(1),
  ]
})
```

**使用immer**

```js
this.setState(produce(draft => {
  draft.members[0].age++;
}))
```

#### 优化reducer

**普通reducer**

```js
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_AGE':
      const { members } = state;
      return {
        ...state,
        members: [
          {
            ...members[0],
            age: members[0].age + 1,
          },
          ...members.slice(1),
        ]
      }
    default:
      return state
  }
}
```

**集合immer,reducer可以怎样写**

```js
const reducer = (state, action) => produce(state, draft => {
  switch (action.type) {
    case 'ADD_AGE':
      draft.members[0].age++;
  }
})
//或者这样
const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'ADD_AGE':
      draft.members[0].age++;
  }
})
```

### immer原理解析

Immer 源码中，使用了一个 ES6 的新特性 Proxy 对象。Proxy 对象允许拦截某些操作并实现自定义行为。

#### Proxy

Proxy 对象接受两个参数，第一个参数是需要操作的对象，第二个参数是设置对应拦截的属性，这里的属性同样也支持 get，set 等等，也就是劫持了对应元素的读和写，能够在其中进行一些操作，最终返回一个 Proxy 对象实例。

``` js
const proxy = new Proxy({}, {
  get(target, key) {
    // 这里的 target 就是 Proxy 的第一个参数对象
    console.log('proxy get key', key)
  },
  set(target, key, value) {
    console.log('value', value)
  }
})

// 所有读取操作都被转发到了 get 方法内部
proxy.info     // 'proxy get key info'

// 所有设置操作都被转发到了 set 方法内部
proxy.info = 1 // 'value 1'
```

上面这个例子中传入的第一个参数是一个空对象，当然我们可以用其他已有内容的对象代替它，也就是函数参数中的 target。

#### immer 中的proxy

**immer 的做法就是维护一份 state 在内部，劫持所有操作，内部来判断是否有变化从而最终决定如何返回。**下面这个例子就是一个构造函数，如果将它的实例传入 Proxy 对象作为第一个参数，就能够后面的处理对象中使用其中的方法：

```js
class Store {
  constructor(state) {
    this.modified = false
    this.source = state
    this.copy = null
  }
  get(key) {
    if (!this.modified) return this.source[key]
    return this.copy[key]
  }
  set(key, value) {
    if (!this.modified) this.modifing()
    return this.copy[key] = value
  }
  modifing() {
    if (this.modified) return
    this.modified = true
    // 这里使用原生的 API 实现一层 immutable，
    // 数组使用 slice 则会创建一个新数组。对象则使用解构
    this.copy = Array.isArray(this.source)
      ? this.source.slice()
      : { ...this.source }
  }
}
```

上面这个 Store 构造函数相比源代码省略了很多判断的部分。实例上面有 modified，source，copy 三个属性，有 get，set，modifing 三个方法。modified 作为内置的 flag，判断如何进行设置和返回。

里面最关键的就应该是 **modifing** 这个函数，如果触发了 setter 并且之前没有改动过的话，就会手动将 modified 这个 flag 设置为 true，并且手动通过原生的 API 实现一层 immutable。

对于 Proxy 的第二个参数，在简版的实现中，我们只是简单做一层转发，任何对元素的读取和写入都转发到 store 实例内部方法去处理。

```js
const PROXY_FLAG = '@@SYMBOL_PROXY_FLAG'
const handler = {
  get(target, key) {
    // 如果遇到了这个 flag 我们直接返回我们操作的 target
    if (key === PROXY_FLAG) return target
    return target.get(key)
  },
  set(target, key, value) {
    return target.set(key, value)
  },
}
```

这里在 getter 里面加一个 flag 的目的就在于将来从 proxy 对象中获取 store 实例更加方便。

最终我们能够完成这个 produce 函数，创建 store 实例后创建 proxy 实例。然后将创建的 proxy 实例传入第二个函数中去。这样无论在内部做怎样有副作用的事情，最终都会在 store 实例内部将它解决。最终得到了修改之后的 proxy 对象，而 proxy 对象内部已经维护了两份 state ，通过判断 modified 的值来确定究竟返回哪一份。

```js
function produce(state, producer) {
  const store = new Store(state)
  const proxy = new Proxy(store, handler)
  
  // 执行我们传入的 producer 函数，我们实际操作的都是 proxy 实例，所有有副作用的操作都会在 proxy 内部进行判断，是否最终要对 store 进行改动。
  producer(proxy)

  // 处理完成之后，通过 flag 拿到 store 实例
  const newState = proxy[PROXY_FLAG]
  if (newState.modified) return newState.copy
  return newState.source
}
```

这样，一个分割成 Store 构造函数，handler 处理对象和 produce 处理 state 这三个模块的最简版就完成了，将它们组合起来就是一个最最最 tiny 版的 immer ，里面去除了很多不必要的校验和冗余的变量。但真正的 immer 内部也有其他的功能，例如上面提到的深层嵌套对象的结构化共享等等。

当然，Proxy 作为一个新的 API，并不是所有环境都支持，Proxy 也无法 polyfill，所以 immer 在不支持 Proxy 的环境中，使用 Object.defineProperty 来进行一个兼容。

## 总结

- Immer 的 API 非常简单，上手几乎没有难度，同时项目迁移改造也比较容易。immutable-js 上手就复杂的多，使用 immutable-js 的项目迁移或者改造起来会稍微复杂一些。
- Immer 需要环境支持 Proxy 和 defineProperty，否则无法使用。但 immutable-js 支持编译为 ES3 代码，适合所有 JS 环境。
- Immer 的运行效率受到环境因素影响较大。immutable-js 的效率整体来说比较平稳，但是在转化过程中要先执行 fromJS 和 toJS，所以需要一部分前期效率的成本。

## 参考

- [immer.js实战讲解文档](https://segmentfault.com/a/1190000017270785)

- [Immutable 详解及 React 中实战](https://zhuanlan.zhihu.com/p/20295971)

- [immer.js:也许更适合你的immutable js库](https://juejin.im/post/6844904111402385422)

