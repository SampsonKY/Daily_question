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

- 新增各种CSS 选择器（:not(.input)：所有class 不是“input”的节点）
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
- 一个容器默认有两条轴，一个是水平的主轴，一个是与主轴垂直的交叉轴。我们可以使用
  **flex-direction** 来指定主轴的方向。
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

