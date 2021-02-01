## 建立连接

WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。

### 1、客户端：申请协议升级

首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持`GET`方法。

```http
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
```

重点请求首部意义如下：

- `Connection: Upgrade`：表示要升级协议
- `Upgrade: websocket`：表示要升级到websocket协议。
- `Sec-WebSocket-Version: 13`：表示websocket的版本。如果服务端不支持该版本，需要返回一个`Sec-WebSocket-Version`header，里面包含服务端支持的版本号。
- `Sec-WebSocket-Key`：与后面服务端响应首部的`Sec-WebSocket-Accept`是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

> 注意，上面请求省略了部分非重点请求首部。由于是标准的HTTP请求，类似Host、Origin、Cookie等请求首部会照常发送。在握手阶段，可以通过相关请求首部进行 安全限制、权限校验等。

### 2、服务端：响应协议升级

服务端返回内容如下，状态代码`101`表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。

```http
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

> 备注：每个header都以`\r\n`结尾，并且最后一行加上一个额外的空行`\r\n`。此外，服务端回应的HTTP状态码只能在握手阶段使用。过了握手阶段后，就只能采用特定的错误码。

### 3、Sec-WebSocket-Accept的计算

`Sec-WebSocket-Accept`根据客户端请求首部的`Sec-WebSocket-Key`计算出来。

计算公式为：

1. 将`Sec-WebSocket-Key`跟`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`拼接。
2. 通过SHA1计算出摘要，并转成base64字符串。

伪代码如下：

```javascript
>toBase64( sha1( Sec-WebSocket-Key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 )  )
```

验证下前面的返回结果：

```javascript
const crypto = require('crypto');
const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const secWebSocketKey = 'w4v7O6xFTi36lq3RNcgctw==';

let secWebSocketAccept = crypto.createHash('sha1')
	.update(secWebSocketKey + magic)
	.digest('base64');

console.log(secWebSocketAccept);
// Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

## 介绍

Websocket 是 HTML5 规范提出的一个**应用层的全双工协议**，适用于浏览器与服务器进行实时通信场景。同时也是跨域的一种解决方案。

**全双工**:

- 指从客户端到服务端，以及从服务端到客户端两个方向都可以通信
- 通信双方可以同时向对方发送数据。
- 与之相对应的还有半双工和单工，半双工指的是双方可以互相向对方发送数据，但双方不能同时发送，单工则指的是数据只能从一方发送到另一方。

**webSocket 与 HTTP**

- WebSocket和HTTP都是应用层协议，都基于 TCP 协议。但 WebSocket是一种双向通信协议。
- WebSocket 在建立连接时需要借助 HTTP 协议，连接建立好了之后 client 与 server 之间的双向通信就与 HTTP 无关了。
- 由于Web Sockets 使用了自定义的协议，所以URL模式也略有不同。未加密的连接不再是http://，而是ws://；加密的连接也不是https://，而是wss://。
- 使用自定义协议而非HTTP协议的好处是，能够在客户端和服务器之间发送非常少量的数据，而不必担心HTTP 那样字节级的开销。

**WebSocket API**

要创建Web Socket，先实例一个WebSocket对象并传入要连接的绝对URL，同源策略对webSocket不适用。

```
var socket = new WebSocket("ws://www.example.com/server.php");
```

实例化了 WebSocket 对象后，浏览器就会马上尝试**创建连接**。与XHR 类似，WebSocket 也有一个表示当前状态的`readyState`属性。不过，这个属性的值与XHR 并不相同，而是如下所示。

- WebSocket.OPENING (0)：正在建立连接。
- WebSocket.OPEN (1)：已经建立连接。
- WebSocket.CLOSING (2)：正在关闭连接。
- WebSocket.CLOSE (3)：已经关闭连接。

readyState的值永远从0开始。

要关闭Web Socket 连接，可以在任何时候调用`close()`方法。

```
socket.close();
```

调用了`close()`之后，readyState 的值立即变为2（正在关闭），而在关闭连接后就会变成3。

**发送和接收数据**

连接建立后，要向服务器发送数据，使用`send()`方法并传入任意字符串，因为WebSockets只能通过连接发送纯文本数据，所以对于复杂的数据结构，在通过连接发送之前，必须进行序列化。

当服务器向客户端发来消息时，WebSocket 对象就会触发 `message` 事件。这个`message` 事件与其他传递消息的协议类似，也是把返回的数据保存在`event.data` 属性中。

```
socket.onmessage = function(event){
    var data = event.data;
    //处理数据
};
```

与通过send()发送到服务器的数据一样，`event.data`中返回的数据也是字符串。如果你想得到其他格式的数据，必须手工解析这些数据。

**其他事件**

WebSocket 对象还有其他三个事件，在连接生命周期的不同阶段触发。

- open：在成功建立连接时触发。
- error：在发生错误时触发，连接不能持续。
- close：在连接关闭时触发。

在这三个事件中，只有close 事件的event对象有额外的信息。这个事件的事件对象有三个额外 的属性：`wasClean`、`code`和`reason`。其中，wasClean是一个布尔值，表示连接是否已经明确地关闭；code是服务器返回的数值状态码；而reason是一个字符串，包含服务器发回的消息。可以把这些信息显示给用户，也可以记录到日志中以便将来分析。

例子：

```html
// socket.html
<script>
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
      socket.send('你好');//向服务器发送数据
    }
    socket.onmessage = function (e) {
      console.log(e.data);//接收服务器返回的数据
    }
</script>
```







**参考资料**：https://www.cnblogs.com/chyingp/p/websocket-deep-in.html

