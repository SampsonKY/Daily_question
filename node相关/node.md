# 前置浏览器知识

## 浏览器内核（渲染引擎）介绍

**浏览器的组成**

- 人机交互部分（UI）
- 网络请求部分（Socket）【接收服务器返回数据的功能】
- Javascript引擎部分（解析执行JavaScript）【Chrome V8引擎】
- 渲染引擎部分（渲染HTML、CSS）等【解释执行CSS、HTML】
- 数据存储部分（cookie、HTML5中的本地存储LocalStorage、SessionStorage）

**主流渲染引擎**

1. 渲染引擎 又叫 排版引擎 或 浏览器内核
2. 主流的 渲染引擎 有
   - **Chrome浏览器**：Blink引擎（WebKit的一个分支）
   - **Safari浏览器**：WebKit引擎，windows版本2008年3月18日推出正式版，但苹果已于2012年7月25日停止开发windows版的safari
   - **FireFox浏览器**：Blink引擎（早期版使用Persto引擎）
   - **Internet Explorer浏览器**：Trident引擎
   - **Microsoft Edge浏览器**：EdgeHTML引擎（Trident的一个分支）
3. **工作原理**

## 浏览器渲染引擎工作原理

**工作原理**

* 解析HTML构建**DOM树**（Document Object Model，文档对象模型），DOM是W3C组织推荐的处理可拓展置标语言的标准编程接口。
* 构建“**渲染树**”，“渲染树”并不等同于“DOM 树”，因为像 `head`标签或`display:none`这样的元素就没有必要放到“渲染树”中了，但他们在“DOM 树”中。
* 对“渲染树”进行布局，定位坐标和大小、确定是否换行、确定position、overflow、z-index等等，这个过程叫**`layout`或`reflow`**。
* 绘制“渲染树”，调用操作系统底层API进行**绘图操作**。

**原理示意图**

​	![image-20200611225238071](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611225238071.png)

**WebKit工作原理（Chrome,Safari,Opera)**

![image-20200611225324822](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611225324822.png)

**Gecko工作原理（FireFox)**

<img src="C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611225457844.png" alt="image-20200611225457844"  />

## 浏览器 reflow 和 layout 过程

**假设一个空网页，有一个按钮和div标签，希望点击按钮添加50个文本框到div中，怎么做？**

- ​	错误的做法：循环创建文本框，每创建一个就添加到div中。这种做法可能导致每添加一个就会导致reflow一次，这种做法有极大的性能问题。
- ​	正确的做法：点击按钮，先创建50个文本框加到一个地方（文本片段，document fragment），然后一次性加到div里面，这样只reflow一次。

**[视频演示](https://www.youtube.com/watch?v=ZTnlxlA5KGw)**

**可以在浏览器看渲染过程**

<img src="C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611230541238.png" alt="image-20200611230541238" style="zoom: 67%;" />

<img src="C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611230621962.png" alt="image-20200611230621962" style="zoom: 67%;" />

## 浏览器访问服务器过程

1. 在浏览器地址栏中输入网址

   ![image-20200611231048541](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611231048541.png)

2. 浏览器通过用户在地址栏中输入的URL构建HTTP请求报文

   ![image-20200611231340514](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611231340514.png)

3. 浏览器发起DNS解析请求，将域名转为IP地址

   ![image-20200611231252871](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611231252871.png)

4. 浏览器将请求报文发送给服务器。

5. 服务器接收请求报文，并解析。

6. 服务器处理用户请求，并将处理结果封装成HTTP响应报文

   ![image-20200611231603713](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611231603713.png)

7. 服务器将HTTP响应报文发送给浏览器。

8. 浏览器接收服务器响应的HTTP报文，并解析。

9. 浏览器解析HTML页面并展示，在解析HTML页面时遇到新的资源需要再次发起请求。

10. 最终浏览器展示出了页面。

## HTTP请求报文和响应报文格式

![image-20200611231850980](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611231850980.png)

1. 请求行（请求方法，请求路径，请求所使用的HTTP协议）或响应行（服务器使用的http协议版本，服务器返回的http状态码，状态码对应的响应消息）
2. 请求报文头 或  http响应报文头 
3. 空一行
4. 请求报文体（get请求无请求报文体）或 响应报文体

## Web开发本质

**牢记三点**

* 请求，客户端发送请求
* 处理，服务器处理请求
* 响应，服务器将处理结果发送给客户端

**客户端处理响应**

* 服务器响应完毕后，客户端继续处理
  * 浏览器：解析服务器返回的数据
  * IOS、Android客户端：解析服务器返回的数据，并通过IOS或Android的UI技术实现页面的展示功能

**关于 C/S（Client/Server）和 B/S （Browser/Server）**

C/S：客户端服务器

B/S：浏览器服务器

![image-20200611233246296](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611233246296.png)

# Node 基础

## Node.js 简介

- Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境
- Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效
- Node.js 的包管理器 npm，是全球最大的开源库生态系统
- javascript 是脚本语言，需要解析器才能执行，浏览器就充当了解析器
- 在Chrome中，解析器就是 V8 引擎，将 javascript 转换成 机器码
- V8 引擎是开源的，由 C++ 语言编写，性能高
- Node.js 高性能，事件驱动，非阻塞，生态圈很好

## REPL介绍

1. REPL 全称：Read-Eval-Print-Loop （交互式解释器）
  - R 读取 - 获取用户输入，解析输入了JavaScript数据结构并存储在内存中。
  - E 执行 - 执行输入的数据结构。
  - P 打印 - 输出结果。
  - L 循环 - 循环操作以上步骤直到用户两次按下 ctrl+c 按钮退出。

2. 在 REPL 中编写程序（类似浏览器开发人员工具中的控制台功能）
  - 直接在控制台输入 `node` 命令进入 REPL 环境

3. 按两次 Control+C 退出 REPL 界面 或者 输入 `.exit` 退出 REPL 界面

## node.js单线程-非阻塞IO解释

![image-20200611142039934](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611142039934.png)

> the callstack: one thread == one call stack == one thing at a time

演示：http://latentflip.com/loupe

## 事件 events

- 多数 Node.js 核心 API 都采用异步事件驱动架构
- 所有能触发事件的对象都是 EventEmitter 类的实例
- 事件名称通常是驼峰式的字符串
- 继承了EventEmitter 类的类的实例也可以使用on，emit等api
- 实践代码

```javascript
var events = require('events')

// 事件 对象
var myEmitter = new events.EventEmitter()

// 绑定 事件名称 和 回调函数
myEmitter.on('someEvent', function (message) {
    console.log(message)
})

// 触发实践，使用事件名称
myEmitter.emit('someEvent', 'The event was emitted')
```

## 文件

**同步文件读写**：同步读写文件，顺序执行，如果读取时间很长，会阻塞进程

```javascript
var fs = require('fs')

var readMe = fs.readFileSync('readMe.txt', 'utf8')
fs.writeFileSync('writeMe.txt', readMe)

console.log(readMe)
console.log('finished sync')
```

**异步文件读写**：异步事件，Nodejs 维护一个事件队列，注册事件，完成后执行主线程。当主线程空闲时，取出执行事件，从线程池中发起线程执行事件， 当事件执行完成后通知主线程。这就是异步高效的原因。

```javascript
var fs = require('fs')

var filename = __dirname + '\\' +'hello.txt' //此处拼接路径的方法并不好

var msg = 'Hello World!'
//写文件
fs.writeFile(filename, msg, 'utf8', (err)=>{
	if(err)console.log(err);
	else console.log('ok')
})
//读文件
fs.readFile('./hello.txt','utf8',(err,data)=>{//若不传utf8,data为buffer类型
    if(err) throw err
    console.log(data)
})

```

注意：`./hello.txt`此处的`./`相对路径，相对的是执行 node 命令的路径

解决方法：`__dirname`（表示当前正在执行的 js文件所在的目录）；`__filename`（表示当前正在执行的 js 文件的完整路径）

`__dirname`和`__filename`不是全局变量

**创建文件目录**

```js
var fs = require('fs')
fs.mkdir('./test', (err)=>{
    if(err) throw err
    console.log('ok')
})
```

**try-catch的使用**

`try-catch`只能捕获同步异常，不能捕获异步异常。对于异步操作，要通过错误号（err.code) 来进行错误处理

