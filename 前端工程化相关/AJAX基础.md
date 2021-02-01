# part 1：原生 AJAX

## AJAX简介

AJAX 全称为 Asynchronous JavaScript And XML，就是异步的 JS 和 XML。

通过 AJAX 可以在浏览器中向服务器发送异步请求，最大的优势：**无需刷新获取数据。**

AJAX 不是新的编程语言，而是一种将现有的标准组合在一起使用的新方式。

## XML简介

> XML 可扩展标记语言。
>
> XML 被设计用来**传输和存储数据**。
>
> XML 和 HTML 类似，不同的是 HTML 中都是预定义标签，而  XML 中没有预定义标签，全都是自定义标签，用来表示一些数据。

**比如有一个学生数据**

name=“孙悟空”; age=18; gender=”男“

用 XML 表示：

```xml
<student>
	<name>孙悟空</name>
    <age>18</age>
    <gender>男</gender>
</student>
```

**现在已经被 JSON 取代了。**

用 JSON 表示：

```json
{"name":"孙悟空","age":18,"gender":"男"}
```

## AJAX 的特点

### AJAX 的优点

* 可以无需刷新页面而与服务器端进行通信
* 允许你根据用户**事件**来更新部分页面内容

### AJAX 的缺点

* 没有浏览历史，不能回退
* 存在跨域问题（同源）
* SEO 不好

# part 2：XMLHttpRequest 对象

> Ajax 技术的核心是 XMLHttpRequest 对象。
>
> XHR 为向服务器发送请求和解析服务器提供了流畅的接口。
>
> 可以使用 XML 对象获取新数据，然后通过 DOM 将新数据插入到页面中。

## 四步骤

### 1.创建 XHR 对象

```js
var xhr = new XMLHttpRequest()
```

### 2.open()方法

```js
xhr.open(METHOD,URL,ASYNC?)
```

* 使用 XML 对象时，要调用的第一个方法是 open()，它接收三个参数：要发送请求的类型，请求的 URL 和是否表示异步发送请求的布尔值。
* URL 相对执行代码的当前页面（也可使用绝对路径）
* 调用 open() 方法并不会真正发送请求，而是**启动**一个请求以备发送。
* 例子：`xhr.open('get', 'example.php', false)`

* 若请求为同步，JavaScript 代码会等到服务器响应之后再继续执行。

### 3.send()方法

**调用 send() 方法才真正发送了一个特定的请求。**

```js
xhr.send(null)
```

* send() 方法接收一个参数，即要**作为请求主体发送的数据**。
* 如果不需要通过请求主体发送数据，需要传入null
* 调用 send() 后，请求就会被分派到服务器。

### 4.onreadystatechange方法

在收到服务器的响应后，响应的数据会自动填充 **XHR 对象的属性**，相关属性有：

* responseText：作为响应主体被返回的文本。
* responseXML：如果响应的内容类型是"text/xml"或"application/xml"，这个属性中将保存包含着响应数据的XML DOM 文档。
* status：响应的HTTP 状态。
* statusText：HTTP 状态的说明。

在收到响应后，**第一步是检查 status 属性**，以确定响应已经成功返回，通常将 HTTP 状态码 200 作为成功标志。此外状态代码为 304 表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本，也意味着响应有效。

**同步请求**

```javascript
xhr.open("get", "example.php", false)
if((xhr.status>=200 && xhr.status<300) || xhr.status === 304){
    alert(xhr.responseText) //响应成功意味着响应主体的内容都会保存到 responseText 属性中
}else{
    alert("Request was unseccessful: " + xhr.status)
}
```

**异步请求**

**大多数情况下，我们发送异步请求，才能让 JavaScript 继续执行而不必等待响应**。

此时可以检测 XHR 对象的 **readyState** 属性，该属性表示请求/响应过程的当前活动阶段。取值如下：

* 0：未初始化。尚未调用 open() 方法
* 1：启动。已经调用 open() 方法，但尚未调 send() 方法。
* 2：发送。已经调用 send() 方法，但尚未接收到响应。
* 3：接收。已经接收到部分响应数据。
* 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

**只要 readyState 属性的值由一个值变成另一个值，都会触发一次 readystatechange 事件。**

通常，我们只对readyState 值为4 的阶段感兴趣，因为这时所有数据都已经就绪。不过，必须在调用open()之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性。

