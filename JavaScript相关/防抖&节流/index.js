function debounce(func, wait, immedate){
    let timeout
    return ()=>{
        let context = this
        let args = arguments
        if(timeout) clearTimeout(timeout)
        if(immedate){
            let callNow = !timeout
            timeout = setTimeout(()=>{
                timeout = null
            },wait)
            if(callNow) func.applay(context, args)
        }else{
            timeout = setTimeout(()=>{
                func.applay(context, args)
            },wait)
        }
    }
}

function throttle(func, wait){
    let pervious = 0
    return ()=>{
        let context = this
        let args = arguments
        let now = +new Date()
        if(now-pervious>wait){
            pervious = now
            func.applay(context, args)
        }
    }
}
function throttle2(func, wait) {
    let timeout
    return ()=>{
        let context = this
        let args = arguments
        if(!timeout){
            timeout = setTimeout(()=>{
                timeout = null
                func.applay(context, args)
            },wait)
        }
    }
}

Array.from(new Set(arr))
function quchong(arr) {
    let res = []
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<res.length; j++){
            if(res[j]===arr[i]) break
        }
        if(res.length===j) res.push(arr[i])
    }
    return res
}
let arr = arr.filter((value,index,arr)=>{
   return index==arr.indexOf(value)
})
function quchong2(arr) {
    let res = []
    for(let i=0; i<arr.length; i++){
        if(!i || arr[i]!==arr[i-1]) res.push(arr[i])
    }
    return res
}
let arr = arr.concat().sort().filter((value, index, arr)=>{
    return !index || arr[index-1]!==value
})
function quchong3(arr) {
    let res = {}
    arr.filter((value,index,arr)=>{
        return res.hasOwnProperty(typeof value+JSON.stringify(value))?false:res[typeof value+JSON.stringify(value)]=true
    })
}

// typeof undefined ==> undefined
// typeof null ==> object

// Object.prototype.toString(obj) ==>"[Object Object]"

var class2type = {}
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map((item, index)=>{
    class2type["[object "+item+" ]"] = item.toLowerCase()
})

function type(obj) {
    if(obj === null) return obj+""
    return typeof obj === "object" || typeof obj === "function" ? 
        class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj
}

//plainObject 由 {} 或 new Object 创建
function isPlianObject(obj){
    if(typeof obj !== "object" || obj === null) return false
    
    let proto = Object.getPrototypeOf(proto)

    // if(!proto) return true //Object.create(null)的情况

    while(Object.getPrototypeOf(proto)){
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) === proto
}

function isEmptyObject(obj){
    for(let name in obj){
        return false
    }
    return true
}

//如果obj是Window对象，则其拥有一个window属性指向自身
function isWindow(obj){
    return obj!==null && obj === obj.window
}

//检测数组和类数组
function isArrayLike(obj){
    // obj 必须有 length 属性
    var length = !! obj && 'length' in obj && obj.length
    var typeRes = type(obj)

    // 排除函数和Window对象
    if(typeRes === "function" || isWindow(obj)){
        return false
    }

    return typeRes === "array" || 
        length===0 || 
        typeof length === "number" && length > 0 && (length-1) in obj
}

//判断是不是 DOM 元素
function isElement(obj) {
    return !!(obj && obj.nodeType === 1)
}

//浅拷贝
function shallowCopy(obj) {
    var res = {}
    for(let name in res){
        if(obj.hasOwnProperty(name)){
            res[name] = obj[name]
        }
    }
    return res
}

// JS 自带的深拷贝方法
// Array
// slice concat Array.from ... 只能实现一维数组的深拷贝

// Object
// Object.assigin() 实现一维对象的深拷贝
// JSON.parse(Json.stringify(obj)) 任意维对象的深拷贝但会忽略undefined、函数和Symbol且不能循环引用

// 手动实现
function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {}
    if(obj && typeof obj === "object"){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                if( obj[key] && typeof obj[key] === "object"){
                    result[key] = deepCopy(obj[key])
                }else{
                    result[key] = obj[key]
                }
            }
        }
    }
    return result
}

function deepCopy2(obj, parent) {
    let result
    //解决因循环递归而暴栈的问题，只需要判断一个
    //对象的字段是否引用了这个对象或这个对象的任意父级即可。
    let _parent = parent
    while(_parent){
        if(_parent.originalParent === obj){
            return _parent.currentParent
        }
        _parent = _parent.parent
    }
    if(obj && typeof obj === "object"){
        if(obj instanceof RegExp){
            result = new RegExp(obj.source, obj.flags)
        }else if(obj instanceof Date){
            result = new Date(obj.getTime())
        }else{
            if(obj instanceof Array){
                result = []
            }else{
                let proto = Object.getPrototypeOf(obj)
                result = Object.create(proto)
            }
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key] && typeof obj[key] === "object"){
                        result[key] = deepCopy2(obj[key],{
                            originalParent: obj,
                            currentParent: result,
                            parent: parent
                        })
                    }else{
                        result[key] = obj[key]
                    }
                }
            }
        }
    }else{
        return obj
    }
    return result
}

// 扁平化
function flatten(arr) {
    var res = []
    for(var i = 0; i < arr.length; i++){
        if(Array.isArray(arr[i])){
            res = res.concat(flatten(arr[i]))
        }else{
            res.push(arr[i])
        }
    }
    return res
}

//如果数组全部是数字
[1,[2,[3,4]]].toString().split(',').map((item)=>+item)

// 查找指定元素的值 indexOf lastIndexOf findIndex
/**
 * 1. findIndex 返回符合提供函数的第一个值的下标
 */

arr.findIndex((e)=>{
    return e>15
})

function findIndexAndLastIndex(arr, callback, dir){
    let len = arr.length
    let index = dir > 0 ? 0 : len-1
    for(; index>=0 && index<len; index+=dir){
        if(callback(arr[index])) return index 
    }
    return -1
}


function createIndexOfFinder(dir, predicate) {

    return function(array, item, idx){
        var length = array.length;
        var i = 0;

        if (typeof idx == "number") {
            if (dir > 0) {
                i = idx >= 0 ? idx : Math.max(length + idx, 0);
            }
            else {
                length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
        }

        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
        }
        return -1;
    }
}

var indexOf = createIndexOfFinder(1, findIndex);
var lastIndexOf = createIndexOfFinder(-1, findLastIndex);