```javascript
var fs = require('fs')
try{
   fs.writeFile('./dd/abc.txt','大家好', 'utf8', (err)=>{ //当前目录下没有dd这个目录，但是还是输出了ok，try-catch并未捕获到异常
        console.log('ok')
    }) 
}catch(e){
    console.log('出错了'+e)
}
```

## 路径拼接（path模块）

```javascript
var path = require('path')
var filename = path.join(__dirname, 'hello.txt')
```

## 流和管道

一个简单的例子体验流：ls输出的流，作为grep app 的输入

<img src="C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611190420312.png" alt="image-20200611190420312" style="zoom:67%;" />

- 流（stream）
  - 处理流式数据的抽象接口
  - stream 模块提供了一些基础的 API，用于构建实现了流接口的对象
  - 流可以是可读的、可写的、或是可读写的，所有的流都是 EventEmitter 的实例
  - 流处理数据通过缓存可以提高性能
  - 所有的流都是EventEmitter的实例。
  - 作用：处理数据；提高性能。
- 管道
  - 使用管道，代码量更少
  - myReadStream.pipe(myWriteStream)

示例：

```javascript
var fs = require('fs')
// 创建一个读的流，输入流，相当于读文件
var myReadStream = fs.createReadStream(__dirname + '/readMe.txt')
myReadStream.setEncoding('utf8')
// 创建一个写的流，相当于写文件
var myWriteStream = fs.createWriteStream(__dirname + '/writeMe.txt')

var data = ''
myReadStrem.setEncoding('utf8')

// 接收数据的时候使用 data
myReadStream.on('data', function (chunk) {
    console.log(chunk)//chunk是一段一段的，不是整个文件一下读进去
    //data+=chunk
    myWriteStream.write(chunk)//写文件
})
//接收完数据后，使用end这个监听函数
myReadStream.on('end', function () {
    console.log(data)
})

var writeData = 'hello world'
myWriteStream.write(writeData)
myWriteStream.end()
myWriteStream.on('finish', function () {
    console.log('finished')
})

// 使用管道，代码量更少
myReadStream.pipe(myWriteStream)
//将读的流的输出作为写的流的输入


// 或者
// var data = []
// data.push(chunk)
// data = Buffer.concat(data).toString()
```



## http服务程序（http模块)

### 一个简单的示例

```javascript
// 1.创建一个http服务对象
var server = http.createServer()

// 2.监听用户的请求事件（request事件）
// request 对象包含了用户请求报文中的所有内容，通过 request 对象可以获得所有用户提交过来的数据
// response 对象用来向用户响应一些数据，当服务器要向客户端响应请求数据的时候必须使用 response 对象
// 有了 request 对象和 response 对象，就既可以获取用户提交的数据，也可以向用户响应数据了
server.on('request',(req, res)=>{
    //解决乱码的思路，服务器通过设置 http 响应报文头，告诉浏览器使用相应的编码来解析网页
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write('hello')
    //对于每一个请求，服务器必须结束响应，否则客户端（浏览器）会一直等待服务器响应
    res.end()
})

// 3.启动服务
server.listen(8080, ()=>console.log('server running at http://localhost:8080'))
```

**通过设置http响应报文头来解决浏览器显示html的问题**

```javascript
res.setHeader('Content-Type', 'text/html; charset=utf-8')
```

**响应json**

```javascript
var myObj = {
    name: 'able',
    job: 'programmer',
    age: 27
}
res.end(JSON.stringify(myObj))
```



### request 和 response对象

**request 对象**

- requset：服务器解析用户提交的 http 请求报文，将结果解析到 request 对象中。凡是要获取和用户请求相关的数据都可以通过request对象获取
- request 对象类型 <http.IncomingMessage>，继承自stream.Readable
- request 对象常用成员
  - `request.headers`：请求报文头，返回的是一个对象，这个对象中包含了所有的请求报文头
  - `request.rawHeaders`：请求报文头，返回的是一个数组，数组中保存的都是请求报文头的字符串
  - `request.httpVersion`：获取客户端http协议版本号
  - `request.method`：获取用户请求方法
  - `request.url`：获取用户请求路径（不包含主机名称，端口号，协议）

**response对象**

- response： 在服务器端用来向用户作出响应的对象，凡是需要向用户（客户端）响应的操作，都需要通过 response 对象来进行。

- response 对象类型 <http.ServerResponse>

