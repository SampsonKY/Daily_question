# webpack

## 概念篇

### 安装

```javascript
npm install webpack webpack-cli -g  //全局安装命令行工具
npm install webpack -d //项目内使用
```

在一个项目中（项目中确保有 `package.json` 文件）安装好 webpack 后，创建一个 `./src/index.js` 文件，可以写任意 JS 代码。然后执行 `npm run build` 或 `yarn build` 命令，就会发现增加了一个 `dist` 目录，里面存放的就是 webpack 构建好的 `main.js` 文件。

### 基本概念

![img](https://img.kancloud.cn/2b/d3/2bd341d8d2d5db903750e08332d7f523_1896x755.jpg)

> 本质上,webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)。当 webpack 处理应用程序时,它会**递归地**构建一个**依赖关系图**(dependency graph)，其中包含应用程序需要的每个模块,然后将所有这些模块打包成一个或多个 bundle。
>
> webpack 就像一条生产线,要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能,在特定的时机对生产线上的资源做处理。
> webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 webpack 的事件流机制保证了插件的有序性,使得整个系统扩展性很好。 
>
> ----- 深入浅出 webpack 吴浩麟

#### 入口

> 入口起点(entry point)指示 webpack 应该使用哪个模块,来作为构建其内部依赖图的开始。
>
> 进入入口起点后,webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
>
> 每个依赖项随即被处理,最后输出到称之为 bundles 的文件中。

如上图所示，在多个代码模块中会有一个起始的 `.js` 文件，这个便是 webpack 构建的入口。webpack 会读取这个文件，并从它开始解析依赖，然后进行打包。默认的入口文件是 `./src/index.js` 。常见项目中，如果是单页面应用，可能的入口只有一个；如果是多页面项目，经常是一个页面一个入口。

入口可以使用 `entry` 字段来进行配置。

```js
module.exports = {
  entry: './src/index.js' 
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 或者配置多个入口
module.exports = {
  entry: {
    foo: './src/page-foo.js',
    bar: './src/page-bar.js', 
    // ...
  }
}

// 使用数组来对多个文件进行打包,可以理解为多个文件作为一个入口
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}
```

#### loader

> webpack 中提供一种处理多种文件格式的机制，便是使用 loader。我们可以把 loader 理解为是一个**转换器**，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块。
>
> 本质上,webpack loader 将所有类型的文件,转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

举个例子，在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件，如果入口文件依赖一个 .hbs 的模板文件以及一个 .css 的样式文件，那么我们需要 handlebars-loader 来处理 .hbs 文件，需要 css-loader 来处理 .css 文件（这里其实还需要 style-loader），最终把不同格式的文件都解析成 js 代码，以便打包后在浏览器中运行。

当我们需要使用不同的 loader 来解析处理不同类型的文件时，我们可以在 `module.rules` 字段下来配置相关的规则，例如使用 Babel 来处理 .js 文件：

```js
module: {
  // ...
  rules: [
    {
      test: /\.jsx?/, // 匹配文件路径的正则表达式，通常我们都是匹配文件类型后缀
      include: [
        path.resolve(__dirname, 'src') // 指定哪些路径下的文件需要经过 loader 处理
      ],
      use: 'babel-loader', // 指定使用的 loader
    },
  ],
}
```

loader 支撑着 webpack 来处理文件的多样性。

#### plugin

在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。可以这么理解，**模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成**。通过添加我们需要的 plugin，可以满足更多构建中特殊的需求。例如，要使用压缩 JS 代码的 uglifyjs-webpack-plugin 插件，只需在配置中通过 `plugins` 字段添加新的 plugin 即可：

```js
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyPlugin()
  ],
}
```

plugin 理论上可以干涉 webpack 整个构建流程，可以在流程的每一个步骤中定制自己的构建需求。

#### 输出

webpack 的输出即指 webpack 最终构建出来的静态文件。当然，**构建结果的文件名、路径等都是可以配置的**，使用 `output` 字段：

```js
module.exports = {
  // ...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
}

// 或者多个入口生成不同文件
module.exports = {
  entry: {
    foo: './src/foo.js',
    bar: './src/bar.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
}

// 路径中使用 hash，每次构建时会有一个不同 hash 值，避免发布新版本时线上使用浏览器缓存
module.exports = {
  // ...
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/[hash]',
  },
}
```

我们一开始直接使用 webpack 构建时，默认创建的输出内容就是 `./dist/main.js`。

### 一个简单的配置示例

webpack 运行时默认读取项目下的 `webpack.config.js` 文件作为配置。

```js
// webpack.config.js
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
    ],
  },

  // 代码模块路径解析的配置
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],

    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  },

  plugins: [
    new UglifyPlugin(), 
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    // 如果你留意了我们一开始直接使用 webpack 构建的结果，你会发现默认已经使用了 JS 代码压缩的插件
    // 这其实也是我们命令中的 --mode production 的效果，后续的小节会介绍 webpack 的 mode 参数
  ],
}

```

webpack 的配置其实是一个 Node.js 的脚本，这个脚本对外暴露一个配置对象，webpack 通过这个对象来读取相关的一些配置。创建了 `webpack.config.js` 后再执行 webpack 命令，webpack 就会使用这个配置文件的配置了。

## 基本需求篇

### 基本需求

- 构建我们发布需要的 HTML、CSS、JS 文件
- 使用 CSS 预处理器来编写样式
- 处理和压缩图片
- 使用 Babel 来支持 ES 新特性
- 本地提供静态服务以方便开发调试

### 关联 HTML

webpack  默认从作为入口的 .js 文件进行构建（更多是基于 SPA 去考虑），但通常一个前端项目都是从一个页面（即 HTML）出发的，最简单的方法是，创建一个 HTML 文件，使用 `script` 标签直接引用构建好的 JS 文件，如：

```html
<script src="./dist/bundle.js"></script>
```

但是，如果我们的**文件名或者路径会变化**，例如使用 `[hash]` 来进行命名，那么最好是将 HTML 引用路径和我们的构建结果关联起来，这个时候我们可以使用 [html-webpack-plugin](https://doc.webpack-china.org/plugins/html-webpack-plugin/)。

html-webpack-plugin 是一个独立的 node package，所以在使用之前我们需要先安装它，把它安装到项目的开发依赖中：

```js
npm install html-webpack-plugin -D 
```

然后在 webpack 配置中，将 html-webpack-plugin 添加到 plugins 列表中：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({//不添加参数会使用默认html模版
        filename: 'index.html', // 配置输出文件名和路径
      	template: 'assets/index.html', // 配置文件模板
    }),
  ],
}
```

如果需要添加多个页面关联，那么实例化多个 `html-webpack-plugin`， 并将它们都放到 `plugins` 字段数组中就可以了。

### 构建 CSS

我们编写 CSS，并且希望使用 webpack 来进行构建，为此，需要在配置中引入 loader 来解析和处理 CSS 文件：

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  }
}
```