```javascript
var xhr = createXHR();
xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                alert(xhr.responseText);
        } else {
            alert("Request was unsuccessful: " + xhr.status);
        }
    }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```

# part 3：HTTP 协议请求报文与响应文本协议

> HTTP （hypertext transport protocol) 协议 [超文本传输协议]，协议详细规定了浏览器和万维网服务器之间互相通信的规则。
>
> 每个 HTTP 请求和响应都会带有相应的头部信息。
>
> 默认情况下，在发送 XHR 请求的同时，还会发送下列**头部信息**。
>  Accept：浏览器能够处理的内容类型。
>  Accept-Charset：浏览器能够显示的字符集。
>  Accept-Encoding：浏览器能够处理的压缩编码。
>  Accept-Language：浏览器当前设置的语言。
>  Connection：浏览器与服务器之间连接的类型。
>  Cookie：当前页面设置的任何Cookie。
>  Host：发出请求的页面所在的域 。
>  Referer：发出请求的页面的URI。注意，HTTP 规范将这个头部字段拼写错了，而为保证与规范一致，也只能将错就错了。（这个英文单词的正确拼法应该是referrer。）
>  User-Agent：浏览器的用户代理字符串。
>
> 可以通过 `setRequestHeader()`方法设置自定义请求头部信息，调用 open() 之后且。 send() 之前调用。
>
> 可以通过 `getResponseHeader()`和 `getAllResponseHeaders()`获取头部信息。

## 请求报文

重点是 格式与参数。

```js
行    POST(请求类型)  /(请求路径)  HTTP/1.1(HTTP版本)
头    Host：atguigu.com
	  Cookie: name=guigu
	  Content-type: application/x-www-form-urlencoded
	  User-Agent: chrome 83
空行
体    username=admin&password=admin
```

## 响应报文

```js
行	HTTP/1.1  200  OK
头	Content-Type: text/html;charset=utf-8
	 Content-length: 2048
	 Content-encoding: gzip
空行 
体	<html>
		<head></head>
		<body>
			<h1>AJAX</h1>
		</body>
	 </html>
```

# part 3：使用

## GET 请求

> GET 请求是最常见的请求类型，常用于向服务器查询某些信息。
>
> 可以将查询字符串参数追加到 URL 末尾，以便将信息发送给服务器。
>
> 查询字符串中每个参数名称和值必须使用 `encodeURIComponent()` 进行编码才能放到 URL 末尾。

```javascript
const res = document.getElementById('result')
const btn = document.getElementsByTagName('button')[0]
btn.onclick = function(){
   const xhr = new XMLHttpRequest()
   let url = 'http://127.0.0.1:3000/server'
   url = addURLParam(url, "name", "ky")
   url = addURLParam(url, "age", 12)
   xhr.open('GET', url)//xhr.open('GET',http://127.00.1:3000/server?name=ky&age=12,true)
   xhr.send()
   xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
          if(xhr.status >=200 && xhr.status <300){
              res.innerHTML = xhr.response
           }
       }
   }
}
function addURLParam(url, key, value){
  url += url.indexOf("?")===-1 ? "?": "&"
  url += encodeURIComponent(key)+"="+encodeURIComponent(value)
  return url
}
```

## POST 请求

> post 请求通常向服务器发送应该保存的数据。

```javascript
xhr.open('POST', 'http://127.0.0.1:3000/server',true)
xhr.send('a=100&b=200&c=200')//向send()中传入数据
```

* 和 GET 请求相比，POST 请求消耗的资源可能会更多一些。从性能角度看，以发送相同的数据计，GET 请求的速度最多可达到 POST 请求的两倍。
* 目前为止，我们知道了两种向服务器发送数据的方式：**表单提交**以及**发送POST请求**，要注意服务器对待这两种方式并不一视同仁，这意味着服务器需要有相应的代码专门处理POST请求发送来的原始数据。但好在我们可以通过POST请求模拟表单提交，只需要简单两步：

1. 设置请求头参数：`Content-Type: application/x-www-form-urlencoded`（表单提交时的内容类型）；
2. 将表单数据序列化为查询字符串形式，传入`.send()`方法；

## 超时设定和网络异常

```javascript
const xhr = new XMLHttpRequest()
//超时设置 2s 设置
xhr.timeout = 2000
//超时回调
xhr.ontimeout = function(){
   alert('网络异常，请稍后重试！')
}
//网络异常
xhr.onerror = function(){
   alert('你的网络似乎出现了一些问题')
}
xhr.open(...)
xhr.send()
xhr.onreadystatechange = function(){
  if(xhr.readyState === 4){
    try{//这里最好使用try-catch处理
      if(xhr.status >=200 && xhr.status <300){
        res.innerHTML = xhr.response
      }
    } catch(e){}                 
  }
}
```

