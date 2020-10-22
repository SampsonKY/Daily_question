> 【好文收集】原文地址：http://www.linuxidc.com/Linux/2015-10/124622.htm

MVC、MVP、MVVM都是为了解决图形界面应用程序复杂性管理问题而产生的**应用架构模式**。

## GUI程序面临的问题

图形界面的应用程序提供给用户可视化的操作界面，这个界面提供给数据和信息。用户输入行为（键盘，鼠标等）会执行一些业务逻辑，可能会导致对应用程序数据的变更，数据的变更自然需要用户界面的同步变更以提供最准确的信息。例如用户对一个电子表格重新排序的操作，应用程序需要响应用户操作，对数据进行排序，然后需要同步到界面上。

在开发应用程序的时候，以求更好的管理应用程序的复杂性，基于**职责分离**（Speration of Duties）的思想都会对应用程序进行分层。在开发图形界面应用程序的时候，会把管理用户界面的层次称为**View**，应用程序的数据为**Model**（注意这里的Model指的是Domain Model，这个应用程序对需要解决的问题的数据抽象，不包含应用的状态，可以简单理解为对象）。Model层对应用程序的业务逻辑无知，只保存数据结构和提供数据操作的接口。

<img src="http://www.linuxidc.com/upload/2015_10/151028172463732.png" alt="img" style="zoom:67%;" />

有了View和Model的分层，那么就有了两个问题：

1. 响应用户操作的业务逻辑（例如排序）的管理。
2. View如何同步Model的变更

## MVC

### MVC的依赖关系

MVC出了把应用程序分成View、Model层，还额外的加了一个Controller层，它的职责就是专门管理应用程序的业务逻辑。Model、View、Controller三个层次的依赖关系如下：