- response 对象常用成员

  - `response.writeHead()`：直接向客户端响应（写入）http报文头，建议在res.write()和res.end()之前设置，可以用来代替res.statusCode，res.statusMessage，res.setHeader。如果不手动设置，系统也会自动调用。

  - `response.setHeader()`：设置响应报文头，放在res.write()和res.end()之前设置

  - `response.statusCode`：设置http响应状态码

  - `response.statusMessage`：设置http响应状态码对应的消息

  - `response.write(chunk[, encoding][, callback])`：写入数据。这里的编码不是说告诉浏览器用什么编码显示，而是说把data转为比如utf8编码表示的数据，然后发给浏览器。

  - `response.end()`：结束响应（请求）：此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。必须在每个响应上调用此 response.end() 方法。res.end()要响应数据的话，数据必须是string或者Buffer类型

  - ```javascript
    req.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.statusCode =404
    res.statusMessage = 'Not Found'
    res.writeHead(404,'Not Found',{
       'Content-Type':'text/plain; charset=utf-8'
    })
    res.write('hello, world!', 'utf8',()=>{})
    res.end('over')
    ```



### 根据不同请求做出不同响应

**示例的一个问题**：比如当我们在浏览器中输入`http://localhost:8080/asf/asfdf/assf`，响应的内容还是 `hello`，即没有对不同的路径进行处理。

```javascript
var http = require('http')
var fs = require('fs')
var path = require('path')

var server = http.createServer((req,res)=>{
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    // 通过 req.url 获取用户的请求路径，根据不同的请求路径服务器做出不同的响应
    if(req.url === '/' || req.url === '/index'){
        fs.readFile(path.join(__dirname, 'index.html'),(err,data)=>{
            if(err) throw err;
            res.end(data)
        })
    } else if (req.url === '/list') {
        res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
		fs.createReadStream(path.join(__dirname,'list.html')).pipe(res)//使用管道的方法
    } else{
        res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('404 not Found!')
    }
    res.end()
}).listen(8080, () => console.log('server running at http://localhost:8080'))
```

注意这个示例比上个示例精简的地方。

**问题**：当我们请求的网页含有图片,引入了css等的时候，浏览器会再次对服务器发起请求，所以我们需要对图片进行处理。

```javascript
// 处理图片
else if(req.url === '/4.jpg'){
   fs.readFile(path.join(__dirname, 'images','4.jpg'),(err,data)=>{
   	res.setHeader('Content-Type', 'application/x-jpg')
   	res.end(data)
   })
}

// 处理css
else if(req.url === '/css/css.index'){
   fs.readFile(path.join(__dirname, 'css','index.css'),(err,data)=>{
   	res.setHeader('Content-Type', 'text/css')
   	res.end(data)
   })
}

//统一处理
if(req.url.startWith('/resources') && req.method === 'get'){
        fs.readFile(path.join(__dirname,req.url), (err,data)=>{
            if(err) {
                res.end('文件不存在 404')
            } else {
                // 因为不同的文件的Content-Type不同，所以可以通过第三方模块 mime ,来判断不同的资源对应的 Content-Type 类型
                res.setHeader('Content-Type', mime.getType(filename))
                res.end(data)
            }
    	})
    }
```

**问题**：要是一个网站要请求很多图片，为每一个图片写一个判断显然不现实！！！

### 模拟Apache服务器

```javascript
var http = require('http')
var fs = require('fs')
var path = require('path')
var mime = require('mime')  //要先npm install mime

var server = http.createServer((req,res)=>{
    var publicPath = path.join(__dirname, 'public')//假设我们的静态资源存放在public目录下
    var filename = path.join(publicPath, req.url) //将请求路径与publicPath拼接

    fs.readFile(path.join(__dirname,req.url), (err,data)=>{
        if(err) {
            res.end('文件不存在 404')
        } else {
            // 因为不同的文件的Content-Type不同，所以可以通过第三方模块 mime ,来判断不同的资源对应的 Content-Type 类型
            res.setHeader('Content-Type', mime.getType(filename))
            res.end(data)
        }
    })
}).listen(8080, () => console.log('server running at http://localhost:8080'))
```

可以看到，通过这样处理，就不用把每个静态资源文件单独处理了。也不需要对每个路径进行处理了。

**注意**：对于服务器来说请求的url就是一个标识符。比如我们输入index.do，可能返回index.html，或者比如我们输入index.png，也可能返回index.html，返回什么内容完全取决于服务器。

## Buffer

**为什么会有Buffer类型**

1. Buffer 使用来临时存储一些数据（二进制数据）
2. 当我们要把一大块数据从一个地方传输到另一个地方的时候可以通过 Buffer 对象进行传输
3. 通过 Buffer 每次可以传输小部分数据，直到所有数据都传输完毕

**Buffer 和 流**

<img src="C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200612224451315.png" alt="image-20200612224451315" style="zoom:80%;" />

![image-20200612224506204](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200612224506204.png)

![image-20200612224526651](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200612224526651.png)

**类型介绍**

1. JavaScript 语言没有读取或操作二进制数据流的机制。
2. Node.js 中引入了 Buffer 类型是我们可以操作 TCP流 或 文件流。
3. Buffer 类型的对象类似于整型数组，但 Buffer 的大小是固定的、且在 V8 堆外分配物理内存。Buffer 的大小在被创建时确定，且无法调整。（buf.length 是固定的，不允许修改）
4. Buffer 是全局的，所以使用的时候无需 require() 的方式来加载。

**如何创建一个 Buffer 对象**

1. 创建一个 Buffer 对象

   ```javascript
   // 1.通过 Buffer.from() 创建一个 Buffer 对象
   
   // 1.1 通过一个字节数组来创建一个 Buffer 对象
   const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
   
   // 1.2 通过字符串来创建一个 Buffer 对象
   const buf = Buffer.from('你好世界， Hello world!');
   ```

2. 拼接多个 Buffer 对象为一个对象

   ```javascript
   //Buffer.concat(list[,totalLength])
   var bufferList = [buf1, buf2, buf3]
   var buf = Buffer.concat(bufferList)
   ```

3. 获取字符串对应的字节个数

   ```javascript
   //Buffer.byteLength(string[,encoding])
   var len = Buffer.byteLength('你好worlde', 'utf8')
   ```

4. 判断一个对象是否是 Buffer 对象

   ```javascript
   Buffer.isBuffer(obj)
   ```

5. 获取Buffer中的某个字节

   ```javascript
   buf[index]
   ```

6. 获取Buffer 对象中的字节个数

   ```javascript
   buf.length
   //注意：length属性不可修改
   ```

**Buffer对象与编码**

Node.js 目前支持的的编码有：ASCII，utf8，utf16le（ucs2），base64，latin1（binary），hex。



## NPM

