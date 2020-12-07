//回调函数的方式其实内部利用了 发布-订阅 模式
//在这里我们以模拟实现 node 中的 Event 模块为例来写实现回调函数的机制。

function EventEmitter(){
    this.events = new Map()
}
// once 参数表示是否只是触发一次
const wrapCallback = (fn, once=false) =>({callback: fn, once})

EventEmitter.prototype.addListener = function(type, fn, once=false){
    let handler = this.events.get(type)
    if(!handler){
        // 为 type 事件绑定回调
        this.events.set(type, wrapCallback(fn, once))
    } else if(handler && typeof handler.callback === 'function'){
        //目前 type 事件只有一个回调
        this.events.set(type, [handler, wrapCallback(fn, once)])
    } else {
        // 目前 type 事件回调数 >= 2
        handler.push(wrapCallback(fn, once))
    }
}

EventEmitter.prototype.removeListener = function(type, listener){
    let handler = this.events.get(type)
    if(!handler) return
    if(!Array.isArray(handler)){
        if(handler.callback === listener) this.events.delete(type)
        else return
    }
    for(let i = 0; i < handler.length; i++){
        let item = handler[i]
        if(item.callback === listener) {
            // 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 -- 
            handler.splice(i, 1)
            i--
            if(handler.length === 1){
                //长度为 1 就不用数组存了
                this.events.set(type, handler[0])
            }
        }
    }
}

// once 实现思路很简单，先调用 addListener 添加上了once标记的回调对象, 然后在 emit 的时候遍历回调列表，将标记了once: true的项remove掉即可。
EventEmitter.prototype.once = function(type, fn){
    this.addListener(type, fn, true)
}

EventEmitter.prototype.emit = function(type, ...args){
    let handler = this.events.get(type)
    if(!handler) return
    if(Array.isArray(handler)){
        //遍历列表，执行回调
        handler.map((item)=>{
            item.callback.apply(this, args)
            //标记的 once: true 的项直接移除
            if(item.once) this.removeListener(type, item.callback)
        })
    } else {
        //只有一个回调则直接执行
        handler.callback.apply(this, args)
        if(handler.once) this.removeListener(type, handler.callback)
    }
    return true
}

EventEmitter.prototype.removeAllListener = function(type){
    let handler = this.events.get(type)
    if(!handler) return
    else this.events.delete(type)
}

let e = new EventEmitter();
const handler = () => {
    console.log("type事件触发！");
  }
e.addListener('type', handler)
e.addListener('type', () => {
  console.log("WOW!type事件又触发了！");
})

function f() { 
  console.log("type事件我只触发一次"); 
}
e.once('type', f)

e.emit('type');
e.removeListener('type',handler)
e.emit('type');
e.removeAllListener('type');
e.emit('type');