![img](http://www.linuxidc.com/upload/2015_10/151028172463733.png)

Controller和View都依赖Model层，Controller和View可以互相依赖。在一些网上的资料Controller和View之间的依赖关系可能不一样，有些是单向依赖，有些是双向依赖，这个其实关系不大，后面会看到它们的依赖关系都是为了把处理用户行为触发的业务逻辑的处理权交给Controller。

### MVC的调用关系

用户的对View操作以后，View捕获到这个操作，会把处理的权利交移给Controller（Pass calls）；Controller接着会执行相关的业务逻辑，这些业务逻辑可能需要对Model进行相应的操作；当Model变更了以后，会通过观察者模式（Observer Pattern）通知View；View通过**观察者模式**收到Model变更的消息以后，会向Model请求最新的数据，然后重新更新界面。如下图：

![img](http://www.linuxidc.com/upload/2015_10/151028172463734.png)

看似没有什么特别的地方，但是由几个需要特别关注的关键点：

1. View是把控制权交移给Controller，自己不执行业务逻辑。
2. Controller执行业务逻辑并且操作Model，但不会直接操作View，可以说它是对View无知的。
3. View和Model的同步消息是通过**观察者模式**进行，而同步操作是由View自己请求Model的数据然后对视图进行更新。

需要特别注意的是MVC模式的精髓在于第三点：Model的更新是通过观察者模式告知View的，具体表现形式可以是Pub/Sub或者是触发Events。而网上很多对于MVC的描述都没有强调这一点。通过观察者模式的好处就是：不同的MVC三角关系可能会有共同的Model，一个MVC三角中的Controller操作了Model以后，两个MVC三角的View都会接受到通知，然后更新自己。保持了依赖同一块Model的不同View显示数据的实时性和准确性。我们每天都在用的观察者模式，在几十年前就已经被大神们整合到MVC的架构当中。

### MVC的优缺点

**优点**：

1. 把业务逻辑全部分离到Controller中，模块化程度高。当业务逻辑变更的时候，不需要变更View和Model，只需要Controller换成另外一个Controller就行了（Swappable Controller）。
2. 观察者模式可以做到多视图同时更新。

**缺点**：

1. Controller测试困难。因为视图同步操作是由View自己执行，而View只能在有UI的环境下运行。在没有UI环境下对Controller进行单元测试的时候，Controller业务逻辑的正确性是无法验证的：Controller更新Model的时候，无法对View的更新操作进行断言。
2. View无法组件化。View是强依赖特定的Model的，如果需要把这个View抽出来作为一个另外一个应用程序可复用的组件就困难了。因为不同程序的的Domain Model是不一样的

## MVP

MVP模式有两种：

1. Passive View
2. Supervising Controller

而大多数情况下讨论的都是Passive View模式。本文会对PV模式进行较为详细的介绍，而SC模式则简单提及。

### MVP（Passive View）的依赖关系

MVP模式把MVC模式中的Controller换成了Presenter。MVP层次之间的依赖关系如下：

![img](http://www.linuxidc.com/upload/2015_10/151028172463737.png)

MVP打破了View原来对于Model的依赖，其余的依赖关系和MVC模式一致。

#### MVP（Passive View）的调用关系

既然View对Model的依赖被打破了，那View如何同步Model的变更？看看MVP的调用关系：

![img](http://www.linuxidc.com/upload/2015_10/151028172463738.png)

和MVC模式一样，用户对View的操作都会从View交移给Presenter。Presenter同样的会执行相应的业务逻辑，并且对Model进行相应的操作；而这时候Model也是通过观察者模式把自己变更的消息传递出去，但是是传给Presenter而不是View。Presenter获取到Model变更的消息以后，**通过View提供的接口更新界面**。

关键点：

1. View不再负责同步的逻辑，而是由Presenter负责。Presenter中既有业务逻辑也有同步逻辑。
2. View需要提供操作界面的接口给Presenter进行调用。（关键）

对比在MVC中，Controller是不能操作View的，View也没有提供相应的接口；而在MVP当中，Presenter可以操作View，View需要提供一组对界面操作的接口给Presenter进行调用；Model仍然通过事件广播自己的变更，但由Presenter监听而不是View。

MVP模式，这里也提供一个用[JavaScript编写的例子](https://github.com/livoras/MVW-demos/tree/master/src/scripts/mvp)。

#### MVP（Passive View）的优缺点

优点：

1. 便于测试。Presenter对View是通过接口进行，在对Presenter进行不依赖UI环境的单元测试的时候。可以通过Mock一个View对象，这个对象只需要实现了View的接口即可。然后依赖注入到Presenter中，单元测试的时候就可以完整的测试Presenter业务逻辑的正确性。这里根据上面的例子给出了Presenter的[单元测试样例](https://github.com/livoras/MVW-demos/tree/master/test/mvp)。
2. View可以进行组件化。在MVP当中，View不依赖Model。这样就可以让View从特定的业务场景中脱离出来，可以说View可以做到对业务逻辑完全无知。它只需要提供一系列接口提供给上层操作。这样就可以做到高度可复用的View组件。

缺点：

1. Presenter中除了业务逻辑以外，还有大量的View->Model，Model->View的手动同步逻辑，造成Presenter比较笨重，维护起来��比较困难。

### MVP（Supervising Controller）

上面讲的是MVP的Passive View模式，该模式下View非常Passive，它几乎什么都不知道，Presenter让它干什么它就干什么。而Supervising Controller模式中，Presenter会把一部分简单的同步逻辑交给View自己去做，Presenter只负责比较复杂的、高层次的UI操作，所以可以把它看成一个Supervising Controller。

Supervising Controller模式下的依赖和调用关系：

![img](http://www.linuxidc.com/upload/2015_10/151028172463739.png)

因为Supervising Controller用得比较少，对它的讨论就到这里为止。

## MVVM

MVVM可以看作是一种特殊的MVP（Passive View）模式，或者说是对MVP模式的一种改良。

### ViewModel

MVVM代表的是Model-View-ViewModel，这里需要解释一下什么是ViewModel。ViewModel的含义就是 "Model of View"，视图的模型。它的含义包含了领域模型（Domain Model）和视图的状态（State）。 在图形界面应用程序当中，界面所提供的信息可能不仅仅包含应用程序的领域模型。还可能包含一些领域模型不包含的视图状态，例如电子表格程序上需要显示当前排序的状态是顺序的还是逆序的，而这是Domain Model所不包含的，但也是需要显示的信息。

可以简单把ViewModel理解为页面上所显示内容的数据抽象，和Domain Model不一样，ViewModel更适合用来描述View。

### MVVM的依赖

MVVM的依赖关系和MVP依赖，只不过是把P换成了VM。

![img](http://www.linuxidc.com/upload/2015_10/1510281724637310.png)

### MVVM的调用关系

MVVM的调用关系和MVP一样。但是，在ViewModel当中会有一个叫Binder，或者是Data-binding engine的东西。以前全部由Presenter负责的View和Model之间数据同步操作交由给Binder处理。你只需要在View的模版语法当中，指令式地声明View上的显示的内容是和Model的哪一块数据绑定的。当ViewModel对进行Model更新的时候，Binder会自动把数据更新到View上去，当用户对View进行操作（例如表单输入），Binder也会自动把数据更新到Model上去。这种方式称为：Two-way data-binding，双向数据绑定。可以简单而不恰当地理解为一个模版引擎，但是会根据数据变更实时渲染。

![img](http://www.linuxidc.com/upload/2015_10/1510281724637311.png)

也就是说，MVVM把View和Model的同步逻辑自动化了。以前Presenter负责的View和Model同步不再手动地进行操作，而是交由框架所提供的Binder进行负责。只需要告诉Binder，View显示的数据对应的是Model哪一部分即可。

这里有一个JavaScript MVVM的[例子](https://github.com/livoras/MVW-demos/tree/master/src/scripts/mvvm.js)，因为MVVM需要Binder引擎。所以例子中使用了一个MVVM的库：[Vue.js](http://vuejs.org/)。

### MVVM的优缺点

**优点**：

1. 提高可维护性。解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制。提高了代码的可维护性。
2. 简化测试。因为同步逻辑是交由Binder做的，View跟着Model同时变更，所以只需要保证Model的正确性，View就正确。大大减少了对View同步更新的测试。

**缺点**：

1. 过于简单的图形界面不适用，或说牛刀杀鸡。
2. 对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高。
3. 数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的。