> NPM -- Node Package Manager -- Node 包管理
>
> npm 是Node.js默认的、以JavaScript编写的软件包管理器。
>
> [npm 官网](https://www.npmjs.com)
>
> [npm 官方文档](https://docs.npmjs.com)

![image-20200611182058824](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200611182058824.png)

* 更新npm：`npm install npm@latest -g`

* 生成package.json文件：`npm init -y`

## package.json

### package.json

**package.json**：项目描述文件

- 元数据：描述自身的信息

**作用**：

* package.json是一个包说明文件（项目描述文件），用来管理组织一个包（一个项目）
* package.json文件是一个json格式的文件
* 位于当前项目的根目录下

**常见的项**

* name：包的名字
* version：包的版本
* description：包描述
* author：包作者
* main：包的入口js文件，从main字段这里指定的那个js文件开始执行
* dependencies：当前包依赖的其他包

**创建**：`npm init`

### package-lock.json

保存了包的更多信息。

## nodemon

- nodemon 用来监视应用中的任何文件更改并自动重启服务
- 非常适合用在开发环境中，方便啊，不用手动操作了
- 全局安装 `npm install -g nodemon`
- 本地安装 `npm install --save-dev nodemon`
- 启动应用 `nodemon [your node app]`
- 获取修改 package.json 中的启动脚本，添加`nodemon app.js`， 用 npm start 直接启动，方便

# Hackernews项目

## 对路由的简单封装render函数

```javascript
var fs = require('fs')
var http = require('http')
var path = require('path')
var mime = require('mime')

http.createServer((req,res)=>{
    if(req.url === '/' || req.url === '/index'){
        render(path.join(__dirname, 'index.html'),res)
    } else if (req.url === '/list') {
        render(path.join(__dirname, 'list.html'),res)
    } else if (req.url === '/hello'){
        render(path.join(__dirname, 'hello.txt'), res)
    }else if( req.url.startsWith('/resources')) {
        render(path.join(__dirname, req.url),res)
    } else {
        render(path.join(__dirname, '404.html'),res)
    }
}).listen(8080, () => console.log('server running at http://localhost:8080'))

function render(filename, res){
    res.setHeader('Content-Type', mime.getType(filename))
    fs.createReadStream(filename).pipe(res)
    /*
    fs.readFile(filename,(err,data)=>{
    	if(err) thorw err;
    	res.setHeader('Content-Type', mime.getType(filename))
    	res.end(data)
    })
    */
}
```

**改进**：将render函数作为res上的方法，这样可以方便后续使用

```javascript
http.createServer((req,res)=>{

    res.render = (filename)=>{
        res.setHeader('Content-Type', mime.getType(filename))
        fs.createReadStream(filename).pipe(res)
    }

    if(req.url === '/' || req.url === '/index'){
        res.render(path.join(__dirname, 'index.html'))
    } else if (req.url === '/list') {
        res.render(path.join(__dirname, 'list.html'))
    } else if (req.url === '/hello'){
        res.render(path.join(__dirname, 'hello.txt'))
    }else if( req.url.startsWith('/resources')) {
       res.render(path.join(__dirname, req.url))
    } else {
        res.render(path.join(__dirname, '404.html'))
    }
}).listen(8080, () => console.log('server running at http://localhost:8080'))
```

## 获取用户get提交的数据--url模块

既然是 get 提交的数据，所以通过 req.url 就可以直接获取这些数据，但是这样用起来不方便（需要自己去截取字符串，取得自己想要的数据）。

通过 url 模块，可以将用户 get 提交的数据解析成一个 json 对象，使用起来方便。

![image-20200612192846760](C:\Users\theon\AppData\Roaming\Typora\typora-user-images\image-20200612192846760.png)

比如在浏览器输入：`http://localhost:8080/resources?a=sdajlkfa&b=313`

```javascript
url.parse(req.url)
/*
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?a=sdajlkfa&b=313',
  query: 'a=sdajlkfa&b=313',
  pathname: '/resources',
  path: '/resources?a=sdajlkfa&b=313',
  href: '/resources?a=sdajlkfa&b=313'
}
*/
url.parse(req.url, true)
// 与上面的区别在于，query中存的是对象
// query: { a: 'sdajlkfa', b: '313' }
```

**将通过get方式发送表单数据写入data.json文件**

```javascript
var list = []
list.push(url.parse(req.url,true).query)
fs.wirteFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list),(err)=>{})
```

## 服务器端通过设置http响应报文头实现浏览器重定向操作

在上步文件写入成功后，需要跳转列表页

```javascript
else if(req.url.startsWith('/add')){
    var list = []
    list.push(url.parse(req.url,true).query)
    fs.writeFile(path.join(__dirname, 'data', 'data.json'),JSON.stringify(list),(err)=>{
      if(err) throw err;
        
      //关键代码
      res.statusCode = 302;
      res.statusMessage = 'Found';
      res.setHeader('Location', '/') 
      res.end()
    })
} 
```

**上述关于写文件操作存在问题，当我们再push内容的时候，会把前面的内容覆盖，所以需要先将data.json的数据读出来放在list中，然后再将读到的数据push到list，最后写回data.json**

```javascript
else if(req.url.startsWith('/add')){
  //读data.json中的内容并通过utf8转为字符串
  fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', (err,data)=>{
  // err.code === 'ENOENT'是文件不存在的意思，这里要判断一下，如果不存在，data为空
  if(err && err.code !== 'ENOENT') throw err
  var list = JSON.parse(data || '[]')
  
  list.push(url.parse(req.url, true).query)
  //wirteFile的data只能是字符串或者buffer类型，所以通过JSON.stringify先转为字符串
  fs.writeFile(path.join(__dirname, 'data', 'data.json'),JSON.stringify(list), (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.statusMessage = 'Found';
        res.setHeader('Location', '/')
        res.end()
     })
        
  })
} 
```

## 获取post的内容

```javascript
    else if( req.url.startsWith('/add') && req.method.toLowerCase() === 'post'){
        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') throw err
            var list = JSON.parse(data || '[]')
            // 因为post提交数据的时候，数据可能比较大，所以会分多次进行提交，每次提交一部分数据
            //此时要想在服务器中获取用户提交的所有数据，就必须兼听 request 时间的 data 事件（因为每次浏览器提交一部分数据到服务器就会触发一次data事件）
            //那么，什么时候才能表示浏览器把所有数据都提交到服务器呢？就是当 request 对象的 end 事件被触发的时候
            // 此处的 chunk 参数，就是浏览器本次提交过来的一部分数据
            // chunk 的数据类型是 Buffer 对象
            // 声明一个数组，用来保存用户每次提交过来的数据
            var array = []
            req.on('data',(chunk)=>{
                array.push(chunk)
            })
            req.on('end', ()=>{
                //将array中的 Buffer 连接起来，然后转为一个字符串
                var postBody = Buffer.concat(array).toString()

                //postBody大概这种形式：name=%E7%89%9B%E5%A5%B6&sex=%E7%94%B7，	需要使用querysting将其转为对象
                postBody = querystring.parse(postBody)

                list.push(postBody)
                fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), (err) => {
                    if (err) throw err;
                    res.statusCode = 302;
                    res.statusMessage = 'Found';
                    res.setHeader('Location', '/')
                    res.end()
                })
            })
        })
    }
```

## 封装post提交的数据的方法

```javascript
function postBodyData(callback){
    var array = []
     req.on('data',(chunk)=>{
        array.push(chunk)
     })
     req.on('end', ()=>{
        var postBody = Buffer.concat(array).toString()
        postBody = querystring.parse(postBody)
        callback(postBody)
     })
}
```

# Express 框架

## express 介绍

* 什么是express?

  * 基于 Node.js 平台开发的“web开发框架”，就是一个node.js模块
  * express 的作用，它提供了一系列强大的特性，帮助你创建各种Web和移动设备应用
  * express 同时也是 Node.js 的一个模块

* express 官方网站

  * http://expressjs.com
  * http://www.expressjs.com.cn/

* **express特点**

  * 实现了路由功能
  * 中间件(函数)功能
  * 对 req和res对象的拓展
  * 可以集成其他模版引擎

* 安装：`npm install express --save`

## hello world & res.send()

```javascript
const express = require('express')
const app = express() //创建一个app对象（类似于创建一个server对象）
const port = 3000

//通过中间件监听指定的路由的请求
app.get('/', (req, res) => res.send('Hello World!'))

//启动服务
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

* **res.send() 与 res.end() 区别**
  * res.end()只能接收字符串和Buffer，res.send()的参数可以是 a `Buffer` object, a `String`, an object, or an `Array`.
  * res.send()会自动发送更多的相应报文头，其中就包括 `Content-Type: text/html,charset=utf-8`，所以不会产生乱码。

## 注册路由

```javascript
//通过中间件监听指定的路由的请求
// req.url中的pathname部分必须和/ 完全匹配
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/add',(req,res)=> res.send('add'))

//在进行路由匹配的时候不限定方法，什么请求方法都可以
//请求路径中的第一部分只要与 /index 相等即可，并不要求请求路径（pathname）完全匹配
app.use('/index', (req,res)=>res.send('index'))

// 通过app.all()注册路由，不限定请求方法，请求路径的pathname必须完全匹配
app.all('/index', (req,res)=>res.send('all'))

//通过正则表达式，限定请求方法，但不严格匹配路径
app.get(/^\/index(\/.+)*$/, (req,res)=>res.send('hello'))

app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
```

## 通过req.params获取路由中的参数

```javascript
//http://localhost:3000/news/2020/06/13

app.get('/news/:year/:month/:day', (req, res)=>{
    res.send(req.params)
})
//{"year": "2020","month": "06","day": "13"}
```

## 模拟Apache实现静态资源托管服务

```javascript
app.use('/xxx', express.static(path.join(__dirname, 'public'))) //静态资源存放在public目录下
```

## res对象的常见方法

* res.json([body]):参数可以是任何JSON类型，包括对象，数组，字符串，布尔值，数字或null，并且您还可以使用它来将其他值转换为JSON。
* res.redirect([status,] path):重定向到具有指定状态的从指定路径派生的URL，该状态为与HTTP状态码对应的正整数。如果未指定，则状态默认为“ 302”已找到”。
* res.sendFile(path [, options] [, fn]):代替文件操作
* res.status(code).end():设置响应的HTTP状态。
* res.render()

## 路由模块封装

````javascript
//router.js
var express = require('express')
var router = express.Router()

router.get('/index',(req,res)=>{})
router.post('/add', (req,res)=>{})

module.exports = router

//app.js
var router = require('./router')
app.use(router)
````

## 中间件

```javascript
var express = require('express')
var app = express()

var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)

app.get('/', function (req, res) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})