> style-loader 和 css-loader 都是单独的 node package，需要安装。

我们创建一个 index.css 文件，并在 index.js 中引用它，然后进行构建。

```js
import "./index.css"
```

可以发现，构建出来的文件并没有 CSS，先来看一下新增两个 loader 的作用：

- `css-loader` 负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 `@import` 和 `url()` 等引用外部文件的声明；
- `style-loader` 会将 `css-loader` 解析的结果转变成 JS 代码，运行时动态插入 `style` 标签来让 CSS 代码生效。

经由上述两个 loader 的处理后，CSS 代码会转变为 JS，和 index.js 一起打包了。

如果需要单独把 CSS 文件分离出来，可以使用 `mini-css-extract-plugin` 插件。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
        ], 
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
}
```

### CSS 预处理器

在上述使用 CSS 的基础上，通常我们会使用 Less/Sass 等 CSS 预处理器，webpack 可以通过添加对应的 loader 来支持，以使用 Less 为例，我们可以在官方文档中找到对应的 [loader](https://doc.webpack-china.org/loaders/less-loader)。

我们需要在上面的 webpack 配置中，添加一个配置来支持解析后缀为 `.less` 的文件：

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.less$/,
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader'
        ]
      },
    ],
  },
  // ...
}
```

### 处理图片文件

在前端项目的样式中总会使用到图片，虽然我们已经提到 **css-loader 会解析样式中用 `url()` 引用的文件路径**，但是图片对应的 jpg/png/gif 等文件格式，webpack 处理不了。是的，我们只要添加一个处理图片的 loader 配置就可以了，现有的 file-loader 就是个不错的选择。

file-loader 可以用于处理很多类型的文件，它的主要作用是**直接输出文件**，把构建后的文件路径返回。配置很简单，在 `rules`中添加一个字段，增加图片类型文件的解析配置：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
}
```

更多关于 file-loader 的配置可以参考官方文档 [file-loader](https://webpack.js.org/loaders/file-loader/)。

### 使用 Babel

[Babel](http://babeljs.io/) 是一个让我们能够使用 ES 新特性的 JS 编译工具，我们可以在 webpack 中配置 Babel，以便使用 ES6、ES7 标准来编写 JS 代码。

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.jsx?/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'src'), // src 目录下的才需要经过 babel-loader 处理
        ],
        loader: 'babel-loader',
      },
    ],
  },
}
```

