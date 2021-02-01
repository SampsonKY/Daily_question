### 1. CSS 盒子模型

- 两种盒模型：IE 盒模型（border-box），W3C 盒模型（content-box）
- 盒模型：分为 内容（content）、填充（padding）、边界（margin）、边框（border）四个部分
- W3C 标准盒模型：属性width，height 只包含内容content，不包含border 和padding
- IE 盒模型：属性width，height 包含content、border 和padding，指的是content+padding+border。
- 可以通过修改元素的 box-sizing 属性来改变元素的盒模型

### 2. CSS 选择器有哪些

- id选择器（#myid)
- 类选择器（.myclassname）
- 标签选择器（div,h1,p）
- 后代选择器（h1 p）
- 相邻后代选择器（子）选择器（ul>li）
- 兄弟选择器（li~a）
- 相邻兄弟选择器（li+a）
- 属性选择器（a[rel="external"]）
- 伪类选择器（a:hover,li:nth-child）
- 伪元素选择器（::before、::after）
- 通配符选择器（*）

### 3. ::before 和 :after 中双冒号和单冒号有什么区别，并解释这 2 个伪元素的作用

- 双冒号是在当前规范引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素的写法，比如 :first-line、:first-letter、:before、:after等。【在css3 中使用**单冒号来表示伪类，用双冒号来表示伪元素**。但是为了兼容已有的伪元素的写法，在一些浏览器中也可以使用单冒号来表示伪元素。】
- 在新的CSS3中引入的伪元素不允许再支持旧的单冒号的写法。
- 想让插入的内容出现在其它内容前，使用::before，否者，使用::after；在代码顺序上，::after 生成的内容也比::before 生成的内容靠后。如果按堆栈视角，::after 生成的内容会在::before 生成的内容之上。
- **伪类一般匹配的是元素的一些特殊状态，如hover、link 等，而伪元素一般匹配的特殊的位置，比如after、before 等。**

### 4. 伪类和伪元素的区别

- css 引入伪类和伪元素概念是为了格式化**文档树以外**的信息。也就是说，伪类和伪元素是用来修饰不在文档树中的部分，比如，一句话中的第一个字母，或者是列表中的第一个元素。
- **伪类**用于当已有的元素处于某个状态时，为其添加对应的样式，这个状态是**根据用户行为而动态变化的**。比如说，当用户悬停在指定的元素时，我们可以通过:hover 来描述这个元素的状态。
- **伪元素**用于创建一些不在文档树中的元素，并为其添加样式。它们允许我们为元素的某些部分设置样式。比如说，我们可以通过::before 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

### 5. CSS 中哪些属性可以继承

- 每一个属性在定义中都给出了这个属性是否具有继承性，一个具有继承性的属性在没有指定值的时候，会使用**父元素的同属性的值**来作为自己的值。
- 一般**具有继承性的属性**有，字体相关的属性，font-size和font-weight等。文本相关的属性，color 和 text-align等。表格的一些布局属性、列表属性如list-style等。还有光标属性cursor、元素可见性visibility。
- 当一个属性不是继承属性的时候，也可以通过将它的值设置为 **inherit** 来使它从父元素那里获取同名的属性值来继承。

### 6. CSS 优先级算法如何计算

- 判断优先级时，**首先**会判断一条属性声明是否有**权重**（!important）。一条声明加了权重，那么它的优先级是最高的，前提是它之后不再出现相同权重的声明。如果权重相同，需要比较匹配**规则的特殊性**。
- 一条匹配规则一般由多个选择器组成，一条规则的特殊性由组成它的选择器的特殊性累加而成。选择器的特殊性可以分为四个等级，第一个等级是**行内样式**，为1000，第二个等级是**id 选择器**，为0100，第三个等级是**类选择器、伪类选择器和属性选择器**，为0010，第四个等级是**元素选择器和伪元素选择器**，为0001。规则中每出现一个选择器，就将它的特殊性进行叠加，这个叠加只限于对应的等级的叠加，不会产生进位。选择器特殊性值的比较是从左向右排序的，也就是说以1 开头的特殊性值比所有以0 开头的特殊性值要大。
- 相同特殊性值的声明，根据**样式引入的顺序**，后声明的规则优先级高