## 取消请求和取消重复请求

**取消请求**

```javascript
xhr.abort()
```

**取消重复请求**

```javascript
const btns = document.getElementsByTagName('button')
let xhr = null //表示对象
let isSending = false //是否正在发送ajax请求

btns[0].onclick = function(){
	//判断标识变量
    if(isSending) xhr.abort()//如果正在发送，则取消该请求，创建一个新的请求
    
    xhr = new XMLHttpRequest()
    isSending = true
    xhr.open('GET', 'http://127.0.0.1:3000/delay')
    xhr.send()
    xhr.onreadystatechange = function(){
        if(xhr.readState === 4){
            //修改标识变量
            isSending = false
        }
    }
}
```

## IE 缓存问题

```javascript
const res = document.getElementById('result')
const btn = document.getElementsByTagName('button')[0]
btn.onclick = function(){
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://127.0.0.1:3000/ie?t='+Date.now())//关注点
    xhr.send()
    xhr.onreadystatechange = function(){...} 
}
```

## axios

```javascript
const btns = document.querySelectorAll('button')

//配置 baseURL
axios.defaults.baseURL = 'http://127.0.0.1:3000'
btns[0].onclick = function () {
    //get 请求
    axios.get('/axios-server', {
        //url 参数
        params: {
            id: 100,
            vip: 7
        },
        //请求头信息
        headers: {
            name: 'ky',
            age: 20
        }
    }).then(val => {
        console.log(val)
    })
}
btns[1].onclick = function () {
    axios.post('/axios-server', {
        username: 'admin'
    }, {
        //url
        params: {
            id: 200
        },
        //请求头
        headers: {
            name: 'ky'
        }
    })
}
btns[2].onclick = function () {
    axios({
        method: 'post',
        url: '/axios-server',
        params: {
            vip: 10
        },
        headers: {
            name: 'ky'
        },
        data: {
            username: 'kky'
        }
    }).then(res => {
        console.log(res)
    })
}
```

## fetch

```javascript
const btns = document.querySelectorAll('button')
btns[0].onclick = function () {
    fetch('http://127.0.0.1:3000/fetch-server?vip=10', {
        method: 'POST',
        //请求头
        headers: {
            name: 'ky'
        },
        //请求体
        body: 'username=admin&password=admin'
    }).then(res => {
        return res.json()
    }).then(res => {
        console.log(res)
    })
}
```



# part 4：跨域

## 同源策略

> 同源策略（Same-Origin Policy）最早由 Netscape 公司提出，是浏览器的一种安全策略。
>
> 浏览器所遵守的“同源策略”是指：**限制不同源之间执行特定操作**。

**同源**：协议、域名、端口号 必须完全相同。

**特定操作**：读取 Cookie, LocalStorage, IndexDB；获取 DOM 元素；发送 AJAX 请求

违背同源策略就是**跨域**。

## 如何解决跨域

### JSONP

**JSONP是什么**

JSONP（JSON with Padding），是一个非官方的跨域解决方案，纯粹凭借程序员的聪明才智开发出来的，只支持 get 请求。

**JSONP 怎么工作的**

在网页有一些标签天生具有跨域能力，比如：img, link, iframe, script

JSONP 就是利用 script 标签的跨域能力来发送请求的。

**JSONP 的使用**

1. 动态的创建一个 script 标签

   `var script = document.createElement("script")`

2. 设置 script 的 src，设置回调函数

   `script.src = “http://localhost:3000/testAJAX?callback=abc”`

3. 添加到 DOM

   `document.body.appendChild(script)`

### CORS

**CORS是什么**

CORS(Cross-Origin Resource Sharing)，跨域资源共享。CORS 是官方的跨域解决方案，它的特点是不需要在客户端做任何特殊的操作，完全在服务器中进行处理，支持 get 和 post 请求。跨域资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。

**CORS怎么工作的**

CORS 是通过设置一个响应头来告诉浏览器，该请求跨域，浏览器收到该响应后就会对响应放行。

**CORS 的使用**

主要是服务器端的设置：

```javascript
app.all('/cors-server', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Method', '*')
    res.send('hello CORS')
})
```
