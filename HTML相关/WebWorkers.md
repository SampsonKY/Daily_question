W3C在HTML5的规范中提出了Web Worker的概念，允许浏览器通过后台线程来执行复杂的事物或者逻辑。

当在 HTML 页面中执行脚本时，页面的状态是不可响应的，直到脚本已完成。

web worker 是运行在后台的 JavaScript，独立于其他脚本，不会影响页面的性能。

## 例子

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>worker demo</title>
</head>
<body>
    <button style="padding: 10px; margin: 10px 0;">开始计算</button>
    <div>
        <span>当前时间戳：</span>
        <span class="time"></span>
    </div>
    
    <script>
        //
        let button = document.querySelector('button');

        let worker = new Worker('workers.js');
        let time;
        button.addEventListener('click', function () {
            time = new Date();
            worker.postMessage('start');
        });

        worker.onmessage = function (messageEvent) {
            alert('计算结束，结果为' + messageEvent.data + '，用时' + (new Date() - time) + 'ms');
        }

        // 计时器
        let timeDom = document.querySelector('.time');
        function updateTime() {
            timeDom.innerHTML = +new Date();
            requestAnimationFrame(updateTime);
        }
        requestAnimationFrame(updateTime);
    </script>
</body>

</html>
```

```js
// 斐波那契数列
function fabonacci(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fabonacci(n - 1) + fabonacci(n - 2);
}

onmessage = function (messageEvent) {
    switch (messageEvent.data) {
        case 'start':
            let result = fabonacci(43);
            postMessage(result);
    }
}
```

## 解读

### worker的初始化

Worker可以通过Worker()构造函数来构建，Worker接收一个参数，该参数为线程脚本的地址，但是必须遵守[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)，初始化完成之后，浏览器就会用后台线程运行我们的workers.js文件中的代码。

```javascript
// 初始化worker
let worker = new Worker('workers.js');
```

### worker的消息传递

创建新的后台线程之后，我们迫切关注的是如何和后台线程进行通信，这时候就要用到postMessage方法了。

#### postMessage(Object aMessage [,sequence transferList])

在主线程中，我们可以通过 worker.postMessage 向后台线程传递数据，postMessage接受2个参数，第一个为我们要传递的消息对象，第二个参数为一个数组，用来转让对象的所有权。

```javascript
button.addEventListener('click', function () {
    // 向worker传递消息
    worker.postMessage('start');
});
```

此时如果想在子线程中处理这些传递进来的数据的话，我们需要在子线程中通过监听onmessage来捕获这些数据，onmessage接收一个[MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent) 对象，这里我们先关注 MessageEvent 的 data 属性，data就是我们通过主线程传递进来的数据，其他的MessageEvent属性（如origin、source等）大家可以自行了解。

```javascript
// workers.js
onmessage = function (messageEvent) {
    switch (messageEvent.data) {
        case 'start':
            let result = fabonacci(42);
            postMessage(result);
    }
}
```

回到我们的主线程的代码，在主线程中，我们可以通过**worker.onmessage**监听子线程传递过来的数据。

```javascript
// 监听workder返回的消息
worker.onmessage = function (messageEvent) {
    alert('计算结束，结果为' + messageEvent.data + '，用时' + (new Date() - time) + 'ms'); 
}
```

#### terminate()

如果我们想终止我们的worker，可以直接调用terminate方法：

```javascript
var myWorker = new Worker('worker.js');
myWorker.terminate();
```