### 7. 关于伪类 LVHA 的解释

a 标签有四种状态：链接访问前、链接访问后、鼠标滑过、激活，分别对应四种伪类:link、:visited、:hover、:active；

当**链接未访问过时**：

- 当鼠标滑过a 链接时，满足:link 和:hover 两种状态，要改变a 标签的颜色，就必须将:hover伪类在:link 伪类后面声明；
- 当鼠标点击激活a 链接时，同时满足:link、:hover、:active 三种状态，要显示a 标签激活时的样式（:active），必须将:active 声明放到:link 和:hover 之后。因此得出LVHA 这个顺序。

**当链接访问过时**，情况基本同上，只不过需要将:link 换成:visited。

这个顺序能不能变？可以，但也只有:link 和:visited 可以交换位置，因为一个链接要么访问过要么没访问过，不可能同时满足，也就不存在覆盖的问题。

### 8. CSS3新增的伪类有哪些

- elem:nth-child(n)**选中父元素下的第n 个子元素**，并且这个子元素的标签名为elem，n可以接受具体的数值，也可以接受函数。
- elem:nth-last-child(n)作用同上，不过是**从后开始查找**。
- elem:last-child 选中**最后一个子元素**。
- elem:only-child 如果elem 是父元素下**唯一的子元素**，则选中之。
- elem:nth-of-type(n)选中父元素下**第n 个elem 类型元素**，n 可以接受具体的数值，也可以接受函数。
- elem:first-of-type 选中父元素下**第一个elem 类型元素**。
- elem:last-of-type 选中父元素下**最后一个elem 类型元素**。
- elem:only-of-type 如果父元素下的**子元素只有一个elem 类型元素**，则选中该元素。
- elem:empty 选中**不包含子元素和内容的elem 类型元素**。
- elem:target 选择当前活动的elem 元素。
- :not(elem)选择非elem 元素的每个元素。
- :enabled 控制表单控件的禁用状态。
- :disabled 控制表单控件的禁用状态。
- :checked 单选框或复选框被选中。

### 9. 如何实现居中div

**对于宽高固定的元素**

- 利用 `margin: 0 auto` 来实现元素水平居中
- 利用**绝对定位**，设置四个方向的值都为0，并将margin 设为 auto。
- 利用**绝对定位**，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过**margin 负值**来调整元素的中心点到页面的中心。
- 利用**绝对定位**，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过**translate** 来调整元素的中心点到页面的中心。
- 使用**flex 布局**，通过`align-items:center` 和`justify-content:center `设置容器的垂直和水平方向上为居中对齐，然后它的子元素也可以实现垂直和水平的居中。

对于不定宽高的元素，后面两种方法也可以实现元素垂直和水平居中。

### 10. display 有哪些值？

- block 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。
- none 元素不显示，并从文档流中移除。
- inline 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。
- inline-block 默认宽度为内容宽度，可以设置宽高，同行显示。
- list-item 像块类型元素一样显示，并添加样式列表标记。
- table 此元素会作为块级表格来显示。
- inherit 规定应该从父元素继承display 属性的值。

### 11. position 属性值有哪些？

- **absolute**生成绝对定位的元素，相对于值不为static 的第一个父元素的 padding box 进行位，也可以理解为离自己这一级元素最近的一级position 设置为absolute 或者relative 的父元素的 **padding box 的左上角为原点**的。
- **fixed**（老IE 不支持）生成绝对定位的元素，相对于浏览器窗口进行定位。
- **relative**生成相对定位的元素，相对于其元素本身所在正常位置进行定位。
- **static**默认值。没有定位，元素出现在正常的流中（忽略top,bottom,left,right,z-index 声明）。
- **inherit**规定从父元素继承position 属性的值。

**绝对定位元素合萼非绝对定位元素的百分比计算区别**