app.listen(3000)
```

# Koa

## Hello World

* 安装：`npm install --save koa`

* hello world

  ```javascript
  const Koa = require('koa')
  const app = new Koa()
  
  app.use(async ( ctx ) => {
    ctx.body = 'hello world'
  })
  
  app.listen(3000,()=>{
      console.log('[demo] start-quick is starting at port 3000')
  }
  ```

## get请求

```javascript
 //从request中获取GET请求
let request =ctx.request;
let req_query = request.query;
let req_querystring = request.querystring;

//从上下文中直接获取
let ctx_query = ctx.query;
let ctx_querystring = ctx.querystring;
```

- query：返回的是格式化好的参数对象。
- querystring：返回的是请求字符串。

**ctx.request和ctx.req的区别**

- ctx.request:是Koa2中context经过封装的请求对象，它用起来更直观和简单。
- ctx.req:是context提供的node.js原生HTTP请求对象。这个虽然不那么直观，但是可以得到更多的内容，适合我们深度编程。

## post请求

* ctx.method属性可以获取请求类型。

* **手动：**

  ```javascript
  const Koa  = require("koa")
  const app = new Koa()
  const querystring = require('querystring');
  
  app.use( async (ctx) =>{
      let url = ctx.url;
      if(url === '/' && ctx.method.toLowerCase() === 'post'){
          let data = await new Promise((res,rej)=>{
              var array = []
              ctx.req.on('data', (chunk) => {
                  array.push(chunk)
              })
              ctx.req.on('end', () =>{
                  var postBody = Buffer.concat(array).toString()
                  postBody = querystring.parse(postBody)
                  res(postBody)
              })
          })
          ctx.body = data
      }else if(url === '/' && ctx.method.toLowerCase() === 'get'){
          let html = `
              <form action="/" method="post">
                  姓名：<input name="name" type="text" />
                  age: <input name="age" type="number" />
                  <button type="submit">提交</button>
              </form>
          `
          ctx.body=html;
      }else{
          ctx.body = '404 Not Found!'
      }
  })
  
  
  app.listen(3000, ()=>console.log('localhost:3000'))
  ```

* 使用中间件`koa-bodyparse`

  ```javascript
  const Koa  = require("koa")
  const app = new Koa()
  
  const bodyparser = require('koa-bodyparser')
  app.use(bodyparser())
  
  app.use( async (ctx) =>{
      let url = ctx.url;
      if(url === '/' && ctx.method.toLowerCase() === 'post'){
          ctx.body = ctx.request.body 
      }else if(url === '/' && ctx.method.toLowerCase() === 'get'){
          let html = `
              <form action="/" method="post">
                  姓名：<input name="name" type="text" />
                  age: <input name="age" type="number" />
                  <button type="submit">提交</button>
              </form>
          `
          ctx.body=html;
      }else{
          ctx.body = '404 Not Found!'
      }
  })
  
  
  app.listen(3000, ()=>console.log('localhost:3000'))
  
  ```

## 路由

**手写**

```javascript
const Koa = require('koa')
const fs = require('fs')

const app = new Koa()

route =async (url)=>{
    switch (url) {
        case '/':
        case '/index':
            page="index.html"
            break;
        case '/list':
            page="list.html"
            break;
        default:
            page="404.html"
            break;
    }
    return await render(page)
}

render = (page)=> new Promise((res,rej)=>{
    console.log(page)
    fs.readFile('../'+page,'utf8',(err,data)=>{
        if(err) rej(err)
        else res(data)
    })
})

app.use(async (ctx)=>{
    let url = ctx.request.url
    let html = await route(url)
    ctx.body = html
})


app.listen(3000,()=>console.log('localhost:3000'))

```

**使用中间件`koa-router`**

```javascript
const Koa = require('koa')
const Router = require('koa-router') 

const app = new Koa()

const router = new Router()//父路径
// const router = new Router({
//     prefix: '/ky'
// })

router.get('/',(ctx,next)=>{
    ctx.body = 'hello world'
}).get('/todo',(ctx,next)=>{
    ctx.body = 'todo page'
})

const page = new Router() //子路径1
page.get('/',(ctx,next)=>{
    ctx.body = ctx.query
}).get('/todo',(ctx,next)=>{
    ctx.body = 'page todo world'
})

const home = new Router()//子路径2
home.get('/',(ctx, next)=>{
    ctx.body = 'home index'
}).get('/todo',(ctx,next)=>{
    ctx.body = 'home todo'
})

router.use('/page',page.routes(),page.allowedMethods())
router.use('/home',home.routes(),home.allowedMethods())

app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000,()=>console.log('127.0.0.1:3000'))

