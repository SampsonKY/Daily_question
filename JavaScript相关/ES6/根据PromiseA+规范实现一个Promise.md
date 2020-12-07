## Promise/A+ 规范要点

**基本特征**

1. promise 有三个状态：`pending`，`fulfilled`，or `rejected`；「规范 Promise/A+ 2.1」
2. `new promise`时， 需要传递一个`executor()`执行器，执行器立即执行；
3. `executor`接受两个参数，分别是`resolve`和`reject`；
4. promise  的默认状态是 `pending`；
5. promise 有一个`value`保存成功状态的值，可以是`undefined/thenable/promise`；「规范 Promise/A+ 1.3」
6. promise 有一个`reason`保存失败状态的值；「规范 Promise/A+ 1.5」
7. promise 只能从`pending`到`rejected`, 或者从`pending`到`fulfilled`，状态一旦确认，就不会再改变；
8. promise 必须有一个`then`方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；「规范 Promise/A+ 2.2」
9. 如果调用 then 时，promise 已经成功，则执行`onFulfilled`，参数是`promise`的`value`；
10. 如果调用 then 时，promise 已经失败，那么执行`onRejected`, 参数是`promise`的`reason`；
11. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调`onRejected`；

**then链式调用与值穿透**

1. then 的参数 `onFulfilled` 和 `onRejected` 可以缺省，如果 `onFulfilled` 或者 `onRejected`不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值；「规范 Promise/A+ 2.2.1、2.2.1.1、2.2.1.2」
2. promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"；「规范 Promise/A+ 2.2.7」
3. 如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
4. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.2.7.2」
5. 如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；「规范 Promise/A+ 2.2.7.3、2.2.7.4」
6. 如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；「规范 Promise/A+ 2.3.1」
7. 如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」

## 完整代码及注释

```javascript
// promise 的三个状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const resolvePromise = (promise2, x, resolve, reject)=>{
    // 循环引用出错
    if(promise2 === x) return reject(new TypeError('Changing cycle detected for promise'))

    let called //判断是否已经调用过函数
	// 保证代码能和别的库一起使用
    if((typeof x === 'object' && x != null) || typeof x === 'function'){
        try {
            let then = x.then
            if(typeof then === 'function'){ //如果x是对象或函数，并且有then方法
                then.call(x, y=>{
                    if(called) return
                    called = true
                    // 递归解析过程（promise中可能还有promise）
                    resolvePromise(promise2, y, resolve, reject)
                }, r=>{
                    if(called) return
                    called = true
                    reject(r)
                })
            } else {
                // 如果x.then 是个普通值就直接返回 resolve 作为结果
                resolve(x)
            }
        } catch (e) {
            if(called) return
            called = true
            reject(e)
        }
    } else{
        // 如果 x 是个普通值就直接返回 resolve 作为结果
        resolve(x)
    }

}

class Promise{
    constructor(excutor){
        this.status = PENDING //默认状态
        this.value = undefined  //存放成功状态的值
        this.reason = undefined //存放失败状态的值
        this.onResolvedCallbacks = [] //存放成功的回调
        this.onRejectedCallbacks = [] //存放失败的回调
		
        // 成功时调用该方法
        let resolve = (value)=>{
            if(this.status === PENDING){
                this.status = FULFILLED
                this.value = value
                //依次将对应函数执行
                this.onResolvedCallbacks.forEach(fn=>fn())
            }
        }
		// 失败时调用
        let reject = (reason)=>{
            if(this.status === PENDING){
                this.status = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn=>fn())
            }
        }

        try {
            // 立即执行，将 resolve 和 reject 函数传给使用者 
            excutor( resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
	// 包含一个 then 方法，接收两个参数 onFulfiled onRejected
    then(onFulfiled, onRejected){
        // 解决 onFufilled，onRejected 没有传值的问题
        onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : v=>v
        // 因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
        onRejected = typeof onRejected === 'function' ? onRejected : v=>{throw v}
		// 每次调用 then 都返回一个新的 promise
        let promise2 = new Promise((resolve, reject)=>{
            if(this.status === FULFILLED){
                setTimeout(()=>{
                    try {
                        let x = onFulfiled(this.value)
                        // x可能是一个promise
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                },0)
            }
    
            if(this.status === REJECTED){
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
    	// 如果promise的状态是 pending，需要将 onFulfilled 和 onRejected 函数存放起来，等待状态确定后，再依次将对应的函数执行
            if(this.status === PENDING){
                this.onResolvedCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onFulfiled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
    
                this.onRejectedCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
        return promise2
    }
}
```

## 代码测试

**安装测试脚本**

```javascript
npm install -g promises-aplus-tests
```

**在代码中添加如下代码**

```javascript
Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
  }
  
module.exports = Promise
```

**执行命令**

```javascript
promises-aplus-tests promise.js
```



## 参考

[面试官：“你能手写一个 Promise 吗”](https://juejin.im/post/6850037281206566919#heading-17)

[Promise A+中文翻译](https://juejin.im/post/6844903649852784647#heading-15)