- 绝对定位元素的宽高百分比是相对于临近的position 不为static 的祖先元素的paddingbox 来计算的。
- 非绝对定位元素的宽高百分比则是相对于父元素的contentbox 来计算的。

### 12. CSS3 有哪些新特性（根据项目）

- 新增各种 CSS 选择器（:not(.input)：所有class 不是“input”的节点）
- 圆角（border-radius:8px）
- 多列布局（multi-columnlayout）
- 阴影和反射（Shadow\Reflect）
- 文字特效（text-shadow）
- 文字渲染（Text-decoration）
- 线性渐变（gradient）
- 旋转（transform）
- 缩放，定位，倾斜，动画，多背景

### 13. CSS3 的 Flexbox(弹性盒布局模型)

- flex 布局是CSS3 新增的一种布局方式，我们可以通过将一个元素的**display** 属性值设置为flex从而使它成为一个flex容器，它的所有子元素都会成为它的项目。
- 一个容器默认有两条轴，一个是水平的主轴，一个是与主轴垂直的交叉轴。我们可以使用**flex-direction** 来指定主轴的方向。
- 我们可以使用**justify-content** 来指定元素在主轴上的排列方式，使用**align-items** 来指定元素在交叉轴上的排列方式。
- 还可以使用**flex-wrap** 来规定当一行排列不下时的换行方式。
- 对于容器中的项目，我们可以使用**order** 属性来指定项目的排列顺序，还可以使用**flex-grow**来指定当排列空间有剩余的时候，项目的放大比例。还可以使用**flex-shrink** 来指定当排列空间不足时，项目的缩小比例。

### 13. 用纯 CSS 创建一个三角形的原理是什么

采用的是相邻边框连接处的均分原理。将元素的宽高设为0，只设置 border，把任意三条边隐藏掉（颜色设为 transparent，表示透明），剩下的就是一个三角形。

```css
#triangle{
    height: 0;
    width: 0;
    border-width: 20px;
    border-style: solid;
    border-color: transparent transparent red transparent;
}
```

### 14. 一个满屏品字布局如何设计

上面的div 宽100%，下面的两个div 分别宽50%，然后用float 或者inline 使其不换行即可

### 15. CSS多列等高如何实现