```

## cookie

- ctx.cookies.get(name,[optins]):读取上下文请求中的cookie。
- ctx.cookies.set(name,value,[options])：在上下文中写入cookie。

**写入**

```javascript
const Koa  = require('koa');
const app = new Koa();

app.use(async(ctx)=>{
    if(ctx.url=== '/index'){
        ctx.cookies.set(
            'MyName','ky',{
                domain:'127.0.0.1', // 写cookie所在的域名
                path:'/index',       // 写cookie所在的路径
                maxAge:1000*60*60*24,   // cookie有效时长
                expires:new Date('2018-12-31'), // cookie失效时间
                httpOnly:false,  // 是否只用于http请求中获取
                overwrite:false  // 是否允许重写
            }
        );
        ctx.body = 'cookie is ok';
    }else{
        if( ctx.cookies.get('MyName')){
            ctx.body = ctx.cookies.get('MyName'); //读取cookie
        }else{
            ctx.body = 'Cookie is none';
        }
    }
});

app.listen(3000,()=>{
    console.log('[demo] server is starting at port 3000');
})
```

**Cookie选项(可选)**

比如我们要存储用户名，保留用户登录状态时，你可以选择7天内不用登录，也可以选择30天内不用登录。这就需要在写入是配置一些选项：

- domain：写入cookie所在的域名
- path：写入cookie所在的路径
- maxAge：Cookie最大有效时长
- expires：cookie失效时间
- httpOnly:是否只用http请求中获得
- overwirte：是否允许重写

## ejs

**安装中间件**

* 在koa2中使用模板机制必须依靠中间件，我们这里选择koa-views中间件，先使用npm来进行安装。`cnpm install --save koa-views`

* 安装ejs引擎：`npm install ejs`

**使用示例**

```html
/views/indx.ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
</body>
</html>
```

```javascript
const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa()

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

app.use( async ( ctx ) => {
  let title = 'hello koa2'
  await ctx.render('index', {
    title
  })
})

app.listen(3000,()=>{
    console.log('[demo] server is starting at port 3000');
})
```

## 静态资源

**中间件`koa-static`**

```javascript
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()

const staticPath = './static'

app.use(static(
  path.join( __dirname,  staticPath)
))


app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})
```

# egg

## 介绍及环境搭建

官网：https://eggjs.org

- Egg.js是什么？

  - Egg.js 是《阿里旗下产品》基于Node.js 和Koa 是一个Nodejs 的企业级应用开发框架。可以帮助发团队和开发人员降低开发和维护成本。
  - Express 和Koa 是Node.js 社区广泛使用的框架，简单且扩展性强，非常适合做个人项目。但框架本身缺少约定，标准的MVC 模型会有各种千奇百怪的写法。Egg 按照约定进行开发，奉行『约定优于配置』，团队协作成本低。
  - Egg.js 基于Es6、Es7 以及Typescript、Koa2 使得Nodejs 具有更规范的开发模式、更低的学习成本、更优雅的代码、更少的开发成本、更少的维护成本。**为企业级框架而生**。

- Egg.js特性

  - 提供基于Egg 定制上层框架的能力
  - 高度可扩展的插件机制
  - 内置多进程管理
  - 基于Koa 开发，性能优异
  - 框架稳定，测试覆盖率高
  - 渐进式开发

- **安装**（直接用脚手架）

  ```sh
  $ npm i egg-init -g
  $ egg-init egg-example --type=simple
  $ cd egg-example
  $ npm i
  ```

- 启动

  ```js
  $ npm run dev
  $ open localhost:7001
  ```

## 目录结构介绍

**egg目录结构介绍**

![eggjs目录结构](E:\前端の道\Daily_question\node相关\images\eggjs目录结构.png)

**egg.js 目录约定规范**

![eggjs目录约定](E:\前端の道\Daily_question\node相关\images\eggjs目录约定.png)

**工作流程**

![eggjs工作流程](E:\前端の道\Daily_question\node相关\images\eggjs工作流程.png)

**egg 是一个MVC框架**

- view   							    视图 模版 页面的展示
- Controller控制器             负责处理一些业务逻辑的处理
- model 模型（service）  和数据打交道（查询数据库 请求数据）

**配置路由**

- 在 app/router.js中配置

  ```js
  module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/admin', controller.admin.index);
  };
  ```

- 获取get传值

  ```js
  //获取get传值
  this.ctx.query
  //获取动态路由传值 /news/:name/:age
  this.ctx.params
  ```

**定义controller**

```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
     //调用服务里面的方法     注意异步:await
      // console.log(this);
  }
}

