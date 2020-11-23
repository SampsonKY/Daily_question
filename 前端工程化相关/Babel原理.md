> [Babel官网](https://www.babeljs.cn/)
>
> [这个网站](https://astexplorer.net/)可以看到将代码转为AST
>
> 推荐阅读：[Babel原理](https://juejin.cn/post/6844903760603398151)

**Babel是什么**

> Babel 是一个 JavaScript 编译器。主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。

**Babel运行原理**

- **解析**：接收代码并根据 ESTree 规范生成 AST，Babel 使用的解析器是 [babylon](https://github.com/babel/babylon)。
  - **词法分析**（Lexical Analysis）：把字符串形式的代码转换为 令牌（tokens） 流。
  - **语法分析**（Syntactic Analysis）：会把一个令牌流转换成 AST 的形式

- **转换**：接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作

  > Babel提供了@babel/traverse(遍历)方法维护这AST树的整体状态，并且可完成对其的替换，删除或者增加节点，这个方法的参数为原始AST和自定义的转换规则，返回结果为转换后的AST。

- **生成**：代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。【深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。】

  > Babel使用 @babel/generator 将修改后的 AST 转换成代码，生成过程可以对是否压缩以及是否删除注释等进行配置，并且支持 sourceMap。

![img](https://user-gold-cdn.xitu.io/2019/1/14/1684a0f660525586?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**如何在项目中使用**

- **配置文件.babelrc**

  先安装：

  ```js
  # 最新转码规则
  $ npm install --save-dev @babel/preset-env
  
  # react 转码规则
  $ npm install --save-dev @babel/preset-react
  ```

  编写配置文件：

  ```js
    {
      "presets": [ //设定转码规则
        "@babel/env",
        "@babel/preset-react"
      ],
      "plugins": []
    }
  ```

- **命令行转码**

  先安装：

  ```js
  $ npm install --save-dev @babel/cli
  ```

  使用：

  ```js
  # 转码结果输出到标准输出
  $ npx babel example.js
  
  # 转码结果写入一个文件
  # --out-file 或 -o 参数指定输出文件
  $ npx babel example.js -o compiled.js
  
  # 整个目录转码
  # --out-dir 或 -d 参数指定输出目录
  $ npx babel src -d lib
  
  # -s 参数生成source map文件
  $ npx babel src -d lib -s
  ```

- **bable-node**

  提供一个支持 ES6 的 REPL 环境。它支持 Node 的 REPL 环境的所有功能，而且可以直接运行 ES6 代码。

  安装：

  ```sh
  $ npm install --save-dev @babel/node
  ```

  使用：

  ```bash
  $ npx babel-node
  > (x => x * 2)(1)
  2
  ```

  

