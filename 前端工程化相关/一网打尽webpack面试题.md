**1. webpack是什么？**

> 本质上,webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)。当 webpack 处理应用程序时,它会**递归地**构建一个**依赖关系图**(dependency graph)，其中包含应用程序需要的每个模块,然后将所有这些模块打包成一个或多个 bundle。
>
> webpack 就像一条生产线,要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能,在特定的时机对生产线上的资源做处理。
> webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 webpack 的事件流机制保证了插件的有序性,使得整个系统扩展性很好。 
>
> ----- 深入浅出 webpack 吴浩麟

**2.webpack的核心概念**

> **Entry** 
>
> 入口起点(entry point)指示 webpack 应该使用哪个模块,来作为构建其内部依赖图的开始。
>
> 进入入口起点后,webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。
>
> 每个依赖项随即被处理,最后输出到称之为 bundles 的文件中。
>
> **Output** 
>
> output 属性告诉 webpack 在哪里输出它所创建的 bundles,以及如何命名这些文件,默认值为 ./dist。
>
> 基本上,整个应用程序结构,都会被编译到你指定的输出路径的文件夹中。
>
> **Module** 
>
> 模块,在 Webpack 里一切皆模块,一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
>
> **Chunk** 
>
> 代码块,一个 Chunk 由多个模块组合而成,用于代码合并与分割。
>
> **Loader** 
>
> loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。
>
> loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块,然后你就可以利用 webpack 的打包能力,对它们进行处理。
>
> 本质上,webpack loader 将所有类型的文件,转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。
>
> **Plugin** 
>
> loader 被用于转换某些类型的模块,而插件则可以用于执行范围更广的任务。
>
> 插件的范围包括,从打包优化和压缩,一直到重新定义环境中的变量。插件接口功能极其强大,可以用来处理各种各样的任务。

**3.webpack构建流程**

> Webpack 的运行流程是一个**串行**的过程,从启动到结束会依次执行以下流程 :
>
> 1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
> 2. 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
> 3. 确定入口：根据配置中的 entry 找出所有的入口文件。
> 4. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
> 5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
> 6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
> 7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。
>
> 在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

**4.有哪些常见的Loader？**

> - file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
> - url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
> - source-map-loader：加载额外的 Source Map 文件，以方便断点调试
> - image-loader：加载并且压缩图片文件
> - babel-loader：把 ES6 转换成 ES5
> - css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
> - style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
> - eslint-loader：通过 ESLint 检查 JavaScript 代码

**5.多个loader执行顺序**

> *   最后的 loader 最早调用，传入原始的资源内容（可能是代码，也可能是二进制文件，用 buffer 处理）
> *   第一个 loader 最后调用，期望返回是 JS 代码和 sourcemap 对象（可选）
> *   中间的 loader 执行时，传入的是上一个 loader 执行的结果

**6.常见的Plugin有哪些？**

> - define-plugin：定义环境变量
> - commons-chunk-plugin：提取公共代码
> - uglifyjs-webpack-plugin：通过`UglifyES`压缩`ES6`代码
> - clean-webpack-plugin：实现自动在打包之前清除 dist 目录（上次的打包结果）；
>
> - html-webpack-plugin：自动生成应用所需要的 HTML 文件；
>
> - 根据不同环境为代码注入类似 API 地址这种可能变化的部分；
>
> - copy-webpack-plugin：拷贝不需要参与打包的资源文件到输出目录；
>
> - 自动发布打包结果到服务器实现自动部署。

**7.如何开发一个loader**

> 每个 Webpack 的 Loader 都需要导出一个函数，这个函数就是我们这个 Loader 对资源的处理过程，它的输入就是加载到的资源文件内容，输出就是我们加工后的结果。我们通过 source 参数接收输入，通过返回值输出。
>
> Loader像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个Loader通过链式操作，将源文件一步步翻译成想要的样子。
>
> 编写Loader时要遵循**单一原则**，每个Loader只做一种"转义"工作。 每个Loader的拿到的是源文件内容（`source`），可以通过返回值的方式将处理后的内容输出，也可以调用`this.callback()`方法，将内容返回给webpack。 还可以通过 `this.async()`生成一个`callback`函数，再用这个callback将处理后的内容输出出去。 此外`webpack`还为开发者准备了开发loader的工具函数集——`loader-utils`。

**8.如何开发一个插件**