Babel 的相关配置可以在目录下使用 .babelrc 文件来处理，详细参考 Babel 官方文档 [.babelrc](http://babeljs.io/docs/usage/babelrc/)。

### 启动静态服务

使用 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 在本地开启一个简单的静态服务来进行开发。

在项目下安装 `webpack-dev-server`，然后添加启动命令到 package.json 中：

```json
"scripts": {
  "build": "webpack --mode production",
  "start": "webpack-dev-server --mode development"
}
```

尝试着运行 `npm run start` 或者 `yarn start`，然后就可以访问 http://localhost:8080/ 来查看你的页面了。默认是访问 index.html，如果是其他页面要注意访问的 URL 是否正确。

## 路径解析篇

在 webpack 支持的前端代码模块化中，我们可以使用类似 `import * as m from './index.js'` 来引用代码模块 `index.js`。引用第三方类库则是像这样：`import React from 'react'`。webpack 构建的时候，会解析依赖后，然后再去加载依赖的模块文件，那么 webpack 如何将上述编写的 `./index.js` 或 `react` 解析成对应的模块文件路径呢？

webpack 中有一个很**关键的模块 [enhanced-resolve](https://github.com/webpack/enhanced-resolve/)** 就是处理依赖模块路径的解析的，这个模块可以说是 Node.js 那一套模块路径解析的增强版本，有很多可以自定义的解析配置。

### 模块解析规则

- 解析**相对路径**
  1. 查找相对当前模块的路径下是否有对应文件或文件夹
  2. 是文件则直接加载
  3. 是文件夹则继续查找文件夹下的 package.json 文件
  4. 有 package.json 文件则按照文件中 `main` 字段的文件名来查找文件
  5. 无 package.json 或者无 `main` 字段则查找 `index.js` 文件
- 解析模块名
  查找当前文件目录下，父级目录及以上目录下的 `node_modules` 文件夹，看是否有对应名称的模块
- 解析绝对路径（不建议使用）
  直接查找对应路径的文件

在 webpack 配置中，和模块路径解析相关的配置都在 `resolve` 字段下。

```js
module.exports = {
  resolve: {
    // ...
  }
}
```

### 常用配置

```javascript
resolve: {
    
    alias:{//①配置某个模块别名
        util: path.resolve(__dirname, 'src/utils')
    },
        
    modules: ["node_modules"],
    //对于直接声明依赖名的模块（如react），webpack 会类似 Node.js 一样进行路径搜索，搜索 node_modules 目录，这个目录就是使用 resolve.modules 字段进行配置的
        
    mainFields: ["module", "main"],
    
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx",".css"],
    //这里的顺序代表匹配后缀的优先级，例如对于 index.js 和 index.jsx，会优先选择 index.js
    //这个配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找
},
    
//使用①
import 'utils/util.js' //import '[项目绝对路径]/src/utils/util.js'
```

## loader 篇

```js
module.exports = {
  // ...
  rules: [ 
      {
        resource: {//resource 的匹配条件(使用请求资源文件的绝对路径来进行匹配)
          test: /\.jsx?/, 
          include: [ 
            path.resolve(__dirname, 'src'),
          ],
        },
        // 如果要使用 issuer 匹配，便是 issuer: { test: ... }
        use: 'babel-loader',
      },
      // ...
    ], 
}
```

### 规则条件匹配

大多数情况下，配置 loader 的匹配条件时，只要使用 `test` 字段就好了，但为了一些复杂的条件 webpack 的规则提供了多种配置形式：

- `{ test: ... }` 匹配特定条件
- `{ include: ... }` 匹配特定路径
- `{ exclude: ... }` 排除特定路径
- `{ and: [...] }`必须匹配数组中所有条件
- `{ or: [...] }` 匹配数组中任意一个条件
- `{ not: [...] }` 排除匹配数组中所有条件

上述的所谓条件的值可以是：

- 字符串：必须以提供的字符串开始，所以是字符串的话，这里我们需要提供绝对路径
- 正则表达式：调用正则的 `test` 方法来判断匹配
- 函数：(path) => boolean，返回 `true` 表示匹配
- 数组：至少包含一个条件的数组
- 对象：匹配所有属性值的条件

通常我们会结合使用 `test/and` 和 `include&exclude` 来配置条件

### 使用 loader 配置

```js
rules: [
  {
    test: /\.less/,
    use: [
      'style-loader', // 直接使用字符串表示 loader
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        },
      }, // 用对象表示 loader，可以传递 loader 配置等
      {
        loader: 'less-loader',
        options: {
          noIeCompat: true
        }, // 传递 loader 配置
      },
    ],
  },
],
```

### loader 应用顺序

一个匹配规则中可以配置使用多个 loader，即一个模块文件可以经过多个 loader 的转换处理，执行顺序是从最后配置的 loader 开始，一步步往前。例如，对于上面的 `less` 规则配置，一个 style.less 文件会途径 less-loader、css-loader、style-loader 处理，成为一个可以打包的模块。

上述从后到前的顺序是在同一个 rule 中进行的，那如果多个 rule 匹配了同一个模块文件，loader 的应用顺序又是怎样的呢？看一份这样的配置：

```js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    enforce: 'pre'
  },
],
```

这样无法法保证 eslint-loader 在 babel-loader 应用前执行。webpack 在 `rules` 中提供了一个 `enforce` 的字段来配置当前 rule 的 loader 类型，没配置的话是普通类型，我们可以配置 `pre` 或 `post`，分别对应前置类型或后置类型的 loader。

> eslint-loader 要检查的是人工编写的代码，如果在 babel-loader 之后使用，那么检查的是 Babel 转换后的代码，所以必须在 babel-loader 处理之前使用。

还有一种行内 loader，即我们在应用代码中引用依赖时直接声明使用的 loader，如 `const json = require('json-loader!./file.json')` 这种。不建议在应用开发中使用这种 loader。

顾名思义，所有的 loader 按照**前置 -> 行内 -> 普通 -> 后置**的顺序执行。

当项目文件类型和应用的 loader 不是特别复杂的时候，通常建议把要应用的同一类型 loader 都写在同一个匹配规则中，这样更好维护和控制。

### 使用 `noParse`

在 webpack 中，我们需要使用的 loader 是在 `module.rules` 下配置的，webpack 配置中的 module 用于控制如何处理项目中不同类型的模块。

除了 `module.rules` 字段用于配置 loader 之外，还有一个 `module.noParse` 字段，可以用于配置哪些模块文件的内容不需要进行解析。对于一些**不需要解析依赖（即无依赖）** 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。

> 使用 `noParse` 进行忽略的模块文件中不能使用 `import`、`require`、`define` 等导入机制。

```js
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式

    // 或者使用 function
    noParse(content) {
      return /jquery|lodash/.test(content)
    },
  }
}
```

`noParse` 从某种程度上说是个优化配置项，日常也可以不去使用。

## plugin 篇

webpack 中的 plugin 大多都提供额外的能力，它们在 webpack 中的配置都只是把插件实例添加到 `plugins` 字段的数组中。不过由于需要提供不同的功能，不同的插件本身的配置比较多样化。

### DefinePlugin

DefinePlugin 是 webpack 内置的插件，可以使用 `webpack.DefinePlugin` 直接获取。

这个插件用于创建一些在编译时可以配置的**全局常量**，这些常量的值我们可以在 webpack 的配置中去指定，例如：

```js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
    }),
  ],
}
```

有了上面的配置，就可以在应用代码文件中，访问配置好的变量了，如：

```js
console.log("Running App version " + VERSION);
```

配置规则

- 如果配置的值是字符串，那么整个字符串会被当成代码片段来执行，其结果作为最终变量的值
- 如果配置的值不是字符串，也不是一个对象字面量，那么该值会被转为一个字符串，如 `true`，最后的结果是 `'true'`
- 如果配置的是一个对象字面量，那么该对象的所有 key 会以同样的方式去定义

社区中关于 DefinePlugin 使用得最多的方式是定义环境变量，例如 `PRODUCTION = true` 或者 `__DEV__ = true` 等。部分类库在开发环境时依赖这样的环境变量来给予开发者更多的开发调试反馈，例如 `react` 等。

### copy-webpack-plugin

我们一般会把开发的所有源码和资源文件放在 `src/` 目录下，构建的时候产出一个 `build/` 目录，通常会直接拿 build 中的所有文件来发布。有些文件没经过 webpack 处理，但是我们希望它们也能出现在 build 目录下，这时就可以使用 `CopyWebpackPlugin` 来处理了。

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new CopyWebpackPlugin({
      patterns:[
          { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
          { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
          // 可以配置很多项复制规则
      ]
    }),
  ],
}
```

更多的配置内容可以参考 [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin)。

### mini-css-extract-plugin

前面已经介绍，用于将依赖的 CSS 分离出来成为单独文件。还有一个叫做 `extract-text-webpack-plugin` 也可以用来做相似的工作。

### ProvidePlugin

ProvidePlugin 也是一个 webpack 内置的插件。

该组件用于引用某些模块作为应用运行时的变量，从而不必每次都用 `require` 或者 `import`

要自动加载 `jquery`，我们可以将两个变量都指向对应的 node 模块：

```javascript
new webpack.ProvidePlugin({
  $: 'jquery', //import 'jquery'
  _map: ['lodash', 'map']//import {map} from 'lodash'
})
```

然后在我们任意源码中：

```javascript
// in a module
$('#item'); // <= 起作用
// $ 自动被设置为 "jquery" 输出的内容
```

### IgnorePlugin

 webpack 内置的插件。用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去。

- `requestRegExp` 匹配(test)资源请求路径的正则表达式。
- `contextRegExp` （可选）匹配(test)资源上下文（目录）的正则表达式。

```js
new webpack.IgnorePlugin(requestRegExp, [contextRegExp])
```

## webpack-dev-server 篇

在构建代码并部署到生产环境之前，我们需要一个本地环境，用于运行我们开发的代码。这个环境相当于**提供了一个简单的服务器，用于访问 webpack 构建好的静态文件，我们日常开发时可以使用它来调试前端代码**。`webpack-dev-server` 是 webpack 官方提供的一个工具，可以基于当前的 webpack 构建配置快速启动一个静态服务。当 mode 为 development 时，会具备 `hot reload` 的功能，即当源码文件变化时，会即时更新当前页面，以便你看到最新的效果。

基础使用在【基本需求篇-启动静态服务 】介绍了。

### webpack-dev-server 的配置

在 webpack 的配置中，可以通过 `devServer` 字段来配置 webpack-dev-server，如端口设置、启动 gzip 压缩等，这里简单讲解几个常用的配置。

* `public` 字段用于指定静态服务的域名。

* `port` 字段用于指定静态服务的端口。

* `publicPath` 字段用于指定构建好的静态文件在浏览器中用什么路径去访问。**如果你使用了 HMR，那么要设置 `publicPath` 就必须使用完整的 URL**。

* `proxy` 用于配置 webpack-dev-server 将特定 URL 的请求代理到另外一台服务器上。当你有单独的后端开发服务器用于请求 API 时，这个配置相当有用。例如：

  ```javascript
  proxy: {
    '/api': {
      target: "http://localhost:3000", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
      pathRewrite: { '^/api': '' }, // 把 URL 中 path 部分的 `api` 移除掉
    },
  }
  ```

  webpack-dev-server 的 proxy 功能是使用 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) 来实现的，如果需要更详细的 proxy 配置，可以参考官方文档 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#example)。

* `contentBase` 用于配置提供额外静态文件内容的目录，之前提到的 `publicPath` 是配置构建好的结果以什么样的路径去访问，而 `contentBase` 是配置额外的静态文件内容的访问路径，即那些不经过 webpack 构建，但是需要在 webpack-dev-server 中提供访问的静态资源（如部分图片等）。`publicPath` 的优先级高于 `contentBase`。推荐使用绝对路径：

  ```javascript
  // 使用当前目录下的 public
  contentBase: path.join(__dirname, "public") 
  ```

* `before` 和 `after` 配置用于在 webpack-dev-server 定义额外的中间件，如

  ```javascript
  before(app){
    app.get('/some/path', function(req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
      res.json({ custom: 'response' })
    })
  }
  ```

  `before` 在 webpack-dev-server 静态资源中间件处理之前，可以用于拦截部分请求返回特定内容，或者实现简单的数据 mock。

  `after` 在 webpack-dev-server 静态资源中间件处理之后，比较少用到，可以用于打印日志或者做一些额外处理。

* `hot`

  ```js
  hot: true //启用 webpack 的模块热替换特性
  ```

### webpack-dev-middleware

如果你熟悉使用 Node.js 来开发 Web 服务，使用过 [Express](https://expressjs.com/) 或者 [Koa](http://koajs.com/)，那么对中间件的概念应该会有所了解。

简而言之，中间件就是在 Express 之类的 Web 框架中实现各种各样功能（如静态文件访问）的这一部分函数。多个中间件可以一起协同构建起一个完整的 Web 服务器。

不熟悉 Express 中间件概念的同学可以参考 Express 的官方文档 [使用中间件](http://www.expressjs.com.cn/guide/using-middleware.html)。

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 就是在 Express 中提供 webpack-dev-server 静态服务能力的一个中间件，我们可以很轻松地将其集成到现有的 Express 代码中去，就像添加一个 Express 中间件那么简单。

首先安装 webpack-dev-middleware 依赖：

```js
npm install webpack-dev-middleware --save-dev
```

接着创建一个 Node.js 服务的脚本文件，如 app.js：

```js
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackOptions = require('./webpack.config.js') // webpack 配置文件的路径

// 本地的开发环境默认就是使用 development mode
webpackOptions.mode = 'development'

const compiler = webpack(webpackOptions)
const express = require('express')
const app = express()

app.use(middleware(compiler, {
  // webpack-dev-middleware 的配置选项
}))

// 其他 Web 服务中间件
// app.use(...)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

然后用 Node.js 运行该文件即可：

```js
node app.js # 使用刚才创建的 app.js 文件
```

使用 webpack-dev-server 的好处是相对简单，直接安装依赖后执行命令即可，而使用 webpack-dev-middleware 的好处是可以在既有的 Express 代码基础上快速添加 webpack-dev-server 的功能，同时利用 Express 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等。

其实 webpack-dev-server 也是基于 Express 开发的，前面提及的 webpack-dev-server 中 `before` 或 `after` 的配置字段，也可以用于编写特定的中间件来根据需要添加额外的功能。

## 开发和生产环境篇

我们在日常的前端开发工作中，一般都会有两套构建环境：一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件；另外一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap 的。有的时候可能还需要多一套测试环境，在运行时直接进行请求 mock 等工作。

当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化，而如果是 development mode 的话，则会开启 debug 工具，运行时打印详细的错误信息，以及更加快速的增量编译构建。

### 在配置文件中区分 mode

之前我们的配置文件都是直接对外暴露一个 JS 对象，这种方式暂时没有办法获取到 webpack 的 mode 参数，我们需要更换一种方式来处理配置。根据官方的文档[多种配置类型](https://doc.webpack-china.org/configuration/configuration-types/)，配置文件可以对外暴露一个函数，因此我们可以这样做：

```js
module.exports = (env, argv) => ({
  // ... 其他配置
  optimization: {
    minimize: false,
    // 使用 argv 来获取 mode 参数的值
    minimizer: argv.mode === 'production' ? [
      new UglifyJsPlugin({ /* 你自己的配置 */ }), 
      // 仅在我们要自定义压缩配置时才需要这么做
      // mode 为 production 时 webpack 会默认使用压缩 JS 的 plugin
    ] : [],
  },
})
```

这样获取 mode 之后，我们就能够区分不同的构建环境，然后根据不同环境再对特殊的 loader 或 plugin 做额外的配置就可以了。

### 运行时的环境变量

我们使用 webpack 时传递的 mode 参数，是可以在我们的应用代码运行时，通过 `process.env.NODE_ENV` 这个变量获取的。这样方便我们在运行时判断当前执行的构建环境，使用最多的场景莫过于控制是否打印 debug 信息。

下面这个简单的例子，在应用开发的代码中实现一个简单的 console 打印封装：

```js
export default function log(...args) {
  if (process.env.NODE_ENV === 'development' && console && console.log) {
    console.log.apply(console, args)
  }
}
```

### 常见的环境差异配置

前面提及的使用环境变量的方式可以让我们在不同的构建环境中完成不同的构建需求，这里列举一下常见的 webpack 构建差异配置：

- 生产环境可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
- 生产环境需要压缩 HTML/CSS/JS 代码
- 生产环境需要压缩图片
- 开发环境需要生成 sourcemap 文件
- 开发环境需要打印 debug 信息
- 开发环境需要 live reload 或者 hot reload 的功能

以上是常见的构建环境需求差异，可能更加复杂的项目中会有更多的构建需求（如划分静态域名等），但是我们都可以通过判断环境变量来实现这些有环境差异的构建需求。

webpack 4.x 的 mode 已经提供了上述差异配置的大部分功能，mode 为 production 时默认使用 JS 代码压缩，而 mode 为 development 时默认启用 hot reload，等等。这样让我们的配置更为简洁，我们只需要针对特别使用的 loader 和 plugin 做区分配置就可以了。

### 拆分配置

前面我们列出了几个环境差异配置，可能这些构建需求就已经有点多了，会让整个 webpack 的配置变得复杂，尤其是有着大量环境变量判断的配置。我们可以把 webpack 的配置按照不同的环境拆分成多个文件，运行时直接根据环境变量加载对应的配置即可。基本的划分如下：

- webpack.base.js：基础部分，即多个文件中共享的配置
- webpack.development.js：开发环境使用的配置
- webpack.production.js：生产环境使用的配置
- webpack.test.js：测试环境使用的配置

一些复杂的项目可能会有更多配置。这里介绍一下如何处理这样的配置拆分。

首先我们要明白，对于 webpack 的配置，其实是对外暴露一个 JS 对象，所以对于这个对象，我们都可以用 JS 代码来修改它，例如：

```js
const config = {
  // ... webpack 配置
}

// 我们可以修改这个 config 来调整配置，例如添加一个新的插件
config.plugins.push(new YourPlugin());

module.exports = config;
```

当然，如果是对外暴露一个 JS 函数的话，像本小节第一个例子那样，那么修改配置就更加容易了，这里不再举例说明。

因此，只要有一个工具能比较智能地合并多个配置对象，我们就可以很轻松地拆分 webpack 配置，然后通过判断环境变量，使用工具将对应环境的多个配置对象整合后提供给 webpack 使用。这个工具就是 [webpack-merge](https://github.com/survivejs/webpack-merge)。

我们的 webpack 配置基础部分，即 webpack.base.js 应该大致是这样的：

```js
module.exports = {
  entry: '...',
  output: {
    // ...
  },
  resolve: {
    // ...
  },
  module: {
    // 这里是一个简单的例子，后面介绍 API 时会用到
    rules: [
      {
        test: /\.js$/, 
        use: ['babel'],
      },
    ],
    // ...
  },
  plugins: [
    // ...
  ],
}
```

然后 webpack.development.js 需要添加 loader 或 plugin，就可以使用 webpack-merge 的 API，例如：

```js
const { smart } = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base.js')

module.exports = smart(base, {
  module: {
    rules: [
      // 用 smart API，当这里的匹配规则相同且 use 值都是数组时，smart 会识别后处理
      // 和上述 base 配置合并后，这里会是 { test: /\.js$/, use: ['babel', 'coffee'] }
      // 如果这里 use 的值用的是字符串或者对象的话，那么会替换掉原本的规则 use 的值
      {
        test: /\.js$/,
        use: ['coffee'],
      },
      // ...
    ],
  },
  plugins: [
    // plugins 这里的数组会和 base 中的 plugins 数组进行合并
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
})
```

可见 webpack-merge 提供的 `smart` 方法，可以帮助我们更加轻松地处理 loader 配置的合并。webpack-merge 还有其他 API 可以用于自定义合并行为，这里就不详细介绍了，需要深入了解的同学可以查阅官方文档 [webpack-merge](https://github.com/survivejs/webpack-merge)。

##　模块热替换HMR篇

> HMR 全称是 Hot Module Replacement，即模块热替换。在这个概念出来之前，我们使用过 Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面。HMR 可以理解为增强版的 Hot Reloading，但不用整个页面刷新，而是局部替换掉部分模块代码并且使其生效，可以看到代码变更后的效果。所以，HMR 既避免了频繁手动刷新页面，也减少了页面刷新时的等待，可以极大地提高前端页面开发效率。

### 配置使用HMR

```JS
const webpack = require('webpack')

module.exports = {
  // ...
  devServer: {
    hot: true // dev server 的配置要启动 hot，或者在命令行中带参数开启
  },
  plugins: [
    // ...
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
}
```

### HMR 运行原理

首先我们要知道一个概念：webpack 内部运行时，会维护一份用于管理构建代码时各个模块之间交互的表数据，webpack 官方称之为 **Manifest**，其中包括入口代码文件和构建出来的 bundle 文件的对应关系。可以使用 [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) 插件来输出这样的一份数据。

了解这个概念后，我们来看一下 HMR 的大致运行流程图。

![hmr flow chart](https://user-gold-cdn.xitu.io/2018/3/19/1623bffb086c3918?w=1272&h=890&f=png&s=218413)

当你使用前面的配置启动了支持 HMR 的 webpack-dev-server，然后在浏览器打开页面时，你也可以从控制台看到大概的 HMR 执行流程：

![hmr log in console](https://user-gold-cdn.xitu.io/2018/3/19/1623c0004b223528?w=396&h=122&f=png&s=18243)

开启了 hot 功能的 webpack 会往我们应用的主要代码中添加 WS 相关的代码，用于和服务器保持连接，等待更新动作。

当你配置了 HMR 的插件时，会往应用代码中添加 HMR 运行时的代码，主要用于定义代码模块应用更新时的 API，后面会详细介绍。

> 有兴趣可以查看源码：[HotModuleReplacement.runtime.js](https://github.com/webpack/webpack/blob/master/lib/HotModuleReplacement.runtime.js)。

有了这两个部分就可以支持整个 HMR 的功能了。我们先忽略流程图的右上角部分，左下角的流程相对容易理解：当有更新时，webpack-dev-server 发送更新信号给 HMR 运行时，然后 HMR 再请求所需要的更新数据，请求的更新数据没有问题的话就应用更新。

如果 HMR 只是简单替换了代码模块的内容，如替换掉所谓的 `installedModules` 中需要更新的部分，那么这样并没有办法把更新后的结果实时地在浏览器上显示出来，所以才会需要流程图的右上角部分。

> 如果无法理解 `installedModules`，可以参考第 13 小节中的「bundler 的基础流程」这一部分的内容

前面提到的 HMR 运行时代码会提供定义代码模块应用更新时执行的 API，这些 API 可以让我们在模块中定义接收到 HMR 更新应用信号时，需要额外做什么工作。例如， [style-loader](https://github.com/webpack-contrib/style-loader) 就需要实现 HMR 接口，当收到更新时，使用新的样式替换掉旧的样式，大概是这样：

```
if (module.hot) {
  module.hot.accept('/some/path', function() {
    // ... 用新样式替换旧样式
  })
}
```

详情可以参考 [style-loader](https://github.com/webpack-contrib/style-loader) 中的代码实现：[HMR interface implemention in style-loader](https://github.com/webpack-contrib/style-loader/blob/master/index.js#L36)。

HMR 应用更新时是使用 `webpackHotUpdate` 来处理的：

```
webpackHotUpdate(id, { 
  'modulePath': 
  function() {
    // 模块更新后的代码
  }
})
```

执行 `webpackHotUpdate` 时如发现模块代码实现了 HMR 接口，就会执行相应的回调或者方法，从而达到应用更新时，模块可以自行管理自己所需要额外做的工作。不过，并不是所有的模块都需要做相关的处理，当遇见没有实现 HMR 接口的模块时，就会往上层冒泡，如本节开头部分的流程图所示。

这里还有一个问题是，webpack 如何保证 HMR 接口中的引用是最新的模块代码？我们看一个简单的例子：

```
import './index.css'
import hello from './bar'

hello()

if (module.hot) {
  module.hot.accept('./bar', () => {
    // console.log('Accepting the updated bar module!')
    hello()
  })
}
```

从代码上看，hello 都是同一个，这样的话并没有办法引用最新的模块代码，但是我们看一下上述代码在 webpack 构建后的结果：

```
if (true) {
  module.hot.accept("./src/bar.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { 
    /* harmony import */ 
    __WEBPACK_IMPORTED_MODULE_1__bar__ = __webpack_require__("./src/bar.js"); 
    (() => {
      // console.log('Accepting the updated bar module!')
      Object(__WEBPACK_IMPORTED_MODULE_1__bar__["default"])()
    })(__WEBPACK_OUTDATED_DEPENDENCIES__); 
  })
}
```

其他代码比较杂，我们集中看 `module.hot` 的处理部分。这里可以发现，我们的 hello 已经重新使用 `__webpack_require__` 来引用了，所以可以确保它是最新的模块代码。

基本上 HMR 的执行原理就是这样，更具体的实现部分就不展开讲解了。在日常开发中，我们需要更多的工具来帮助我们实现 HMR 的接口，避免编写过多 HMR 需要的代码。例如，React 在组件代码更新时可能需要触发重新 render 来实现实时的组件展示效果，官方提供了一些现有的工具，需要的可以参考一下：[hot module replacement tools](https://webpack.js.org/guides/hot-module-replacement/#other-code-and-frameworks)。

## module.hot 常见的 API

前面 HMR 实现部分已经讲解了实现 HMR 接口的重要性，下面来看看常见的 `module.hot` API 有哪些，以及如何使用。

之前已经简单介绍过，`module.hot.accept` 方法指定在应用特定代码模块更新时执行相应的 callback，第一个参数可以是字符串或者数组，如：

```
if (module.hot) {
  module.hot.accept(['./bar.js', './index.css'], () => {
    // ... 这样当 bar.js 或者 index.css 更新时都会执行该函数
  })
}
```

`module.hot.decline` 对于指定的代码模块，拒绝进行模块代码的更新，进入更新失败状态，如 `module.hot.decline('./bar.js')`。这个方法比较少用到。

`module.hot.dispose` 用于添加一个处理函数，在当前模块代码被替换时运行该函数，例如：

```
if (module.hot) {
  module.hot.dispose((data) => {
    // data 用于传递数据，如果有需要传递的数据可以挂在 data 对象上，然后在模块代码更新后可以通过 module.hot.data 来获取
  })
}
```

`module.hot.accept` 通常用于指定当前依赖的某个模块更新时需要做的处理，如果是当前模块更新时需要处理的动作，使用 `module.hot.dispose` 会更加容易方便。

`module.hot.removeDisposeHandler` 用于移除 `dispose` 方法添加的 callback。

关于 `module.hot` 的更多 API 详情可以参考官方文档：[Hot Module Replacement APIs](https://doc.webpack-china.org/api/hot-module-replacement)。

## 小结

## 优化资源篇【图片和代码】

我们总是希望浏览器在加载页面时用的时间越短越好，所以构建出来的文件应该越少越小越好，一来减少浏览器需要发起请求的数量，二来减少下载静态资源的时间。

其实 webpack 把多个代码文件打包成几个必需的静态资源，已经很大程度减少了静态资源请求数量了，接下来我们来介绍下如何使用 webpack 实现更多的前端资源加载的优化需求。

### CSS Sprites

[CSS Sprites](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Implementing_image_sprites_in_CSS) 技术是前端领域一种很常见的用于减少图片资源请求数的优化方式

webpack 4.x 需要配合使用 [postcss](https://github.com/postcss/postcss) 和 [postcss-sprites](https://github.com/2createStudio/postcss-sprites)，才能实现 CSS Sprites 的相关构建。

或者使用 [webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith) 或者 [sprite-webpack-plugin](https://github.com/kezoo/sprite-webpack-plugin)。

### 图片压缩

我们之前提及使用 file-loader 来处理图片文件，在此基础上，我们再添加一个 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 来压缩图片文件。简单的配置如下：

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
          },
        ],
      },
    ],
  },
}
```

image-webpack-loader 的压缩是使用 [imagemin](https://github.com/imagemin) 提供的一系列图片压缩类库来处理的，如果需要进一步了解详细的配置，可以查看对应类库的官方文档 [usage of image-webpack-loader](https://github.com/tcoopman/image-webpack-loader#usage)。

### 使用 DataURL

有的时候我们的项目中会有一些很小的图片，因为某些缘故并不想使用 CSS Sprites 的方式来处理（譬如小图片不多，因此引入 CSS Sprites 感觉麻烦），那么我们可以在 webpack 中使用 **url-loader** 来处理这些很小的图片。

[url-loader](https://github.com/webpack-contrib/url-loader) 和 [file-loader](https://github.com/webpack-contrib/file-loader) 的功能类似，但是**在处理文件的时候，可以通过配置指定一个大小，当文件小于这个配置值时，url-loader 会将其转换为一个 base64 编码的 DataURL**，配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
            },
          },
        ],
      },
    ],
  },
}
```

更多关于 url-loader 的配置可以参考官方文档 [url-loader](https://github.com/webpack-contrib/url-loader)，一般情况仅使用 `limit` 即可。

### 代码压缩

对于 **HTML 文件**，之前介绍的 html-webpack-plugin 插件可以帮助我们生成需要的 HTML 并对其进行压缩：

```js
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
      minify: { // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true // 压缩 HTML 中出现的 JS 代码
      }
    }),
  ],
}
```

如上，使用 `minify` 字段配置就可以使用 HTML 压缩，这个插件是使用 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 来实现 HTML 代码压缩的，`minify` 下的配置项直接透传给 html-minifier，配置项参考 html-minifier 文档即可。

对于 **CSS 文件**，我们之前介绍过用来处理 CSS 文件的 css-loader，也提供了压缩 CSS 代码的功能：

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          },
        ],
      },
    ],
  }
}
```

在 css-loader 的选项中配置 `minimize` 字段为 `true` 来使用 CSS 压缩代码的功能。css-loader 是使用 [cssnano](http://cssnano.co/) 来压缩代码的，`minimize` 字段也可以配置为一个对象，来将相关配置传递给 cssnano。更多详细内容请参考 [cssnano](http://cssnano.co/) 官方文档。

也可以使用 **optimize-css-assets-webpack-plugin** 插件来压缩css代码，具体做法是将插件optimization 对象中的 minimizer 属性中。但设置minimizer后，webpack认为我们需要使用自定义压缩器插件，那内部的 JS 压缩器 **terser-webpack-plugin** 就会被覆盖掉。我们必须手动再添加回来。

## 优化资源篇【代码分离】

### 分离 CSS 代码

* mini-css-extract-plugin 插件


为何要把 CSS 文件分离出来，而不是直接一起打包在 JS 中。最主要的原因是我们希望更好地利用缓存。

假设我们原本页面的静态资源都打包成一个 JS 文件，加载页面时虽然只需要加载一个 JS 文件，但是我们的代码一旦改变了，用户访问新的页面时就需要重新加载一个新的 JS 文件。有些情况下，我们只是单独修改了样式，这样也要重新加载整个应用的 JS 文件，相当不划算。

还有一种情况是我们有多个页面，它们都可以共用一部分样式（这是很常见的，CSS Reset、基础组件样式等基本都是跨页面通用），如果每个页面都单独打包一个 JS 文件，那么每次访问页面都会重复加载原本可以共享的那些 CSS 代码。如果分离开来，第二个页面就有了 CSS 文件的缓存，访问速度自然会加快。虽然对第一个页面来说多了一个请求，但是对随后的页面来说，缓存带来的速度提升相对更加可观。

因此当我们考虑更好地利用缓存来加速静态资源访问时，会尝试把一些公共资源单独分离开来，利用缓存加速，以避免重复的加载。除了公共的 CSS 文件或者图片资源等，当我们的 JS 代码文件过大的时候，也可以用代码文件拆分的办法来进行优化。

### 分离 JS 代码文件

简单地配置：

``` js
module.exports = {
  // ... webpack 配置

  optimization: {
    splitChunks: {
      chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    },
  },
}
```

拆分文件是为了更好地利用缓存，分离公共类库很大程度上是为了让多页面利用缓存，从而减少下载的代码量，同时，也有代码变更时可以利用缓存减少下载代码量的好处

## 优化资源篇【控制JS大小】

### 按需加载模块

前面讲述了如何把大的代码文件进行拆分，抽离出多个页面共享的部分，但是当你的 Web 应用是单个页面，并且极其复杂的时候，你会发现有一些代码并不是每一个用户都需要用到的。你可能希望将这一部分代码抽离出去，仅当用户真正需要用到时才加载，这个时候就需要用到 webpack 提供的一个优化功能 —— 按需加载代码模块。

在 webpack 的构建环境中，要按需加载代码模块很简单，遵循 ES 标准的动态加载语法 [dynamic-import](https://github.com/tc39/proposal-dynamic-import) 来编写代码即可，webpack 会自动处理使用该语法编写的模块：

```js
// import 作为一个方法使用，传入模块名即可，返回一个 promise 来获取模块暴露的对象
// 注释 webpackChunkName: "lodash" 可以用于指定 chunk 的名称，在输出文件时有用
import(/* webpackChunkName: "lodash" */ 'lodash').then((_) => { 
  console.log(_.lash([1, 2, 3])) // 打印 3
})
```

注意一下，如果你使用了 [Babel](http://babeljs.io/) 的话，还需要 [Syntax Dynamic Import](https://babeljs.io/docs/plugins/syntax-dynamic-import/) 这个 Babel 插件来处理 `import()` 这种语法。

由于动态加载代码模块的语法依赖于 promise，对于低版本的浏览器，需要添加 promise 的 [polyfill](https://github.com/stefanpenner/es6-promise) 后才能使用。

如上的代码，webpack 构建时会自动把 lodash 模块分离出来，并且在代码内部实现动态加载 lodash 的功能。动态加载代码时依赖于网络，其模块内容会异步返回，所以 `import` 方法是返回一个 promise 来获取动态加载的模块内容。

`import` 后面的注释 `webpackChunkName: "lodash"` 用于告知 webpack 所要动态加载模块的名称。我们在 webpack 配置中添加一个 `output.chunkFilename` 的配置：

```js
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[hash:8].js',
  chunkFilename: '[name].[hash:8].js' // 指定分离出来的代码文件的名称
},
```

这样就可以把分离出来的文件名称用 lodash 标识了，如下图：

![img](https://img.kancloud.cn/d4/b9/d4b9e8537c9ef30057e00fbbfc368b5d_1147x214.jpg)

如果没有添加注释 `webpackChunkName: "lodash"` 以及 `output.chunkFilename` 配置，那么分离出来的文件名称会以简单数字的方式标识，不便于识别。

### Tree shaking

Tree shaking 这个术语起源于 ES2015 模块打包工具 [rollup](https://github.com/rollup/rollup)，依赖于 ES2015 模块系统中的[静态结构特性](http://exploringjs.com/es6/ch_modules.html#static-module-structure)，可以移除 JavaScript 上下文中的未引用代码，删掉用不着的代码，能够有效减少 JS 代码文件的大小。拿官方文档的例子来说明一下。

```js
// src/math.js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

// src/index.js
import { cube } from './math.js' // 在这里只是引用了 cube 这个方法

console.log(cube(3))
```

如果整个项目代码只是上述两个文件，那么很明显，`square` 这个方法是未被引用的代码，是可以删掉的。在 webpack 中，只有启动了 JS 代码压缩功能（即使用 uglify）时，会做 Tree shaking 的优化。webpack 4.x 需要指定 mode 为 production。启动了之后，构建出来的结果就会移除 `square` 的那一部分代码了。

如果你在项目中使用了 [Babel](http://babeljs.io/) 的话，要把 Babel 解析模块语法的功能关掉，在 `.babelrc` 配置中增加 `"modules": false` 这个配置：

```js
{
  "presets": [["env", { "modules": false }]]
}
```

这样可以把 `import/export` 的这一部分模块语法交由 webpack 处理，否则没法使用 Tree shaking 的优化。

有的时候你启用了 Tree shaking 功能，但是发现好像并没有什么用，例如这样一个例子：

```js
// src/component.js
export class Person {
  constructor ({ name }) {
    this.name = name
  }

  getName () {
    return this.name
  }
}

export class Apple {
  constructor ({ model }) {
    this.model = model
  }
  getModel () {
    return this.model
  }
}

// src/index.js
import { Apple } from './components'

const appleModel = new Apple({
  model: 'X'
}).getModel()

console.log(appleModel)
```

打包压缩后还是可以发现，`Person` 这一块看起来没用到的代码出现在文件中。关于这个问题，详细讲解的话篇幅太长了，建议自行阅读这一篇文章：[你的Tree-Shaking并没什么卵用](https://zhuanlan.zhihu.com/p/32831172)。

这篇文章最近没有更新，但是 uglify 的相关 issue [Class declaration in IIFE considered as side effect](https://github.com/mishoo/UglifyJS2/issues/1261) 是有进展的，现在如果你在 Babel 配置中增加 `"loose": true` 配置的话，`Person` 这一块代码就可以在构建时移除掉了。

### sideEffects

这是 webpack 4.x 才具备的特性， webpack 的 examples ：[side-effects/README.md](https://github.com/webpack/webpack/blob/master/examples/side-effects/README.md)。

我们拿 [lodash](https://github.com/lodash/lodash) 举个例子。它是一个工具库，提供了大量的对字符串、数组、对象等常见数据类型的处理函数，但是有的时候我们只是使用了其中的几个函数，全部函数的实现都打包到我们的应用代码中，其实很浪费。

webpack 的 sideEffects 可以帮助解决这个问题。现在 lodash 的 [ES 版本](https://www.npmjs.com/package/lodash-es) 的 `package.json` 文件中已经有 `sideEffects: false` 这个声明了，当某个模块的 `package.json` 文件中有了这个声明之后，webpack 会认为这个模块没有任何副作用，只是单纯用来对外暴露模块使用，那么在打包的时候就会做一些额外的处理。

例如你这么使用 `lodash`：

```js
import { forEach, includes } from 'lodash-es'

forEach([1, 2], (item) => {
  console.log(item)
})

console.log(includes([1, 2, 3], 1))
```

由于 lodash-es 这个模块的 `package.json` 文件有 `sideEffects: false` 的声明，所以 webpack 会将上述的代码转换为以下的代码去处理：

```js
import { default as forEach } from 'lodash-es/forEach'
import { default as includes } from 'lodash-es/includes'

// ... 其他代码
```

最终 webpack 不会把 lodash-es 所有的代码内容打包进来，只是打包了你用到的那两个方法，这便是 sideEffects 的作用。

## 提升webpack构建速度篇

提升 webpack 构建速度本质上就是想办法让 webpack 少干点活，活少了速度自然快了，尽量避免 webpack 去做一些不必要的事情。

### 减少 `resolve` 解析

```js
resolve: {
  modules: [
    path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
  ],

  // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
  // 其他文件可以在编码时指定后缀，如 import('./index.scss')
  extensions: [".js"], 

  // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
  mainFiles: ['index'],
},
```

### 把 loader 应用的文件范围缩小

我们在使用 loader 的时候，尽可能把 loader 应用的文件范围缩小，只在最少数必须的代码模块中去使用必要的 loader，例如 node_modules 目录下的其他依赖类库文件，基本就是直接编译好可用的代码，无须再经过 loader 处理了：

```js 
rules: [ 
  {
    test: /\.jsx?/,
    include: [ 
      path.resolve(__dirname, 'src'), 
      // 限定只在 src 目录下的 js/jsx 文件需要经 babel-loader 处理
      // 通常我们需要 loader 处理的文件都是存放在 src 目录
    ],
    exclude: /node_modules/, //这样也可以
    use: 'babel-loader',
  },
  // ...
],
```

### 换种方式处理图片

前边提到图片可以使用 webpack 的 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 来压缩图片，在对 webpack 构建性能要求不高的时候，这样是一种很简便的处理方式，但是要考虑提高 webpack 构建速度时，这一块的处理就得重新考虑一下了，思考一下是否有必要在 webpack 每次构建时都处理一次图片压缩。

这里介绍一种解决思路，我们可以直接使用 [imagemin](https://github.com/imagemin/imagemin-cli) 来做图片压缩，编写简单的命令即可。然后使用 [pre-commit](https://github.com/observing/pre-commit) 这个类库来配置对应的命令，使其在 `git commit` 的时候触发，并且将要提交的文件替换为压缩后的文件。

这样提交到代码仓库的图片就已经是压缩好的了，以后在项目中再次使用到的这些图片就无需再进行压缩处理了，image-webpack-loader 也就没有必要了。

### 使用 DLLPlugin

[DLLPlugin](https://doc.webpack-china.org/plugins/dll-plugin) 是 webpack 官方提供的一个插件，也是用来分离代码的，和 `optimization.splitChunks`有异曲同工之妙，之所以把 DLLPlugin 放到 webpack 构建性能优化这一部分，是因为它的配置相对繁琐，如果项目不涉及性能优化这一块，基本上使用 `optimization.splitChunks` 即可。

[参考](https://www.webpackjs.com/plugins/dll-plugin/)

### webpack 4.x 的构建性能

比较重要的改进有这么几个：

- [AST](https://zh.wikipedia.org/zh-hans/抽象語法樹) 可以直接从 loader 直接传递给 webpack，避免额外的解析，对这一个优化细节有兴趣的可以查看这个 [PR](https://github.com/webpack/webpack/pull/5925)。
- 使用速度更快的 md4 作为默认的 hash 方法，对于大型项目来说，文件一多，需要 hash 处理的内容就多，webpack 的 hash 处理优化对整体的构建速度提升应该还是有一定的效果的。
- Node 语言层面的优化，如用 `for of` 替换 `forEach`，用 `Map` 和 `Set` 替换普通的对象字面量等等，这一部分就不展开讲了，有兴趣的同学可以去 webpack 的 [PRs](https://github.com/webpack/webpack/pulls?q=is%3Apr+is%3Aclosed) 寻找更多的内容。
- 默认开启 [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 的 `cache` 和 `parallel`，即缓存和并行处理，这样能大大提高 production mode 下压缩代码的速度。

除此之外，还有比较琐碎的一些内容，可以查阅：[webpack release 4.0](https://github.com/webpack/webpack/releases/tag/v4.0.0)，留意 **performance** 关键词。



**重要参考**

[webpack-examples](https://github.com/teabyii/webpack-examples)

[使用webpack定制前端开发环境](https://www.kancloud.cn/sllyli/webpack/1242347)

