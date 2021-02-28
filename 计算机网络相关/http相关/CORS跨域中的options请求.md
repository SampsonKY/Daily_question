> 在正式跨域的请求前，浏览器会根据需要，发起一个“PreFlight”（也就是Option请求），用来让服务端返回允许的方法（如get、post），被跨域访问的Origin（来源，或者域），还有是否需要Credentials(认证信息）。

> CORS 背后的基本思想，就是使用自定义的 HTTP 头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功，还是失败。实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。

跨域请求分为简单请求和复杂请求。

**简单请求**

> 简单请求跨域时，会添加 Origin 字段（协议、域名、端口），如果服务器认为这个请求可以接受，就在`Access-Control-Allow-Origin`头部中回发相同的源信息。

- 只能是 Get、Head、Post方法
- 除了浏览器自己在http头上加的信息（如Connection、User-Agent），开发者只能加这几个：Accept、Accept-Language、Content-Type、……
- Content-Type只能取这几个值：
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

**复杂请求**

> 复杂请求在正式请求前都会有预检请求，在浏览器中都能看到有OPTIONS请求，用于向服务器请求权限信息的。

- 使用方法put或者delete;
- 发送json格式的数据（content-type: application/json）
- 请求中带有自定义头部；

**options请求**

跨域请求中，options请求是浏览器发起的preflight request(预检请求)，以检测实际请求是否可以被浏览器接受。

preflight request**请求报文**中有两个需要关注的首部字段：

- Access-Control-Request-Method：告知服务器实际请求所使用的HTTP方法；
- Access-Control-Request-Headers：告知服务器实际请求所携带的自定义首部字段。

同时客户端也会添加origin header,告知服务器实际请求的客户端的地址。服务器基于从预检请求获得的信息来判断，是否接受接下来的实际请求。如果服务器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被`XMLHttpRequest`对象的`onerror`回调函数捕获。

如果确认允许跨源请求，就可以做出回应。服务器所返回的Access-Control-Allow-Methods首部字段将所有允许的请求方法告知客户端，返回将所有Access-Control-Request-Headers首部字段将所有允许的自定义首部字段告知客户端。此外，服务器端可返回Access-Control-Max-Age首部字段，允许浏览器在指定时间内，无需再发送预检请求，直接用本次结果即可。

在我们开发过程中出现的浏览器自发起的options请求就是上面的第二种情况。实际上，跨域请求中的”复杂请求”发出前会进行一次方法是options的preflight request。

一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段。

**当跨域请求是简单请求时不会进行preflight request,只有复杂请求才会进行preflight request。**

**为什么跨域的复杂请求需要preflight request?**

复杂请求可能对服务器数据产生副作用。例如delete或者put,都会对服务器数据进行修改,所以在请求之前都要先询问服务器，当前网页所在域名是否在服务器的许可名单中，服务器允许后，浏览器才会发出正式的请求，否则不发送正式请求。

**带凭据的请求**

默认情况下， 跨源请求不提供凭据（cookie、HTTP 认证及客户端 SSL 证明等）。通过 `withCredentials` 属性设置为true，可以指定某个请求应该发送凭据。如果服务器接受带凭据的请求，会用 HTTP 头部 `Access-Control-Allow-Credentials: true` 来响应。

如果发送的是带凭据的请求，但服务器没有包含这个头部，那么浏览器不会把响应交给JavaScript。另外，服务器还可以在preflight响应中发送这个头部，表示允许源发送这个带凭据的请求。