> 原理：webpack的插件机制就是钩子机制，即在webpack整个工作过程会有很多环节，为了便于插件的扩展，Webpack 几乎在每一个环节都埋下了一个钩子。这样我们在开发插件的时候，通过往这些不同节点上挂载不同的任务，就可以轻松扩展 Webpack 的能力。
>
> 具体有哪些预先定义好的钩子，我们可以参考官方文档的 API：
>
> - [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)；
> - [Compilation Hooks](https://webpack.js.org/api/compilation-hooks/)；
> - [JavascriptParser Hooks](https://webpack.js.org/api/parser/)。
>
> Webpack 要求我们的插件必须是一个**函数**或者是一个**包含 apply 方法的对象**，一般我们都会定义一个类，在这个类中定义 apply 方法。然后在使用时，再通过这个类来创建一个实例对象去使用这个插件。apply 方法会在 Webpack 启动时被调用，它接收一个 compiler 对象参数，这个对象是 Webpack 工作过程中最核心的对象，里面包含了我们此次构建的所有配置信息，我们就是通过这个对象去注册钩子函数。通过 compiler 对象的 hooks 属性访问到 emit 钩子【这个钩子会在 Webpack 即将向输出目录输出文件时执行】，再通过 tap 方法注册一个钩子函数，这个方法接收两个参数：第一个是插件的名称；第二个是要挂载到这个钩子上的函数；这个函数中接收一个 compilation 对象参数，这个对象可以理解为此次运行打包的上下文，所有打包过程中产生的结果，都会放到这个对象中。
>
> 插件都是通过往 Webpack 生命周期的钩子中挂载任务函数实现的。

**9.loader与plugin的区别？**

> 相比于 Loader，插件的能力范围更宽，因为 Loader 只是在模块的加载环节工作，而插件的作用范围几乎可以触及 Webpack 工作的每一个环节。
>
> **不同的作用**
>
> - **Loader**直译为"加载器"。Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到`loader`。 所以Loader的作用是让webpack拥有了加载和解析*非JavaScript文件*的能力。
> - **Plugin**直译为"插件"。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
>
> **不同的用法**
>
> - **Loader**在`module.rules`中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个`Object`，里面描述了对于什么类型的文件（`test`），使用什么加载(`loader`)和使用的参数（`options`）
> - **Plugin**在`plugins`中单独配置。 类型为数组，每一项是一个`plugin`的实例，参数都通过构造函数传入。

**10.如何提高webpack开发效率**

> 较为**理想的开发环境**做出设想：
>
> - 首先，它必须能够使用 **HTTP 服务运行**而不是文件形式预览。这样的话，一来更接近生产环境状态，二来我们的项目可能需要使用 AJAX 之类的 API，以文件形式访问会产生诸多问题。
> - 其次，在我们修改完代码过后，Webpack 能够**自动完成构建**，然后浏览器可以即时显示最新的运行结果，这样就大大减少了开发过程中额外的重复操作，同时也会让我们更加专注，效率自然得到提升。
> - 最后，它还需要能提供 **Source Map** 支持。这样一来，运行过程中出现的错误就可以快速定位到源代码中的位置，而不是打包后结果中的位置，更便于我们快速定位错误、调试应用。
>
> **webpack-dev-server**
>
> - 运行 webpack-dev-server 这个命令时，它内部会启动一个 HTTP Server，为打包的结果提供静态文件服务，并且自动使用 Webpack 打包我们的应用，然后监听源代码的变化，一旦文件发生变化，它会立即重新打包。
> - webpack-dev-server 为了提高工作速率，它并没有将打包结果写入到磁盘中，而是暂时存放在内存中，内部的 HTTP Server 也是从内存中读取这些文件的。这样一来，就会减少很多不必要的磁盘读写操作，大大提高了整体的构建效率。
> - Webpack 配置对象中可以有一个叫作 devServer 的属性，专门用来为 webpack-dev-server 提供配置
>
> **SourceMap**
>
> - 作用：映射转换后的代码与源代码之间的关系。一段转换后的代码，通过转换过程中生成的 Source Map 文件就可以逆向解析得到对应的源代码。
> - .map后缀的Source Map文件，是一个 JSON 格式的文件
>   - version 是指定所使用的 Source Map 标准版本；
>   - sources 中记录的是转换前的源文件名称，因为有可能出现多个文件打包转换为一个文件的情况，所以这里是一个数组；
>   - names 是源代码中使用的一些成员名称，我们都知道一般压缩代码时会将我们开发阶段编写的有意义的变量名替换为一些简短的字符，这个属性中记录的就是原始的名称；
>   - mappings 属性，这个属性最为关键，它是一个叫作 base64-VLQ 编码的字符串，里面记录的信息就是转换后代码中的字符与转换前代码中的字符之间的映射关系
> - 在webpack中通过`devtool:'source-map'`就可以开启sourcemap相关功能。webpack中的devtool配置，根据初次构建速度、监视模式重新构建速度、是否适合生成环境使用，以及 Source Map 的质量提供了多个选项。

**11.模块热替换（HMR）机制实现原理**

> webpack的热更新又称热替换（Hot Module Replacement），缩写为HMR。 这个机制可以做到**不用刷新浏览器而将新变更的模块替换掉旧的模块。**
>
> **使用**
>
> - 在运行 webpack-dev-server 命令时，通过 --hot 参数去开启这个特性。
> - 在配置文件中通过添加对应的配置来开启这个功能。首先需要将 devServer 对象中的 hot 属性设置为 true；然后需要载入一个插件，这个插件是 webpack 内置的一个插件HotModuleReplacementPlugin 
>
> **Webpack 中的 HMR 需要我们手动通过代码去处理，当模块更新过后该，如何把更新后的模块替换到页面中。**Webpack 需要我们自己处理 JS 模块的热更新了：因为不同的模块有不同的情况，不同的情况，在这里处理时肯定也是不同的。
>
> - HotModuleReplacementPlugin 为我们的 JavaScript 提供了一套用于处理 HMR 的 API，我们需要在我们自己的代码中，使用这套 API 将更新后的模块替换到正在运行的页面中。
> - 对于开启 HMR 特性的环境中，我们可以访问到全局的 **module** 对象中的 **hot** 成员，这个成员是一个对象，这个对象就是 HMR API 的核心对象，它提供了一个 **accept** 方法，用于注册当某个模块更新后的处理函数。accept 方法第一个参数接收的就是所监视的依赖**模块路径**，第二个参数就是依赖模块**更新后**的处理函数。
> - 一旦这个模块的更新被我们手动处理了，就不会触发自动刷新；反之，如果没有手动处理，热替换会自动 fallback（回退）到**自动刷新**。
>
> 使用 hot 方式，如果热替换失败就会自动回退使用自动刷新，而 hotOnly 的情况下并不会使用自动刷新。
>
> **原理：**
>
> ![img](https://pic3.zhimg.com/80/v2-40ff7f2e518e4b4695777d5160a3406e_720w.jpg)图片来自饿了么前端@知乎专栏
>
> 首先要知道server端和client端都做了处理工作
>
> 1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
> 2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
> 3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
> 4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
> 5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
> 6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
> 7. 而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
> 8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

**12.Tree Shaking 和 sideEffects 特性**

> **Tree Shaking**
>
> - 开启这个功能后，会检测代码中的未引用代码，然后自动移除它们。生产模式下自动开启。
>
> - **手动开启**
>
>   ```js
>   module.exports = {
>     // ... 其他配置项
>     optimization: {//这个属性用来集中配置 Webpack 内置优化功能
>       // 模块只导出被使用的成员
>       usedExports: true,
>       // 尽可能合并每一个模块到一个函数中,这样既提升了运行效率，又减少了代码的体积。
>       concatenateModules: true,
>       // 压缩输出结果
>       minimize: true
>     }
>   }
>   ```
>
> - **babel-loader导致Tree-Shaking失效问题**
>
>   - **Tree-shaking 实现的前提是 ES Modules**，也就是说：最终交给 Webpack 打包的代码，必须是使用 ES Modules 的方式来组织的模块化。
>
>   - 为了更好的兼容性，我们会配置babel-loader。当我们使用这个预设时，代码中的 ES Modules 部分就会被转换成 CommonJS 方式。那 Webpack 再去打包时，拿到的就是以 CommonJS 方式组织的代码了，所以 Tree-shaking 不能生效。
>
>     ```js
>     {
>             test: /\.js$/,
>             use: {
>               loader: 'babel-loader',
>               options: {
>                 presets: [
>                   ['@babel/preset-env']
>                 ]
>               }
>             }
>           }
>     ```
>
>   - 在最新版本（8.x）的 babel-loader 中，已经自动帮我们关闭了对 ES Modules 转换的插件。所以可以大胆的使用了。
>
> **sideEffects**
>
> - **允许我们通过配置标识我们的代码是否有副作用，从而提供更大的压缩空间**。模块的副作用指的就是模块执行的时候除了导出成员，是否还做了其他的事情。
> - **Tree-shaking 只能移除没有用到的代码成员，而想要完整移除没有用到的模块，那就需要开启 sideEffects 特性了**。
> - 这个特性在 production 模式下同样会自动开启。
> - **手动设置**
>   - webpack.config.js 中的 sideEffects 用来开启这个功能；
>   - package.json 中的 sideEffects 用来标识我们的代码没有副作用。设置为false表示我们这个项目中的所有代码都没有副作用。sideEffects 字段中标识需要保留副作用的模块路径。

**13.Code Splitting**

> **代码分离**：把打包的结果按照一定的规则分离到多个 bundle 中，然后根据应用的运行需要按需加载。这样就可以降低启动成本，提高响应速度。
>
> Webpack 实现分包的方式主要有两种：
>
> - **根据业务不同配置多个打包入口，输出多个打包结果**；
>   - **多入口**打包一般适用于传统的多页应用程序，最常见的划分规则就是一个页面对应一个打包入口，对于不同页面间公用的部分，再提取到公共的结果中。
>   - **提取公共模块**：在优化配置(optimization)中开启 splitChunks 功能就可以了
> - **结合 ES Modules 的动态导入（Dynamic Imports）特性，按需加载模块**。
>   - **按需加载**，指的是在应用运行过程中，需要某个资源模块时，才去加载这个模块。这种方式极大地降低了应用启动时需要加载的资源体积，提高了应用的响应速度，同时也节省了带宽和流量。
>   - Webpack 中支持使用动态导入的方式实现模块的按需加载，而且所有动态导入的模块都会被自动提取到单独的 bundle 中，从而实现分包。
>   - 为了动态导入模块，可以将 **import** 关键字作为函数调用。当以这种方式使用时，import 函数返回一个 **Promise 对象**。这就是 ES Modules 标准中的 [Dynamic Imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports)。
>   - 默认通过动态导入产生的 bundle 文件，它的 name 就是一个序号。如果你还是需要给这些 bundle 命名的话，就可以使用 Webpack 所特有的魔法注释`/* webpackChunkName: 'posts' */`去实现。
>
> 

**14.如何利用webpack来优化前端性能？（提高性能和体验）**

> 用webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运行快速高效。
>
> - 压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的`UglifyJsPlugin`和`ParallelUglifyPlugin`来压缩JS文件， 利用`cssnano`（css-loader?minimize）来压缩css
> - 利用CDN加速。在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于`output`参数和各loader的`publicPath`参数来修改资源路径
> - 删除死代码（Tree Shaking）。将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数`--optimize-minimize`来实现
> - 提取公共代码。

------

**15.如何提高webpack的构建速度？**

> 1. 多入口情况下，使用`CommonsChunkPlugin`来提取公共代码
> 2. 通过`externals`配置来提取常用库
> 3. 利用`DllPlugin`和`DllReferencePlugin`预编译资源模块 通过`DllPlugin`来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过`DllReferencePlugin`将预编译的模块加载进来。
> 4. 使用`Happypack` 实现多线程加速编译
> 5. 使用`webpack-uglify-parallel`来提升`uglifyPlugin`的压缩速度。 原理上`webpack-uglify-parallel`采用了多核并行压缩来提升压缩速度
> 6. 使用`Tree-shaking`和`Scope Hoisting`来剔除多余代码

------

**16.怎么配置单页应用？怎么配置多页应用？**

> 单页应用可以理解为webpack的标准模式，直接在`entry`中指定单页应用的入口即可，这里不再赘述
>
> 多页应用的话，可以使用webpack的 `AutoWebPlugin`来完成简单自动化的构建，但是前提是项目的目录结构必须遵守他预设的规范。 多页应用中要注意的是：
>
> - 每个页面都有公共的代码，可以将这些代码抽离出来，避免重复的加载。比如，每个页面都引用了同一套css样式表
> - 随着业务的不断扩展，页面可能会不断的追加，所以一定要让入口的配置足够灵活，避免每次添加新页面还需要修改构建配置

------

**17.npm打包时需要注意哪些？如何利用webpack来更好的构建？**

> `Npm`是目前最大的 JavaScript 模块仓库，里面有来自全世界开发者上传的可复用模块。你可能只是JS模块的使用者，但是有些情况你也会去选择上传自己开发的模块。 关于NPM模块上传的方法可以去[官网](https://link.zhihu.com/?target=https%3A//docs.npmjs.com/)上进行学习，这里只讲解如何利用webpack来构建。
>
> NPM模块需要注意以下问题：
>
> 1. 要支持CommonJS模块化规范，所以要求打包后的最后结果也遵守该规则。
> 2. Npm模块使用者的环境是不确定的，很有可能并不支持ES6，所以打包的最后结果应该是采用ES5编写的。并且如果ES5是经过转换的，请最好连同SourceMap一同上传。
> 3. Npm包大小应该是尽量小（有些仓库会限制包大小）
> 4. 发布的模块不能将依赖的模块也一同打包，应该让用户选择性的去自行安装。这样可以避免模块应用者再次打包时出现底层模块被重复打包的情况。
> 5. UI组件类的模块应该将依赖的其它资源文件，例如`.css`文件也需要包含在发布的模块里。
>
> 
>
> 基于以上需要注意的问题，我们可以对于webpack配置做以下扩展和优化：
>
> 1. CommonJS模块化规范的解决方案： 设置`output.libraryTarget='commonjs2'`使输出的代码符合CommonJS2 模块化规范，以供给其它模块导入使用
> 2. 输出ES5代码的解决方案：使用`babel-loader`把 ES6 代码转换成 ES5 的代码。再通过开启`devtool: 'source-map'`输出SourceMap以发布调试。
> 3. Npm包大小尽量小的解决方案：Babel 在把 ES6 代码转换成 ES5 代码时会注入一些辅助函数，最终导致每个输出的文件中都包含这段辅助函数的代码，造成了代码的冗余。解决方法是修改`.babelrc`文件，为其加入`transform-runtime`插件
> 4. 不能将依赖模块打包到NPM模块中的解决方案：使用`externals`配置项来告诉webpack哪些模块不需要打包。
> 5. 对于依赖的资源文件打包的解决方案：通过`css-loader`和`extract-text-webpack-plugin`来实现，配置如下：
>
> ```js
> const ExtractTextPlugin = require('extract-text-webpack-plugin');
> 
> module.exports = {
>   module: {
>     rules: [
>       {
>         // 增加对 CSS 文件的支持
>         test: /\.css/,
>         // 提取出 Chunk 中的 CSS 代码到单独的文件中
>         use: ExtractTextPlugin.extract({
>           use: ['css-loader']
>         }),
>       },
>     ]
>   },
>   plugins: [
>     new ExtractTextPlugin({
>       // 输出的 CSS 文件名称
>       filename: 'index.css',
>     }),
>   ],
> };
> ```



**18. webpack与grunt、gulp的不同？**

> 三者都是前端构建工具，grunt和gulp在早期比较流行，现在webpack相对来说比较主流，不过一些轻量化的任务还是会用gulp来处理，比如单独打包CSS文件等。
>
> [grunt](https://link.zhihu.com/?target=https%3A//www.gruntjs.net/)和[gulp](https://link.zhihu.com/?target=https%3A//www.gulpjs.com.cn/)是基于任务和流（Task、Stream）的。类似jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个web的构建流程。
>
> webpack是基于入口的。webpack会自动地递归解析入口所需要加载的所有资源文件，然后用不同的Loader来处理不同的文件，用Plugin来扩展webpack功能。
>
> 所以总结一下：
>
> - 从构建思路来说
>
> ```text
> gulp和grunt需要开发者将整个前端构建过程拆分成多个`Task`，并合理控制所有`Task`的调用关系
> webpack需要开发者找到入口，并需要清楚对于不同的资源应该使用什么Loader做何种解析和加工
> ```
>
> - 对于知识背景来说
>   gulp更像后端开发者的思路，需要对于整个流程了如指掌 webpack更倾向于前端开发者的思路

**19. 与webpack类似的工具还有哪些？谈谈你为什么最终选择（或放弃）使用webpack？**

> 同样是基于入口的打包工具还有以下几个主流的：
>
> - webpack
> - [rollup](https://link.zhihu.com/?target=https%3A//rollupjs.org/)
> - [parcel](https://link.zhihu.com/?target=https%3A//parceljs.org/)
>
> **从应用场景上来看：**
>
> - webpack适用于大型复杂的前端站点构建
> - rollup适用于基础库的打包，如vue、react
> - parcel适用于简单的实验性项目，他可以满足低门槛的快速看到效果
>
> > 由于parcel在打包过程中给出的调试信息十分有限，所以一旦打包出错难以调试，所以不建议复杂的项目使用parcel