- 利用padding-bottom|margin-bottom 正负值相抵，不会影响页面布局的特点。设置父容器超出隐藏（overflow:hidden），这样父容器的高度就还是它里面的列没有设定padding-bottom 时的高度，当它里面的任一列高度增加了，则父容器的高度被撑到里面最高那列的高度，其他比这列矮的列会用它们的padding-bottom补偿这部分高度差。

  [原理参考](https://blog.csdn.net/GreyBearChao/article/details/84580955)

- 利用table-cell 所有单元格高度都相等的特性，来实现多列等高。

- 利用flex 布局中项目align-items 属性默认为stretch，如果项目未设置高度或设为auto，将占满整个容器的高度的特性，来实现多列等高。

- [常用的多列等高布局](https://juejin.im/post/6844903615182667789)

### 16. 经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用 hack 的技巧

- png24 位的图片在iE6 浏览器上出现背景 解决：做成PNG8，也可以引用一段脚本处理。

- 浏览器默认的margin 和padding 不同  解决：加一个全局的`*{margin:0;padding:0;}`来统一。

- Chrome 中文界面下默认会将小于12px 的文本强制按照12px 显示
  解决方法：

  - 可通过加入CSS 属性-webkit-text-size-adjust:none;解决。但是，在chrome
    更新到27 版本之后就不可以用了。
  - 还可以使用-webkit-transform:scale(0.5);注意-webkit-transform:scale(0.75);
    收缩的是整个span 的大小，这时候，必须要将span 转换成块元素，可以使用display：block/inline-block/...；

- 超链接访问过后hover 样式就不出现了，被点击访问过的超链接样式不再具有hover
  和active 了  解决方法：改变CSS 属性的排列顺序L-V-H-A
  
- 怪异模式问题：漏写DTD 声明，Firefox 仍然会按照标准模式来解析网页，但在IE 中会
  触发怪异模式。为避免怪异模式给我们带来不必要的麻烦，最好养成书写DTD 声明的好习惯。

### 17. li与li之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

浏览器会把inline 元素间的空白字符（空格、换行、Tab 等）渲染成一个空格。有时候需要将`<li>`放在一行，这导致`<li>`换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。
解决办法：

- 为`<li>`设置`float:left`。不足：有些容器是不能设置浮动，如左右切换的焦点图等。
- 将所有`<li>`写在同一行。不足：代码不美观。
- 将`<ul>`内的字符尺寸直接设为0，即`font-size:0`。不足：`<ul>`中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari 浏览器依然会出现空白间隔。
- 消除`<ul>`的字符间隔`letter-spacing:-8px`，不足：这也设置了`<li>`内的字符间隔，因此需要将`<li>`内的字符间隔设为默认`letter-spacing:normal`。

### 18. 为什么要初始化 CSS 样式

- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS 初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

淘宝的样式初始化代码：

```css
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend
,button,input,textarea,th,td{margin:0;padding:0;}
body,button,input,select,textarea{font:12px/1.5tahoma,arial,\5b8b\4f53;}
h1,h2,h3,h4,h5,h6{font-size:100%;}
address,cite,dfn,em,var{font-style:normal;}
code,kbd,pre,samp{font-family:couriernew,courier,monospace;}
small{font-size:12px;}
ul,ol{list-style:none;}
a{text-decoration:none;}
a:hover{text-decoration:underline;}
sup{vertical-align:text-top;}
sub{vertical-align:text-bottom;}
legend{color:#000;}
fieldset,img{border:0;}
button,input,select,textarea{font-size:100%;}
table{border-collapse:collapse;border-spacing:0;}
```

### 19. 什么是包含块，对于包含块的理解？

包含块（containing block）就是**元素用来计算和定位的一个框。**

- 根元素（很多场景下可以看成是`<html>`）被称为“**初始包含块**”，其尺寸等同于**浏览器**
  **可视窗口的大小**。
- 对于其他元素
  - 如果该元素的position 是**relative 或者static**，则“包含块”由其**最近的块容器祖先盒的contentbox边界形成。**
  - 如果元素**position:fixed**，则“包含块”是“**初始包含块**”。
  - 如果元素**position:absolute**，则“包含块”由**最近的position 不为static 的祖先元素建立**，具体方式如下：
    如果该祖先元素是**纯inline 元素**，则规则略复杂：
    - 假设给内联元素的前后各生成一个宽度为0 的内联盒子（inlinebox），则这两个内联盒子的paddingbox 外面的包围盒就是内联元素的“包含块”；
    - 该内联元素被跨行**分割了**，那么“包含块”是未定义的，也就是CSS2.1 规范并没有明确定义，浏览器自行发挥否则，“包含块”由该祖先的paddingbox 边界形成。

- 如果没有符合条件的祖先元素，则“包含块”是“初始包含块”。

### 20. CSS 里的 visibility 属性值 collapse 作用

- 对于一般的元素，它的表现和 visibility: hidden 是一样的。元素是不可见的，但此时仍占用页面空间
- 但例外的是，如果这个元素是table 相关的元素，例如table 行，table group，table 列，table column group，它的表现却跟display:none 一样，也就是说，它们占用的空间也会释放。

在不同浏览器下的区别：

- 在谷歌浏览器里，使用collapse 值和使用hidden 值没有什么区别。
- 在火狐浏览器、Opera 和IE11 里，使用collapse 值的效果就如它的字面意思：table 的行会消失，它的下面一行会补充它的位置。

### 21. width:auto 和 width:100% 的区别

- width:100%会使元素box 的宽度等于父元素的contentbox 的宽度。
- width:auto 会使元素撑满整个父元素，margin、border、padding、content 区域会自动分配水平空间。

### 22. 使用图片 base64 编码的优缺点

> base64编码是一种图片处理格式，通过特定的算法将图片编码成一长串字符串，在页面上显示的时候，可以用该字符串代替图片的 url 属性。

**优点**

- 减少一个图片的 HTTP 请求

**缺点**

- 根据base64 的编码原理，编码后的**大小**会比原文件大小大1/3，如果把大图片编码到html/css 中，不仅会造成文件体积的增加，影响文件的加载速度，还会增加浏览器对html 或css 文件解析渲染的时间。
- 使用base64 无法直接缓存，要缓存只能缓存包含base64 的文件，比如HTML 或者CSS，这相比直接缓存图片的效果要差很多。
- 兼容性的问题，ie8 以前的浏览器不支持。

一般一些网站的小图标可以使用 base64 图片来引入

### 23. display、position 和float 的相互关系？

| 设定值                                                       | 计算值   |
| ------------------------------------------------------------ | -------- |
| inline-table                                                 | table    |
| inline, run-in, table-row-group, table-column, table-column-group, table-header-group,  table-footer-group, table-row, table-cell, table-caption, inline-block | block    |
| 其他                                                         | 同设定值 |

- 首先判断 `display` 是否为 `none`，若为 `none`，则 `position` 和 `float` 的值不影响元素最后的表现
- 然后判断 `position` 的值是否为 `absolute` 或 `fixed`，若是，则 `float` 属性失效，且 `display` 的值应该被设置为 `block` 或 `table`，具体转换需要看初始转换值。
- 如果 `position` 的值不为 `absolute` 和 `fixed`，则判断 `float` 属性的值是否为 `none`，如果不是，则`display`的值则按上面的规则转换。意，如果`position` 的值为`relative` 并且`float` 属性的值存在，则`relative` 相对于浮动后的最终位置定位。
- 如果`float` 的值为`none`，则判断元素是否为根元素，如果是根元素`display` 属性按照上面的规则转换，如果不是，则保持指定的`display` 属性值不变。

### 24. margin 重叠问题的理解

> margin 合并：块级元素的上外边距（margin-top）与下外边距（margin-bottom）有时会合并为单个外边距的现象。
>
> 折叠的必要条件：margin 必须是邻接的。

margin 重叠指的是在垂直方向上，两个相邻元素的margin 发生重叠的况。
一般来说可以分为**四种情形**：

- 第一种是**相邻兄弟元素**的marin-bottom 和margin-top 的值发生重叠。可以通过设**置其中一个元素为BFC**来解决。
- 第二种是**父元素**的margin-top 和**子元素**的margin-top 发生重叠。它们发生重叠是因为它们是相邻的，所以我们可以通过这一点来解决这个问题。我们可以为父元素设置border-top、padding-top 值来分隔它们，当然我们也可以将父元素设置为BFC来解决。
- 第三种是**高度为 auto 的父元素**的margin-bottom 和**子元素**的margin-bottom 发生重叠。它们发生重叠一个是因为它们相邻，一个是因为父元素的高度不固定。因此我们可以为父元素设置border-bottom、padding-bottom 来分隔它们，也可以为父元素设置一个高度，max-height 和min-height 也能解决这个问题。当然将父元素设置为BFC 是最简单的方法。
- 第四种情况，是**没有内容**的元素，自身的margin-top 和margin-bottom 发生的重叠。我们可以通过为其设置border、padding 或者高度来解决这个问题。

### 25. 对 BFC 规范的理解

- BFC——块级格式化上下文（BlockFormattingContext） ，一个元素形成了 BFC 后，那么它内部元素产生的布局不会影响到外部元素，外部元素的布局也不会影响到BFC中的内部元素，一个BFC就像是一个隔离区域，和其他区域互不影响。
- 一般来说根元素是一个BFC 区域，浮动和绝对定位的元素也会形成BFC，display 属性的值为inline-block、flex 这些属性时也会创建BFC。还有就是元素的overflow 的值不为visible 时都会创建BFC。

### 26. IFC 是什么

IFC 值的是行级格式化上下文，有这样的一些布局规则：

- 行级上下文内部的盒子会在水平方向，一个接一个地放置。
- 当一行不够的时候会自动切换到下一行。
- 行级上下文的高度由内部最高的内联盒子的高度决定。

### 27. 问什么要清除浮动？清除浮动的方式

- 浮动元素可以左右移动，直到遇到另一个浮动元素或者遇到它外边缘的包含框。浮动框不属于文档流中的普通流，当元素浮动之后，不会影响到块级元素的布局，只会影响内联元素布局。此时文档流中的普通流就会表现得该浮动框不存在一样的布局。当包含框的高度小于浮动框的时候，此时就会出现“高度塌陷”。
- 清除浮动是为了清除使用浮动元素产生的影响。浮动的元素，高度会塌陷，而高度的塌陷使我们页面后面的布局不能正常显示。
- 清除浮动的方式
  - 使用 clear 属性清除浮动
  - 使用BFC块级格式化上下文来清除浮动

### 28. clear 属性清除浮动的原理

使用clear 属性清除浮动，其语法如下：`clear:none|left|right|both`

如果单看字面意思，clear:left 应该是“清除左浮动”，clear:right 应该是“清除右浮动”的意思，实际上，这种解释是有问题的，因为浮动一直还在，并没有清除。

官方对clear 属性的解释是：“**元素盒子的边不能和前面的浮动元素相邻**。”，我们对元素设置clear 属性是为了**避免浮动元素对该元素的影响，而不是清除掉浮动**。

一般使用伪元素的方式清除浮动

```css
.clear::after{
    content:'';
    display:table;//也可以是'block'，或者是'list-item'
    clear:both;
}
```

clear 属性只有块级元素才有效的，而::after 等伪元素默认都是内联水平，这就是借助伪元素清除浮动影响时需要设置display 属性值的原因。

### 29. 移动端布局使用过媒体查询吗？

- 媒体查询为文档提供了在不同媒介（不同分辨率的终端上）上展示的适配方法。
- 媒体查询是**响应式设计**【响应式网站设计是一个网站能够**兼容多个终端**，而不是为每一个终端做一个特定的版本。基本原理是通过媒体查询检测不同的设备屏幕尺寸做处理。页面头部必须有meta 声明的viewport。】的核心，它根据条件告诉浏览器如何为指定视图宽度渲染页面。当媒体查询为真时，相关的样式表或样式规则会按照正常的级联规被应用。当媒体查询返回假，标签上带有媒体查询的样式表仍将被下载（只不过不会被应用）。
- 媒体查询包含了一个媒体类型和至少一个使用宽度、高度和颜色等媒体属性来限制样式表范围的表达式。CSS3 加入的媒体查询使得无需修改内容便可以使样式应用于某些特定的设备范围。

### 30. CSS 优化、提高性能的方法有哪些

**加载性能**

- 将 css 打包压缩，减少体积
- 减少使用 @import，建议使用 link，因为后者在页面加载时一起加载，前者是等待页面加载完成后再进行加载。

**选择器性能**

- 避免使用通配规则，只对需要用到的元素进行选择【对于通配符，需要把所有的标签都遍历一遍，当网站较大时，样式比较多，这样写就大大的加强了网站运行的负载，会使网站加载的时候需要很长一段时间，因此一般大型的网站都有分层次的一套初始化样式。】
- 尽量少使用后代选择器【CSS 选择符是从右到左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等，这样开销很大】，减少对标签进行选择，降低选择器深度，更多使用类选择器来关联标签。
- 了解哪些属性是可以通过继承的，避免对这些属性重复指定规则。

**渲染性能**

- 慎用高性能属性：浮动、定位
- 尽量减少页面重排、重绘
- 属性为0时，不加单位。属性值为浮动小数 0.xx，可以省略小数点前的0
- 不使用 @import 属性，它会影响 css 的加载速度。
- 选择器优化嵌套，避免层级过深
- CSS 雪碧图：将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS 的background-image，background-repeat，background-position 的组合进行背景定位。利用CSSSprites 能很好地减少网页的http 请求，从而很好的提高页面的性能；CSSSprites能减少图片的字节。
  - 优点：①减少HTTP请求数，极大地提高页面加载速度②增加图片信息重复度，提高压缩比，减少图片大小③更换风格方便，只需要在一张或几张图片上修改颜色或样式即可实现
  - 缺点：图片合并麻烦；维护麻烦，修改一个图片可能需要重新布局整个图片，样式
- 不滥用 web 字体

**可维护性、可健壮性**

- 将具有相同属性的样式抽离出来，整合并通过class 在页面中进行使用，提高 css 的可维护性。
- 样式与内容分离：将css 代码定义到外部css

### 31. 浏览器是如何解析CSS选择器的

- 样式系统从**关键选择器**【选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）】开始匹配，然后左移查找规则选择器的祖先元素。只要选择器的子树一直在工作，样式系统就会持续左移，直到和规则匹配，或者是因为不匹配而放弃该规则。
- 试想一下，如果采用从左至右的方式读取CSS 规则，那么大多数规则读到最后（最右）才会发现是不匹配的，这样做会费时耗能，最后有很多都是无用的；而如果采取从右向左的方式，那么只要发现最右边选择器不匹配，就可以直接舍弃了，避免了许多无效匹配。

### 32. 元素竖向的百分比设定是相对于容器的高度吗？

- 如果是height 的话，是相对于包含块的高度。
- 如果是padding 或者margin 竖直方向的属性则是相对于包含块的宽度。

### 33.  设备像素、css 像素、设备独立像素、dpr、ppi 之间的区别？

- **设备像素**指的是物理像素，一般手机的分辨率指的就是设备像素，一个设备的设备像素是不可变的。
- **css 像素**是Web编程的概念，指的是CSS样式代码中使用的逻辑像素。在CSS规范中，长度单位可以分为两类，绝对(absolute)单位以及相对(relative)单位。px是一个相对单位，相对的是设备像素(device pixel)。
- **css像素**和**设备独立像素**是等价的，不管在何种分辨率的设备上，css 像素的大小应该是一致的，css 像素是一个相对单位，它是相对于设备像素的，一个css 像素的大小取决于页面缩放程度和dpr 的大小。
- **dpr** 指的是设备像素和设备独立像素的比值，一般的pc 屏幕，dpr=1。在iphone4 时，苹果推出了retina 屏幕，它的dpr为2。屏幕的缩放会改变dpr 的值。
- **像素密度ppi** 指的是每英寸的物理像素的密度，ppi 越大，屏幕的分辨率越大。

参考资料：[前端工程师需要明白的像素](https://www.jianshu.com/p/af6dad66e49a)、[CSS像素、物理像素、逻辑像素、设备像素比、PPI、Viewport](https://github.com/jawil/blog/issues/21)、[[什么是物理像素、虚拟像素、逻辑像素、设备像素，什么又是 PPI, DPI, DPR 和 DIP](https://www.cnblogs.com/libin-1/p/7148377.html)](https://www.cnblogs.com/libin-1/p/7148377.html)

### 34. 如果要手写动画，你认为最小时间间隔是多久，为什么？

多数显示器默认频率是60Hz，即1 秒刷新60 次，所以理论上最小间隔为1/60*1000ms＝16.7ms。

### 35. layoutviewport、visualviewport 和 idealviewport的区别

- 第一个视口是布局视口，在移动端显示网页时，由于移动端的屏幕尺寸比较小，如果网页使用移动端的屏幕尺寸进行布局的话，那么整个页面的布局都会显示错乱。所以移动端浏览器提供了一个layoutviewport 布局视口的概念，使用这个视口来对页面进行布局展示，一般layoutviewport 的大小为980px，因此页面布局不会有太大的变化，我们可以通过拖动和缩放来查看到这个页面。
- 第二个视口指的是视觉视口，visualviewport 指的是移动设备上我们可见的区域的视口大小，一般为屏幕的分辨率的大小。
- 第三个视口是理想视口，由于layoutviewport 一般比visualviewport 要大，所以想要看到整个页面必须通过拖动和缩放才能实现。所以又提出了idealviewport 的概念idealviewport 下用户不用缩放和滚动条就能够查看到整个页面，并且页面在不同分辨率下显示的内容大小相同。idealviewport 其实就是通过修改layoutviewport 的大小，让它等于设备的宽度，这个宽度可以理解为是设备独立像素，因此根据idealviewport 设计的页面，在不同分辨率的屏幕下，显示应该相同。

### 36. position:fixed; 在 android 下无效怎么处理？

因为移动端浏览器默认的viewport 叫做layoutviewport。在移动端显示时，因为layoutviewport的宽度大于移动端屏幕的宽度，所以页面会出现滚动条左右移动，fixed 的元素是相对layoutviewport 来固定位置的，而不是移动端屏幕来固定位置的，所以会出现感觉fixed 无效的情况。

如果想实现fixed 相对于屏幕的固定效果，我们需要改变的是viewport 的大小idealviewport，可以如下设置：

```html
<metaname="viewport"content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no"/>
```

### 37. 如何去除 inline-block 元素间间距

移除空格、使用margin 负值、使用font-size:0、letter-spacing、word-spacing

### 38. 有一个高度自适应的 div，里面有两个 div，一个高度100px，希望另一个填满剩下的高度

- 外层div使用`position: relative;` 高度要求自适应的div使用`position:absolute;top:100px;bottom:0;left:0;right:0`
- 使用flex布局，设置主轴为竖轴，第二个div的flex-grow为1

### 39. CSS 预处理器/后处理器

- CSS 预处理器定义了一种新的语言，其基本思想是，用一种专门的编程语言，为CSS 增加了一些编程的特性，将CSS 作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。
- CSS预处理器有：LESS，Sass等。
- CSS后处理器是对CSS进行处理，并最终生成CSS预处理器，它属于广义上的CSS预处理器
- 后处理器例如：PostCSS，通常被视为在完成的样式中根据CSS规范处理CSS，让其更有效；目前最常做的是给CSS属性添加浏览器私有前缀，实现浏览器兼容性的问题。

### 40. 画一条0.5px的线

[参考](https://juejin.im/post/6844903582370643975)

### 41. 常见的元素隐藏方式？

- `display:none`，隐藏元素，渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会影响绑定的兼听事件
- `visibility: hidden`，隐藏元素，元素在页面中仍占据空间，但不会响应绑定的监听事件
- `opacity:0`，将元素的透明度设置为0，以此隐藏元素。元素在页面中仍占据空间，并能响应元素绑定的监听事件
- 通过绝对定位将元素移除可视区域内。
- 通过`z-index`负值来使其他元素遮住该元素
- 通过`transform:scale(0,0)`来将元素缩放为0，以此来实现元素隐藏，该方法下元素在页面中占据位置，但不会影响绑定的监听事件。

### 42.  单行/多行文本溢出的省略(…)？

```css
//单行文本溢出
p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
}
//多行文本溢出
p{
    position: relative;
    line-height: 1.5em;
    height: 3em;
    overflow:hidden;
}
p:after{
    content: '...';
    position: absolute;
    bottom:0;right:0;
    background-color: #fff;
}
```

### 43. overflow 的特殊性

- 一个设置了 `overflow: hidden` 声明的元素，假设同时存在 `border` 和 `padding` 属性，则当子元素内容超出容器宽度高度限制的时候，裁剪的边界是 borderbox 的内边缘，而非 paddingbox 的内边缘
- HTML中有两个标签默认可以产生滚动条，一个是根元素`<html>`，另一个是文本域`<textarea>`
- 滚动条会占用容器的可用宽度或高度
- 元素设置了 `overflow:hidden` 声明，里面内容高度溢出的时候，滚动依然存在，仅仅滚动条不存在

### 44. 一些典型布局

#### 1.  如何实现上下固定，中间自适应

#### 2. CSS 两栏布局的实现

#### 3. 实现一个宽高自适应的正方形

#### 4. 实现一个三角形

#### 5. 一个自适应矩形，水平垂直居中，且宽高比为 2:1



