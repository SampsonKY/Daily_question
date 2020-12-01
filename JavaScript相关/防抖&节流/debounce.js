var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    container.innerHTML = count++;
    // console.log(this)
    // console.log(e)
};

function debounce(func, wait, immediate){
    var timeout, result;
    var debounced = ()=>{
        var context = this
        var args = arguments

        if (timeout) clearTimeout(timeout) 
        if (immediate) { //立即执行
            // 如果已经执行过，不再执行
            var callNow = !timeout
            timeout = setTimeout(() => {
                timeout = null
            }, wait)
            if (callNow) func.apply(context, args)
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args) //处理this指向和事件对象event
            }, wait)
        }
        return result //返回值
    }
    //取消防抖
    debounced.cancel = ()=>{
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}

// function throttle(func, wait){
//     var context, args
//     var previous  = 0

//     return function(){
//         var now = +new Date()
//         context = this
//         args = arguments
//         if(now - previous > wait){
//             func.apply(context, args)
//             previous = now
//         }
//     }
// }
// function throttle(func, wait) {
//     var context, args, timeout

//     return function () {
//         context = this
//         args = arguments

//         if (!timeout) {
//             timeout = setTimeout(()=>{
//                 timeout = null
//                 func.apply(context, args)
//             },wait)
//         }
//     }
// }
// function throttle(func, wait) {
//     var timeout, context, args, result;
//     var previous = 0;

//     var later = function () {
//         previous = +new Date();
//         timeout = null;
//         func.apply(context, args)
//     };

//     var throttled = function () {
//         var now = +new Date();
//         //下次触发 func 剩余的时间
//         var remaining = wait - (now - previous);
//         context = this;
//         args = arguments;
//         // 如果没有剩余的时间了或者你改了系统时间
//         if (remaining <= 0 || remaining > wait) {
//             if (timeout) {
//                 clearTimeout(timeout);
//                 timeout = null;
//             }
//             previous = now;
//             func.apply(context, args);
//         } else if (!timeout) {
//             timeout = setTimeout(later, remaining);
//         }
//     };
//     return throttled;
// }
var setUseAction = debounce(getUserAction,1000,true);
container.onmousemove = setUseAction

// document.getElementById("button").addEventListener('click', ()=>{
//     setUseAction.cancel()
// })

