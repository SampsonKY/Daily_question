# HTML5拖放（Drag和Drop）

## 例子

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8"> 
    <title>菜鸟教程(runoob.com)</title>
    <style type="text/css">
    	#div1 {width:350px;height:70px;padding:10px;border:1px solid #aaaaaa;}
    </style>
    <script>
        function allowDrop(ev)
        {
            ev.preventDefault();
        }

        function drag(ev)
        {
            ev.dataTransfer.setData("Text",ev.target.id);
        }

        function drop(ev)
        {
            ev.preventDefault();
            var data=ev.dataTransfer.getData("Text");
            ev.target.appendChild(document.getElementById(data));
        }
    </script>
</head>
<body>
 
    <p>拖动 RUNOOB.COM 图片到矩形框中:</p>

    <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    <br>
    <img loading="lazy" id="drag1" src="/images/logo.png" draggable="true" ondragstart="drag(event)" width="336" height="69">
 
</body>
</html>
```

## 设置元素为可拖放

首先，为了使元素可拖动，把 draggable 属性设置为 true ：

``` html
<img draggable="true">
```

------

## 拖动什么 - ondragstart 和 setData()

然后，规定当元素被拖动时，会发生什么。

在上面的例子中，ondragstart 属性调用了一个函数，drag(event)，它规定了被拖动的数据。

**dataTransfer.setData()** 方法设置被拖数据的数据类型和值：

```js
function drag(ev)
{
  ev.dataTransfer.setData("Text",ev.target.id);
}
```

Text 是一个 DOMString 表示要添加到 drag object 的拖动数据的类型。值是可拖动元素的 id ("drag1")。

------

## 放到何处 - ondragover

ondragover 事件规定在何处放置被拖动的数据。

默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。

这要通过调用 ondragover 事件的 event.preventDefault() 方法：

```js
event.preventDefault()
```

------

## 进行放置 - ondrop

当放置被拖数据时，会发生 drop 事件。

在上面的例子中，ondrop 属性调用了一个函数，drop(event)：

```js
function drop(ev)
{
  ev.preventDefault();
  var data=ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
}
```

代码解释：

- 调用 preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开）
- 通过 dataTransfer.getData("Text") 方法获得被拖的数据。该方法将返回在 setData() 方法中设置为相同类型的任何数据。
- 被拖数据是被拖元素的 id ("drag1")
- 把被拖元素追加到放置元素（目标元素）中