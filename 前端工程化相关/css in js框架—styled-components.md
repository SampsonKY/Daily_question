## 前言

过去网页开发的原则是**关注点分离**，即各种技术只负责自己的领域，不要混在一起，形成耦合。如html、css、js代码分离。

React 的出现使这个原则不再适用，React是组件结构，强制把html、css、js写在一起。这样的写法有利于组件的隔离，每个组件需要的代码不依赖外部，组件之间没有耦合，方便使用。

## styled-components

 styled-components是针对React写的一套css in js框架，简单来讲就是在js中写css。