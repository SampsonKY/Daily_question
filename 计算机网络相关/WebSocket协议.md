## 建立连接

WebSocket复用了HTTP的握手通道。具体指的是，客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成后，后续的数据交换则遵照WebSocket的协议。

### 1、客户端：申请协议升级

首先，客户端发起协议升级请求。可以看到，采用的是标准的HTTP报文格式，且只支持`GET`方法。

```
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

```
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

```
>toBase64( sha1( Sec-WebSocket-Key + 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 )  )
```

验证下前面的返回结果：

```
const crypto = require('crypto');
const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const secWebSocketKey = 'w4v7O6xFTi36lq3RNcgctw==';

let secWebSocketAccept = crypto.createHash('sha1')
	.update(secWebSocketKey + magic)
	.digest('base64');

console.log(secWebSocketAccept);
// Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```

**参考资料**：https://www.cnblogs.com/chyingp/p/websocket-deep-in.html