module.exports = HomeController;
```

- egg.Controller，会有下面几个属性挂在 **this** 上。

  - **this.ctx**: 当前请求的上下文 Context 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
  - **this.app**: 当前应用 Application 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
  - **this.service**：应用定义的 Service，通过它我们可以访问到抽象出的业务层，等价于 this.ctx.service 。
  - **this.config**：应用运行时的配置项。
  - **this.logger**：logger 对象，上面有四个方法（debug，info，warn，error），分别代表打印四个不同级别的日志，使用方法和效果与 context logger 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置。

**定义service**

```js
'use strict';
const Service = require('egg').Service;

class NewsService extends Service {
  async getNewsList() {
	 //通过抓取接口返回数据
     //curl的方法可以获取远程的数据
     const url = this.config.api+'appapi.php?a=getPortalList&catid=20&page=1'
     const response = await this.ctx.curl(url) //返回的是buffer
    var data = JSON.parse(response.data)
    return data.result
  }
}

module.exports = NewsService;
```

- 服务继承Service为了方便egg在this上面绑定以下的方法：

  - this.ctx: 当前请求的上下文 Context 对象的实例，通过它我们可以拿到框架封装好的处理当前请求的各种便捷属性和方法。
  - this.app: 当前应用 Application 对象的实例，通过它我们可以拿到框架提供的全局对象和方法。
  - this.service：应用定义的 Service，通过它我们可以访问到其他业务层，等价于 this.ctx.service 。
  - this.config：应用运行时的配置项。
  - this.logger：logger 对象，上面有四个方法（debug，info，warn，error），分别代表打印四个不同级别的日志，使用方法和效果与 context logger 中介绍的一样，但是通过这个 logger 对象记录的日志，在日志前面会加上打印该日志的文件路径，以便快速定位日志打印位置

- Service 文件必须放在 app/service 目录，可以支持多级目录，访问的时候可以通过目录名级联访问。

- **使用**，比如在controller中

  ```js
  const list = await this.service.news.getNewsList();
  ```

- eggjs中内置了**curl**方法，curl的方法可以获取远程的数据

## 配置模版引擎

**安装与配置**

- 安装ejs插件：`npm i egg-view-ejs --save`

- 在 /config/plugin.js中配置

  ```js
  module.exports = {
    ejs: {
      enable: true,
      package: 'egg-view-ejs'
    }
  };
  ```

- 在 config/config.default.js 中配置

  ```js
  module.exports = appInfo => {
    const config = exports = {};
    //....
  
    //配置ejs模版引擎
    config.view = {
      mapping: {
        '.ejs': 'ejs'
      }
    }
    //...
  };
  ```

**使用**

- 在 app/view 目录下放模版文件

  ```js
  // app/view/index.ejs
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Document</title>
  </head>
  <body>
      <h2><%=username%></h2>
  </body>
  </html>
  ```

- 使用

  ```js
  'use strict';
  
  const Controller = require('egg').Controller;
  
  class NewsController extends Controller {
    async index() {
      this.ctx.render('index.ejs', {
          username: 'ky'
      })
    }
  }
  
  module.exports = NewsController;
  ```

## 静态文件

- eggjs 中的静态文件存放在 /app/public 文件夹下，默认是可访问的，无需配置

- 比如可以在其中存放一些css、js

- 比如在 index.ejs 引入css

  ```js
  // app/view/index.ejs
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Document</title>
  	<link rel="stylesheet" href="/public/css/style.css">
  </head>
  <body>
      <h2><%=username%></h2>
  </body>
  </html>
  ```

## 中间件

- 在 /app/middleware中配置，一个文件就是一个中间件

- 比如：这个例子限制ip访问

  ```js
  // app/middleware/forbidip.js
  /*
   options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来。
      app: 当前应用 Application 的实例。
  */
  module.exports = (options, app)=>{
      //返回一个异步的方法
      return async function forbidIp(ctx, next){
          //要屏蔽的ip: 1.从数据库获取 2.从参数传入
          // const forbidip = '127.0.0.1' //要屏蔽的ip
          const forbidips = options.forbidips
          //获取客户端的ip
          console.log(ctx.request.ip)
          if(forbidips.includes(ctx.request.ip)){
              ctx.status = 403
              ctx.body="您的ip已经被屏蔽"
          } else {
              await next() 
          }
  
      }
  }
  ```

- 写好中间件后，需要在 /config/config.default.js 中配置

  ```js
  module.exports = appInfo => {
    //配置公共的api地址
    config.api = 'http://www.phonegap100.com/'
    //...
    // add your middleware config here
    config.middleware = ['forbidip'];
    //给forbidip中间件传入参数
    config.forbidip={
      forbidips:[
        '127.0.0.1',
        '192.168.137.1'
      ]
    }
    ...
  };
  
  ```

## 扩展extend

- 可以扩展context、application、request、response和**helper**

- 比如扩展context

  ```js
  // app/extend/context.js
  module.exports = {
      getIp(){
          //this就是ctx对象，在其中可以调用ctx上的其他方法或属性
          return this.request
      }
  }
  ```

  外部可通过this.ctx.getIp()访问

- 扩展application

  ```js
  // app/extend/application.js
  module.exports = {
      //外部可以通过this.app.foo()
      foo(param){
          //this就是app对象，在其中可以调用app上的其他方法，或访问属性
          console.log(this)
      }
  }
  ```

- 扩展工具，比如一个格式化日期扩展

  ```js
  var sd = require('silly-datetime');
  module.exports = {
      formatTime(param) {
        // this 是 helper 对象，在其中可以调用其他 helper 方法
        // this.ctx => context 对象
        // this.app => application 对象
        
        //格式化日期
        return sd.format(new Date(param*1000), 'YYYY-MM-DD HH:mm');
      },
      getHelperData(){
        return '我是helper里面的数据'
      }
  };
  ```

  **使用**：

  - 比如在ejs模版引擎中使用`<%=helper.formatTime(list[i].dateline)%>`;
  - 在controller中使用：`this.ctx.helper.getHelperData()`

## 安全 csrf防范

```jsx
//form.ejs
<form action="/add?_csrf=<%=csrf%>" method="POST">
    <!-- 也可以用隐藏表单域的方式 -->
    <!-- <input type="hidden" name="_csrf" value="<%=csrf%>"/> -->

    用户名：<input type="text" name="username"/><br><br>
    密码：<input type="password" name="password"><br><br>
    <button type="submit">提交</button>
