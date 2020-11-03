#### 2.1 洋葱模型简介

![img](https://mmbiz.qpic.cn/mmbiz_png/jQmwTIFl1V2VKicWozBAOabSRdico9uTF0crNo05v6GxwY4cKkFXlTUkDcPicy9YZMXchOpPcWv5k9ahZ8F32SR3Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

（图片来源：https://eggjs.org/en/intro/egg-and-koa.html）

在上图中，洋葱内的每一层都表示一个独立的中间件，用于实现不同的功能，比如异常处理、缓存处理等。每次请求都会从左侧开始一层层地经过每层的中间件，当进入到最里层的中间件之后，就会从最里层的中间件开始逐层返回。因此对于每层的中间件来说，在一个 **请求和响应** 周期中，都有两个时机点来添加不同的处理逻辑。

#### 2.2 洋葱模型应用

除了在 Koa 中应用了洋葱模型之外，该模型还被广泛地应用在 Github 上一些不错的项目中，比如 koa-router 和阿里巴巴的 midway、umi-request 等项目中。

介绍完 Koa 的中间件和洋葱模型，阿宝哥根据自己的理解，抽出以下通用的任务处理模型：

![img](https://mmbiz.qpic.cn/mmbiz_jpg/jQmwTIFl1V2VKicWozBAOabSRdico9uTF0qs4jYLLsBic119uM5Br02WJmWgCHibGNibZiawVoNWEnGrTwnPDXAvvz8Q/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

上图中所述的中间件，一般是与业务无关的通用功能代码，比如用于设置响应时间的中间件：

```
// x-response-time
async function responseTime(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set("X-Response-Time", ms + "ms");
}
```

其实，对于每个中间件来说，前置处理器和后置处理器都是可选的。比如以下中间件用于设置统一的响应内容：

```
// response
async function respond(ctx, next) {
  await next();
  if ("/" != ctx.url) return;
  ctx.body = "Hello World";
}
```

尽管以上介绍的两个中间件都比较简单，但你也可以根据自己的需求来实现复杂的逻辑。Koa 的内核很轻量，麻雀虽小五脏俱全。它通过提供了优雅的中间件机制，让开发者可以灵活地扩展 Web 服务器的功能，这种设计思想值得我们学习与借鉴。

https://juejin.im/post/6844903597776306190#heading-1

https://juejin.im/post/6844903457757855757

https://zhuanlan.zhihu.com/p/20597452

https://juejin.im/book/6844733816460804104/section/6844733816599216141