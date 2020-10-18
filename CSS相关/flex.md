# Flexbox

## flexbox简介

> 在flex布局模型中，flex容器的子节点可以在任何方向布局，并且可以“flex”它们的大小，要么增长以填充未使用的空间，要么缩小以避免溢出父节点。 可以容易地操纵子元素的水平和垂直对齐。 这些框的嵌套（水平内部垂直或垂直内部水平）可用于构建二维布局。

> flexbox的出现是为了解决复杂的web布局，因为这种布局方式很灵活。

* 弹性盒布局的概念

  在定义方面来说，弹性布局是指通过调整其内元素的宽高，从而在任何显示设备上实现对可用显示空间最佳填充的能力。弹性容器扩展其内元素来填充可用空间，或将其收缩来避免溢出。

  块级布局更侧重于垂直方向、行内布局更侧重于水平方向，与此相对的，弹性盒子布局算法是方向无关的。虽然块级布局对于单独一个页面来说是行之有效的，但其仍缺乏足够的定义来支持那些必须随用户代理(user  agent)不同或设备方向从水平转为垂直等各种变化而变换方向、调整大小、拉伸、收缩的应用程序组件。  弹性盒子布局主要适用于应用程序的组件及小规模的布局，而（新兴的）栅格布局则针对大规模的布局。这二者都是 CSS  工作组为在不同用户代理、不同书写模式和其他灵活性要求下的网页应用程序有更好的互操作性而做出的更广泛的努力的一部分。

