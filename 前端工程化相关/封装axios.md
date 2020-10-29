> **好文收集**：[封装axios](https://champyin.com/2019/12/23/%E5%B0%81%E8%A3%85axios/)
>
> `axios` 是一个轻量的 `HTTP客户端`，它基于 `XMLHttpRequest` 服务来执行 HTTP 请求，支持丰富的配置，支持 `Promise`，支持浏览器端和 `Node.js` 端

## 封装步骤

> 目的：把所有HTTP请求共用的配置，事先都在axios上配置好，预留好必要的参数和接口，然后把它作为新的axios返回。

* 在 src 下新建 utils/http.js 文件，引入 axios，并创建一个类来封装

  ```js
  import axios from ‘axios’
  
  class Axios{
      
  }
  ```

* 给不同环境配置不同请求地址，根据 `process.env.NODE_ENV` 配置不同的 `baseURL`，使项目只需执行相应打包命令，就可以在不同环境中自动切换请求主机地址。

  ```js
  //src/utils/http.js
  const getBaseUrl = (env) => {
      let base = {
          producetion: '/',
          development: 'http://localhost:3000',
          test: 'http://localhost:3001',
      }[env]
      
      if (!base) {
          base = '/';
        }
      return base;
  }
  
  class Axios {
    constructor() {
      this.baseURL = getBaseUrl(process.env.NODE_ENV);
    }
  }
  ```

* 配置超出时间 timeout 属性

* 配置允许携带凭证 widthCredentials 属性设为 true（表示跨域请求时是否需要使用凭证）

  ```js
  class Axios {
    constructor() {
      //...
      this.timeout = 10000;//10s
      this.withCredentials = true;
    }
  }
  ```

* 创建实例方法`request`，在其中创建新的 axios 实例，接收请求配置参数，处理参数，添加配置，返回axios实例的请求结果（一个promise对象）。 

  ```js
  class Axios {
    //...
    request(options) {
      // 每次请求都会创建新的axios实例。
      const instance = axios.create();
      const config = { // 将用户传过来的参数与公共配置合并。
        ...options,
        baseURL: this.baseURL,
        timeout: this.timeout,
        withCredentials: this.withCredentials,
      };
      // 配置拦截器，支持根据不同url配置不同的拦截器。
      this.setInterceptors(instance, options.url);
      return instance(config); // 返回axios实例的执行结果
    }
  }
  ```

* 配置请求拦截器，在发送请求前对请求参数做的所有修改都在这里统一配置。比如统一添加token凭证、统一设置语言、统一设置内容类型、指定数据格式等等。做完后记得返回这个配置，否则整个请求不会进行。 我这里就配置一个token。

  ```js
  class Axios {
    //...
    // 这里的url可供你针对需要特殊处理的接口路径设置不同拦截器。
    setInterceptors = (instance, url) => { 
      instance.interceptors.request.use((config) => { // 请求拦截器
        // 配置token
        config.headers.AuthorizationToken = localStorage.getItem('AuthorizationToken') || '';
        return config;
      }, err => Promise.reject(err));
    }
    //...
  }
  ```

* 配置响应拦截器 在请求的`then`或`catch`处理前对响应数据进行一轮预先处理。比如过滤响应数据，更多的，是在这里对各种响应错误码进行统一错误处理，还有断网处理等等。 我这里就判断一下403和断网。

  ```js
  class Axios {
    //...
    setInterceptors = (instance, url) => {
      //...
      instance.interceptors.response.use((response) => { // 响应拦截器
        // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
        console.log();
        return response;
      }, (err) => {
        if (err.response) { // 响应错误码处理
          switch (err.response.status) {
            case '403':
              // todo: handler server forbidden error
              break;
              // todo: handler other status code
            default:
              break;
          }
          return Promise.reject(err.response);
        }
        if (!window.navigator.online) { // 断网处理
          // todo: jump to offline page
          return -1;
        }
        return Promise.reject(err);
      });
    }
    //...
  }
  ```

  另外，在拦截器里，还适合放置loading等缓冲效果：在请求拦截器里显示loading，在响应拦截器里移除loading。这样所有请求就都有了一个统一的loading效果。

* 默认导出新实例

  ```js
  export default new Axios()
  ```

## 完整代码

```js
// src/utils/http.js

import axios from 'axios';

const getBaseUrl = (env) => {
  let base = {
    production: '/',
    development: 'http://localhost:3000',
    test: 'http://localhost:3001',
  }[env];
  if (!base) {
    base = '/';
  }
  return base;
};

class Axios {
  constructor() {
    this.baseURL = getBaseUrl(process.env.NODE_ENV);
    this.timeout = 10000;
    this.withCredentials = true;
  }

  setInterceptors = (instance, url) => {
    instance.interceptors.request.use((config) => {
      // 在这里添加loading
      // 配置token
      config.headers.AuthorizationToken = localStorage.getItem('AuthorizationToken') || '';
      return config;
    }, err => Promise.reject(err));

    instance.interceptors.response.use((response) => {
      // 在这里移除loading
      // todo: 想根据业务需要，对响应结果预先处理的，都放在这里
      return response;
    }, (err) => {
      if (err.response) { // 响应错误码处理
        switch (err.response.status) {
          case '403':
            // todo: handler server forbidden error
            break;
            // todo: handler other status code
          default:
            break;
        }
        return Promise.reject(err.response);
      }
      if (!window.navigator.online) { // 断网处理
        // todo: jump to offline page
        return -1;
      }
      return Promise.reject(err);
    });
  }

  request(options) {
    // 每次请求都会创建新的axios实例。
    const instance = axios.create();
    const config = { // 将用户传过来的参数与公共配置合并。
      ...options,
      baseURL: this.baseURL,
      timeout: this.timeout,
      withCredentials: this.withCredentials,
    };
    // 配置拦截器，支持根据不同url配置不同的拦截器。
    this.setInterceptors(instance, options.url);
    return instance(config); // 返回axios实例的执行结果
  }
}

export default new Axios();
```

## 使用新的 Axios 封装 API

- 在 src 目录下新建 `api` 文件夹。把所有涉及HTTP请求的接口统一集中到这个目录来管理。

- 新建 `home.js`。我们需要把接口根据一定规则分好类，**一类接口对应一个js文件**。这个分类可以是按页面来划分，或者按模块等等。为了演示更直观，我这里就按页面来划分了。实际根据自己的需求来定。

- 使用新的 axios 封装API（固定url的值，合并用户传过来的参数），然后命名导出这些函数。

  ```js
  // src/api/home.js 
  
  import axios from '@/utils/http';
  export const fetchData = options => axios.request({
    ...options,
    url: '/data',
  });
  export default {};
  ```

- 在 api  目录下新建 `index.js` ，把其他文件的接口都在这个文件里汇总导出

  ```js
  // src/api/index.js
  
  export * from './home';
  ```