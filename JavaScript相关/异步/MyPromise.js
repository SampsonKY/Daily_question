//primise 的三个状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'reject'

function Promise(excutor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolved = []
    this.onRejected = []

    const resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            this.onResolved.forEach(fn => fn())
        }
    }
    const reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            this.onRejected.forEach(fn => fn())
        }
    }
    try {
        excutor(resolve, reject)
    } catch (error) {
        reject(error)
    }
}
const resolvePromise = function (x, promise2, resolve, reject) {
    if (x === promise2) reject(new TypeError('cycle'))
    let called

    if ((typeof x === "object" && typeof x !== null) || typeof x === "function") {
        try {
            let then = x.then
            if (typeof then === "function") {
                then.call(x, y => {
                    if (called) return
                    called = true
                    resolvePromise(y, promise2, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
    } else {
        resolve(x)
    }
}

Promise.prototype.then = function (onResolve, onReject) {
    onResolve = typeof onResolve === "function" ? onResolve : v => v
    onReject = typeof onReject === 'function' ? onReject : v => {
        throw v
    }

    let promise2 = new Promise((resolve, reject) => {
        if (this.status === FULFILLED) {
            setTimeout(() => {
                try {
                    let x = onResolve(this.value)
                    resolvePromise(x, promise2, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        }
        if (this.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onReject(this.reason)
                    resolvePromise(x, promise2, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            }, 0)
        }

        if (this.status === PENDING) {
            this.onResolved.push(() => {
                setTimeout(() => {
                    try {
                        let x = onResolve(this.value)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })

            this.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        let x = onReject(this.reason)
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
        }
    })
    return promise2
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

/*
实现 resolve 静态方法有三个要点:
- 传参为一个 Promise, 则直接返回它。
- 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，采用它的最终状态作为自己的状态。
- 其他情况，直接返回以该值为成功状态的 promise 对象
*/
Promise.resolve = function (param) {
    if (param instanceof Promise) return param
    return new Promise((resolve, reject) => {
        if (param && param.then && typeof param.then === "function") {
            // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
            param.then(resolve, reject)
        } else {
            resolve(param)
        }
    })
}

Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}

Promise.prototype.finally = function (callback) {
    this.then(value => {
        return Promise.resolve(callback()).then(() => {
            return value;
        })
    }, error => {
        return Promise.resolve(callback()).then(() => {
            throw error;
        })
    })
}


Promise.all = function (promises) {
    if (!Array.isArray(promises)) {
        const type = typeof promises;
        return new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }

    return new Promise((resolve, reject) => {
        let result = [];
        let index = 0;
        let len = promises.length;
        if (len === 0) {
            resolve(result);
            return;
        }

        for (let i = 0; i < len; i++) {
            // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
            Promise.resolve(promises[i]).then(data => {
                result[i] = data;
                index++;
                if (index === len) resolve(result);
            }).catch(err => {
                reject(err);
            })
        }
    })
}

Promise.allSettled = function (promises) {
    if (!Array.isArray(promises)) {
        const type = typeof promises;
        return new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }

    return new Promise((resolve, reject) => {
        let result = [];
        let index = 0;
        let len = promises.length;
        if (len === 0) {
            resolve(result);
            return;
        }

        for (let i = 0; i < len; i++) {
            // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
            Promise.resolve(promises[i]).then(data => {
                result[i] = {
                    status: 'fulfilled',
                    value: data
                };
                index++;
                if (index === len) resolve(result);
            },(reason)=>{
                result[i] = {
                    status: 'rejected',
                    value: reason
                };
                index++;
                if (index === len) resolve(result);
            })
        }
    })
}

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        let len = promises.length;
        if (len === 0) return;
        for (let i = 0; i < len; i++) {
            Promise.resolve(promise[i]).then(data => {
                resolve(data);
                return;
            }).catch(err => {
                reject(err);
                return;
            })
        }
    })
}

const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});

// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('ok1');
//     }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('ok2');
//     }, 1000);
// })

// Promise.all([1, 2, 3, p1, p2]).then(data => {
//     console.log('resolve', data);
// }, err => {
//     console.log('reject', err);
// })


// Promise.defer = Promise.deferred = function () {
//     let dfd = {};
//     dfd.promise = new Promise((resolve,reject)=>{
//         dfd.resolve = resolve;
//         dfd.reject = reject;
//     })
//     return dfd;
//   }

// module.exports = Promise