</form>
```

**controller 不使用中间件**

```js
async form(){
  //this.ctx.csrf 用户访问这个页面的时候生成密钥

  await this.ctx.render('form.ejs',{
     csrf: this.ctx.csrf
   })
}
```

**使用中间件**

```js
// app/middleware/auth.js
module.exports =(option,app)=>{
    return async function auth(ctx, next){
        ctx.state.csrf = ctx.csrf
        await next()
    }
}
```

```js
async form(){
  //this.ctx.csrf 用户访问这个页面的时候生成密钥

  await this.ctx.render('form.ejs')
}
```

## cookie

```js
'use strict';

const Controller = require('egg').Controller;

class CookieController extends Controller {
  async index() {
    //设置一个值
    /*
        cookie可以实现同一个浏览器访问同一个域的时候，不同页面之间的数据共享
        也可以实现数据的持久化（关闭浏览器重新打开以后数据还存在）
        第一个参数：cookies的名称
        第二个参数：cookies的值
        第三个参数：配置
        默认情况：cookies当浏览器关闭后就销毁了
        注意：默认情况下egg.js里面的cookie没法设置中文,如果cookie加密(encrypt)后，就可以设置为中文
    */
    this.ctx.cookies.set('username', 'ky',{
        maxAge:1000*3600*24, //cookie存储一天
        httpOnly: true, //true表示不允许JavaScript访问
        signed: true, //对cookie进行签名，放置用户修改cookie
        encrypt: true //是否对cookie加密，如果cookie加密，那么获取的时候需要对cookie进行解密
    })
  async loginOut(){
      //清理cookie
    this.ctx.cookies.set('username', null)
      //也可以通过设置maxAge=0
    //   this.ctx.cookies.set('username', null,{
    //       maxAge: 0
    //   })
      this.ctx.redirect('/page')
  }

}
module.exports = CookieController;
```

在另一个页面获取，使用cookie

```js
'use strict';

const Controller = require('egg').Controller;

class CookieController extends Controller {
  async page(){
      //获取加密cookies
    let userinfo = this.ctx.cookies.get('username',{
        encrypt:true
    })
    await this.ctx.render('page2.ejs',{
        userinfo
    })
  }
}

module.exports = CookieController;
```

## 例子：新闻系统

// **app/router.js**

```js
'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/news', controller.news.index)
  router.get('/newscontent', controller.news.content)
};
```

**// app/controller/news.js**

```js
'use strict';

const Controller = require('egg').Controller;

class NewsController extends Controller {
  async index() {
    const { ctx } = this;
    //获取数据显示到新闻页面
    const list = await this.service.news.getNewsList();
    await ctx.render('news.ejs',{
        list
    })
  }

  async content(){
      //获取get传值
      const aid = this.ctx.query.aid;
      const list = await this.service.news.getNewsContent(aid);
      await this.ctx.render('newscontent.ejs',{
          list:list[0]
      })
  }
}

module.exports = NewsController;

```

**// app/service/news.js**

```js
'use strict'
const Service = require('egg').Service;

class NewsService extends Service{
    async getNewsList(){
        //通过抓取接口返回数据
        //curl的方法可以获取远程的数据
        const url = this.config.api+'appapi.php?a=getPortalList&catid=20&page=1'
        const response = await this.ctx.curl(url) //返回的是buffer
        var data = JSON.parse(response.data)
        return data.result
    }

    //获取新闻详情
    async getNewsContent(aid){
        //通过抓取接口返回数据
        //curl的方法可以获取远程的数据
        const url = this.config.api+'appapi.php?a=getPortalArticle&aid='+aid
        const response = await this.ctx.curl(url) //返回的是buffer
        var data = JSON.parse(response.data)
        return data.result
    }
}

module.exports = NewsService;
```

**config/config.default.js**

```js
'use strict';
module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_1605595878512_8077';

  //配置ejs模版引擎
  config.view = {
    mapping: {
      '.ejs': 'ejs'
    }
  }
  //配置公共的api地址
  config.api = 'http://www.phonegap100.com/'

  // add your middleware config here
  config.middleware = ['auth','printdate', 'forbidip'];

  //给printdate中间件传入参数
  config.printdate={
    aaa:'aaaa'
  }

  config.forbidip={
    forbidips:[
      '127.0.0.1',
      '192.168.137.1'
    ]
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
```

**config/plugin.js**

```js
'use strict';
module.exports = {
  ejs: {
    enable: true,
    package: 'egg-view-ejs'
  }
};
```

**app/middleware/auth.js**

```js
module.exports =(option,app)=>{
    return async function auth(ctx, next){
        ctx.state.csrf = ctx.csrf
        await next()
    }
}
```

**app/middleware/forbidip.js**

```js
/*
    options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来。
    app: 当前应用 Application 的实例。

    配置中间件
*/
module.exports = (options, app)=>{
    //返回一个异步的方法
    return async function forbidIp(ctx, next){
        //要屏蔽的ip: 1.从数据库获取 2.从参数传入

        // const forbidip = '127.0.0.1' //要屏蔽的ip
        const forbidips = options.forbidips
        //获取客户端的ip
        console.log(ctx.request.ip)
        if(forbidips.includes(ctx.request.ip)){
            ctx.status = 403
            ctx.body="您的ip已经被屏蔽"
        } else {
            await next() 
        }

    }
}
```

**app/extend/helper.js**

```js
var sd = require('silly-datetime');
module.exports = {
    formatTime(param) {
      // this 是 helper 对象，在其中可以调用其他 helper 方法
      // this.ctx => context 对象
      // this.app => application 对象
      
      //格式化日期
      return sd.format(new Date(param*1000), 'YYYY-MM-DD HH:mm');
    },
    getHelperData(){
      return '我是helper里面的数据'
    }
};
```

**app/view/news.ejs**

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h2>新闻列表数据</h2>

    <ul>
        <%for(var i=0; i<list.length; i++){%>
            <li><a href="/newscontent?aid=<%=list[i].aid%>"><span><%=helper.formatTime(list[i].dateline)%></span>---<%=list[i].title%></a></li>
        <%}%>
    </ul>
</body>
</html>
```

**app/view/newscontent.ejs**

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <link rel="stylesheet" href="/public/css/basic.css">
</head>
<body>
    <div class="content">
        <h2><%=list.title%></h2>

        <div>
            <%-list.content%>
        </div>
    </div>

</body>
</html>
```

