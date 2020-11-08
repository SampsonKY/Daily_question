## 基础知识

### 2D 转换

>  转换：对元素进行移动、缩放、转动、拉长或拉伸。

- 通过`transform` 属性来实现。Chrome和Safari需要前缀-webkit-，IE9需要前缀 -ms-。
- 通过`transform-origin`属性可以设置旋转元素的基点位置。默认值：50% 50% 0，三个参数分别对应x轴（left|right|center|length|%）、y轴（top|center|bottom|length|%）、z轴（length）。

- `translate(x,y)`方法：通过给定的 left（x坐标）和 top（y坐标）位置参数**移动**元素位置。还有`translateX(n)`和`translateY(n)`
- `rotate(angle)`方法：元素顺时针**旋转**给定的角度，负值为逆时针旋转。
- `scale(x,y)`方法：元素**尺寸**增加或减少，根据给定的宽度（X轴）和高度（Y轴）。还有`scaleX(n)`和`scaleY(n)`方法。
- `skew(x-angle,y-angle)`方法：元素**翻转**给定角度，根据给定的水平线（X轴）和垂直线（Y轴）参数。
- `matrix()`方法：将所有 2D 转换方法组合在一起。六个参数：旋转、缩放、移动以及倾斜元素。

### 3D转换

- 通过`transform` 属性来实现。Chrome和Safari需要前缀-webkit-，IE9需要前缀 -ms-。
- `rotateX()`方法：元素围绕其X轴以给定的度数进行旋转。`rotateY()`方法：元素围绕其Y轴以给定的度数进行旋转。`rotateZ()`方法。`rotate3d()`定义3D旋转。
- `translate3d(x,y,z)`定义3D转化，还有`translateX(),translateY(),translateZ()`
- `scale3d(x,y,z)`定义3D缩放。

- `transform-style`属性规定如何在3D空间中呈现被嵌套元素。取值：flat（子元素不保留其3D位置）|preserve-3d（子元素保留其3D位置）。
- `perspective(n)`定义3D元素的透视视图。

### 过渡

- 通过`transition`属性实现。过渡是元素从一种样式逐渐改变为另一种的效果。必须对顶两项内容：效果  时长。若向多个样式添加过渡效果，可以添加多个属性，用逗号隔开。

- `trasition`是简写属性，具体包括`transition-property`规定应用过渡的CSS属性名；`transition-duration`定义时间，默认0；`transition-timing-function`规定过渡效果的时间曲线，默认是“ease”；`transition-delay`规定过渡效果何时开始，默认0。

- `transition-property: none|all|property`

- `transition-timing-function: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);`

  | 值                            | 描述                                                         |
  | ----------------------------- | ------------------------------------------------------------ |
  | linear                        | 规定以**相同速度**开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。 |
  | ease                          | 规定**慢速开始**，然后**变快**，然后**慢速结束**的过渡效（cubic-bezier(0.25,0.1,0.25,1)）。 |
  | ease-in                       | 规定以**慢速开始**的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。 |
  | ease-out                      | 规定以**慢速结束**的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。 |
  | ease-in-out                   | 规定以**慢速开始和结束**的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。 |
  | cubic-bezier(*n*,*n*,*n*,*n*) | 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。 |

### 动画

- **@keyframes 规则**用于创建动画，在 `@keyframes` 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。

- **语法**：`@keyframes animationname {keyframes-selector {css-styles;}}`。animationname定义**动画名称**，必需；keyframe-selector 定义**动画时长**，必需，合法值：0-100%，from(0%)，to(100%)。

  ```js
  @keyframes mymove {
      0%   {top:0px;}
      25%  {top:200px;}
      50%  {top:100px;}
      75%  {top:200px;}
      100% {top:0px;}
  }
  ```

- 通过**animation**属性来绑定使用动画。该属性是一个简写属性，用于设置六个动画属性。

- **语法**：`animation: name duration timing-function delay iteration-count direction;`

  - `animation-name`需要绑定到选择器的 keyframe 名称
  - `animation-duration`规定完成动画所花费的时间，以秒或毫秒计。
  - `animation-timing-function`规定动画速度曲线
  - `animation-delay`规定动画开始前的延迟
  - `animation-iteration-count`规定动画播放次数，n|infinite
  - `animation-direction`规定是否应该轮流反向播放动画，normal|alternate

- `animation-play-state`规定动画是否正在运行或暂停，默认“running”，可以通过js来控制。

- `animation-fill-mode: none|forwards|backwards|both`规定动画在播放之前或之后，其动画效果是否可见

  | 值        | 描述                                                         |
  | :-------- | :----------------------------------------------------------- |
  | none      | 不改变默认行为。                                             |
  | forwards  | 当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。 |
  | backwards | 在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。 |
  | both      | 向前和向后填充模式都被应用。                                 |

