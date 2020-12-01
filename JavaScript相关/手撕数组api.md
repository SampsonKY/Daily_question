## map

> - 参数：接收两个参数，一个是回调函数，一个是回调函数的this值（可选）
>
> 其中，回调函数传入三个值，分别为当前元素，当前索引，整个数组
>
> - 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
> - 对原来的数组没有影响

```js
Array.prototype.map = function(callback, thisArg){
    if(this===null || this===undefined){
        throw new TypeError("Cannot read property 'map' of null or undefind")
    }
    if(Object.prototype.toString.call(callback)!== '[object Function]'){
        throw new TypeError(callback + ' is not a function')
    }
    
    let O = Object(this)
    let T = thisArg
    
    let len = O.length>>>0
    let A = new Array(len)
    for(let k=0; k<len; k++){
        if(k in O){
            A[k] = callback.call(T, O[k], k, O)
        }
    }
    return A
}
```

## reduce

> - 参数: 接收两个参数，一个为回调函数，另一个为初始值。回调函数中四个默认参数，依次为积累值、当前值、当前索引和整个数组。

```js
Array.prototype.map = function(callback, initialVal){
    if(this===null || this===undefined){
        throw new TypeError("Cannot read property 'map' of null or undefind")
    }
    if(Object.prototype.toString.call(callback)!== '[object Function]'){
        throw new TypeError(callback + ' is not a function')
    }
    
    let O = Object(this)
    let T = thisArg
    
    let len = O.length>>>0
	let k = 0
    let accumulator = initialVal
    if(accumulator === undefined){
        for(; k<len; k++){
            if(k in O){
                accumulator = O[k]
                k++
                break
            }
        }
    }
	
    if(k===len && accumulator === undefined) throw new Error('Each element of the array is empty')
    for(;k<len;k++){
        if(k in O){
            accumulator = callback.call(undefined, accumulator, O[k], k, O)
        }
    }
    return accumulator
}
```



## filter

> 参数: 一个函数参数。这个函数接受一个默认参数，就是当前元素。这个作为参数的函数返回值为一个布尔类型，决定元素是否保留。
>
> filter方法返回值为一个新的数组，这个数组里面包含参数里面所有被保留的项。

```js
Array.prototype.map = function(callback, thisArg){
    if(this===null || this===undefined){
        throw new TypeError("Cannot read property 'map' of null or undefind")
    }
    if(Object.prototype.toString.call(callback)!== '[object Function]'){
        throw new TypeError(callback + ' is not a function')
    }
    
    let O = Object(this)
    let T = thisArg
    
    let len = O.length>>>0
    let res = []
    let resLen = 0
    for(let k=0; k<len; k++){
        if(k in O){
            if(callback.call(T, O[k], K, O)){
                res[resLen++] = O[k]
            }
        }
    }
    return res
}
```



## slice