* 浏览器支持

  ![img](http://img.blog.csdn.net/20150614214928739)

* 一些优点

  1.如果元素容器没有足够的空间，我们无需计算每个元素的宽度，就可以设置他们在同一行；

   2.可以快速让他们布局在一列；

   3.可以方便让他们对齐容器的左、右、中间等；

   4.无需修改结构就可以改变他们的显示顺序；

   5.如果元素容器设置百分比和视窗大小改变，不用提心未指定元素的确切宽度而破坏布局，因为容器中的每个子元素都可以自动分配容器的宽度或高度的比例。
  
* 注意

  由于弹性盒子使用了不同的布局算法，某些属性用在弹性容器上没有意义：

  - [多栏布局模块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_multi-column_layouts)的 `column-*` 属性对弹性项目无效。
  - [`float`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float) 与 [`clear`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear) 对弹性项目无效。使用 `float` 将使元素的 `display` 属性计为`block`。
  - [`vertical-align`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align) 对弹性项目的对齐无效。

## Flexbox模型及术语

>  flex布局模型不同于块和内联模型布局，块和内联模型的布局计算依赖于块和内联的流方向，而flex布局依赖于flex directions.简单的说：Flexbox是布局模块，而不是一个简单的属性，它包含父元素(flex container)和子元素(flex 
> items)的属性。

* 模型

  ![弹性布局相关名词](https://mdn.mozillademos.org/files/12998/flexbox.png)

## 属性

1. display ( ==flex container== )

   ` display: other values | flex | inline-flex`

2. flex-direction ( ==flex container== )

   **这个主要是用来创建主轴，从而定义了伸缩项目放置在伸缩容器的方向**

   `flex-direction: row | row-reverse | column | column-reverse`

   * row(默认值): 在"ltr"排版方式下从左到右，在"rtl"排版方式下从右到左排列
   * row-reverse: 与row排列方向相反
   * column: 与row类似，从上到下排
   * column: 从下到上排

3. order (**flex items**)

   **默认情况下，伸缩项目是按照文档流出现先后顺序排列，然而，"order"属性可以控制伸缩项目在他们的伸缩容器出现的顺序**

   > order取值越大，越排在后面。并且order可以取负值。

   ` order: <integer>`

4. flex-wrap(==flex container== )

   **这个主要用来定义伸缩容器里是单行还是多行显示，侧轴方向决定了新行堆放的方向**

   `flex-wrap: nowrap | wrap | wrap-reverse`

   * nowrap: 伸缩容器单行显示，在"ltr"排版方式下从左到右，在"rtl"排版方式下从右到左排列
   * wrap:伸缩容器多行显示
   * wrap-reverse：与wrap相反

5. flex-flow(==flex container== )

   **flex-direction和flex-wrap属性的缩写**

   例： flex-flow：row wrap；

6. justify-content(==flex container== )

   > 这个是用来定义伸缩项目沿着主轴线的对齐方式。当一行上的所有伸缩项目都不能伸缩或可伸缩但是已经达到其最大长度，这一属性才会对多余的空间进行分配。当项目溢出某一行时，这一属性也会在项目的对齐上施加一些控制。

   > 设置了这个属性，在主轴方向上设置的任何margin都不会起作用。

   ` justify-content：flex-start | flex-end | center | space-between | space-around `

   ![justify-content](http://img.blog.csdn.net/20150616151746589)

7. align-content(==flex container== )

   **这个属性主要用来调准伸缩行在伸缩容器里的对齐方式**

   `aligh-content: flex-start | flex-end | center | space-between | space-around | stretch`

   ![align-content](http://img.blog.csdn.net/20150616163037523)

8. align-items(==flex container== )

   > 这可能有些容易混淆，但`align-content`决定行之间的间隔，而`align-items`决定元素整体在容器的什么位置。只有一行的时候`align-content`没有任何效果。

   `align-items: flex-start | flex-end | center | baseline | stretch(默认值)`

   ![align-items](http://img.blog.csdn.net/20150616152600533)

9. align-self(**flex items**)

   **用来在单独的伸缩项目上复写默认的样式**

   `align-self: auto | flex-end | center | baseline | stretch`

   ![align-self](http://img.blog.csdn.net/20150616162253991)

10. flex-grow(**flex items**)

    **根据需要用来定义伸缩项目的扩展能力。它接受一个不带单位的值做为一个比例。主要用来决定伸缩容器剩余空间按比例应扩展多少空间。**

    `flex-grow: <number>; /* default 0 */`

    ![flex-grow](http://img.blog.csdn.net/20150616153319255)

11. flex-shrink(**flex items**)

    **根据需要用来定义伸缩项目收缩的能力。[注意：负值同样生效。]**

    `flex-shrink: <number>; /*default: 1*/`

    

12. flex-basis(**flex items**)

    **这个用来设置伸缩基准值，剩余的空间按比率进行伸缩。**

    `flex-basis: <length> | auto`

    如果设置为“0”，不考虑剩余空白空间。如果设置为自动，则按照flex-grow值分配剩余空白空间。如图所示：

    ![这里写图片描述](http://img.blog.csdn.net/20150616160709459)

13. flex(**flex items**)

    **这是“flex-grow”、“flex-shrink”和“flex-basis”三个属性的缩写。其中第二个和第三个参数（flex-shrink、flex-basis）是可选参数。默认值为“0 1 auto”。**

    `flex: [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] | auto | initial |  none  `

    *取值*

    * initial: 元素会根据自身宽高设置尺寸。它会缩短自身以适应 flex 容器，但不会伸长并吸收 flex 容器中的额外自由空间来适应 flex 容器 。相当于将属性设置为"`flex: 0 1 auto`"。
    * auto: 元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 flex 容器中额外的自由空间，也会缩短自身来适应 flex 容器。这相当于将属性设置为 "`flex: 1 1 auto`".
    * none: 元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为"`flex: 0 0 auto`"。

## 资料参考

1. Flexbox详情：<https://segmentfault.com/a/1190000002910324>
2. Flexbox快速布局栗子：<https://www.w3cplus.com/css3/flexbox-basics.html>
3. css弹性盒子：<https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes>
4. flex属性：<https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex>://www.w3cplus.com/css3/flexbox-basics.html>