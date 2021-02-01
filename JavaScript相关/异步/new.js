//手写一个 new 
function objectFactory(){
    // let obj = new Object()
    let Ctor = [].shift.call(arguments)
    // obj.__proto__ = Ctor.prototype
    let obj = Object.create(Ctor.prototype)
    let ret = Ctor.apply(obj, arguments)
    return typeof ret === "object" ? ret : obj
}

//手写call
Function.prototype.call2 = function(context){
    context = context || window
    context.fn = this
    var args = []
    for(var i = 1; i < arguments.length; i++){
        args.push('arguments['+ i + ']')
    }
    console.log(args)
    var res = eval('context.fn('+args+')')
    delete context.fn
    return res
}

Function.prototype.call3 = function(context, ...args){
    context = context || window
    context.fn = this
    let res = context.fn(...args)
    delete context.fn
    return res
}

//手写apply
Function.prototype.apply2 = function(context, arr){
    context = context || window
    context.fn = this
    let res = context.fn(...arr)
    delete context.fn
    return res
}

//手写bind
Function.prototype.bind2 = function(context, ...args1){
    var self = this

    var fNOP = function(){}
    var fBound =  function(...args2){
        return self.apply(this instanceof fNOP? this : context,args1.concat(args2))
    }
    fNOP.prototype = self.prototype
    fBound.prototype = new fNOP()
    return fBound
}

//扁平化
var arr = [1, [2, [3, 4]]];

// console.log(arr.flat(Infinity)) 

function flat(arr){
    let res = []
    for(var i=0; i<arr.length; i++){
        if(Array.isArray(arr[i])){
            res = res.concat(flat(arr[i]))
        } else{
            res.push(arr[i])
        }
    }
    return res
}

//如果元素都是数字
function flat2(arr){
    return arr.toString().split(',').map(item=>+item)
}

//reduce
function flat3(arr){
    return arr.reduce((prev, next)=>{
        return prev.concat(Array.isArray(next)?flat3(next): next)
    }, [])
}

function flat4(arr){
    while(arr.some(Array.isArray)){
        arr = [].concat(...arr)
    }
}

//数组去重
function unique(array){
    let res = []
    for(let i=0; i<array.length; i++){
        for(let j=0; j<res.length; j++){
            if(array[i] === res[j]) break
            if(j===res.length) res.push(array[i])
        }
    }
    return res
}

function unique(arr){
    let res = []
    for(let i=0; i<arr.length; i++){
        if(res.indexOf(arr[i]) === -1) res.push(arr[i])
    }
    return res
}

Array.from(new Set(arr))
arr = [...new Set(arr)]

function unique(arr){
    let obj = {}

    arr.filter(item=>{
        obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)]=true) 
    })

}

function unique(arr){
    let map = new Map()
    arr.filter(item=> !map.has(item)&&map.set(item,true))
}

//浅拷贝
function shallowCopy(src){
    var obj = {}

    for(var prop in src){
        if(src.hasOwnProperty(prop)){
            obj[prop] = src[prop]
        }
    }

    return obj
}

//一维数组的深拷贝  slice() concat() Array.from() ...
//一维对象的深拷贝 assign()
//JSON.parse(JSON.stringify(obj)) 可实现多维对象的深拷贝，但会忽略undefined，任意的函数，symbol，且循环引用会出错

function deepCopy(obj, parent=null){
    let res

    let _parent = parent
    while(_parent){
        if(_parent.originalParent === obj){
            return _parent.currentParent
        }
        _parent = _parent.parent
    }

    if(obj && typeof obj === "object"){
        if(obj instanceof RegExp){
            res = new RegExp(obj.source, obj.flags)
        } else if(obj instanceof Date){
            res = new Date(obj.getTime())
        } else{
            if(Array.isArray(obj)){
                res = []
            } else {
                let proto = Object.getPrototypeOf(obj)
                res = Object.create(proto)
            }
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key] && typeof obj[key] === 'object'){
                        res[key] = deepCopy(obj[key],{
                            originalParent: obj,
                            currentParent: res,
                            parent: parent
                        })
                    }else{
                        res[key] = obj[key]
                    }
                }
            }
        }
    }else {//返回基本数据类型和Function
        return obj
    }
    return res
}

function construct(){
    this.a = 1,
    this.b = {
        x:2,
        y:3,
        z:[4,5,[6]]
    },
    this.c = [7,8,[9,10]],
    this.d = new Date(),
    this.e = /abc/ig,
    this.f = function(a,b){
        return a+b
    },
    this.g = null,
    this.h = undefined,
    this.i = "hello",
    this.j = Symbol("foo")
}
construct.prototype.str = "I'm prototype"
var obj1 = new construct()
obj1.k = obj1
obj2 = deepCopy(obj1)
obj2.b.x = 999
obj2.c[0] = 666
console.log(obj1)
console.log(obj2)
console.log(obj1.str)
console.log(obj2.str)