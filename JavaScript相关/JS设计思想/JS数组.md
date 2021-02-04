- - [JS中的数组](#js中的数组)
  - 从V8源码看数组的实现
    - [快数组（Fast Elements）](#快数组fast-elements)
    - [慢数组（Dictionary Elements）](#慢数组dictionary-elements)
    - [快数组慢数组之间的转换](#快数组慢数组之间的转换)
    - [总的来说](#总的来说)
    - 
  - [拓展：ArrayBuffer](#拓展arraybuffer)



> 在计算机学科中，数组是由**相同类型**的元素的集合所组成的数据结构，分配一块**连续的内存**来存储，利用元素的索引可以计算出该元素对应的存储地址。 ——维基百科

## JS中的数组

JS的数据类型可以存放不同的数据类型，并且可以像队列和栈一样使用数组，并且不用事先定义规定长度。

## 从V8源码看数组的实现

```
class JSArray : public JSObject{
```

首先，JSArray是继承自JSObject，也就是说，**数组是一个特殊的对象**，所以JS数组可以存放不同的数据类型，内部也是key-value的存储形式。key为0,1,2,3这种索引，value就是数组的元素。

JS数组有两种表现形式，fast和slow：

**fast 快数组**

- 快速的后备存储结构是FixedArray，并且数组长度 <= elements.length()
- FixedArray 是V8实现的一个类似于数组的类，它表示一段固定长度的连续的内存。

**slow 慢数组**

- 缓慢的后备存储结构是一个以数字为键的HashTable
- 散列表（Hash table，也叫哈希表），是根据键（Key）而直接访问在内存存储位置的数据结构。也就是说，它通过计算一个关于键值的函数，将所需查询的数据映射到表中一个位置来访问记录，这加快了查找速度。这个映射函数称做散列函数，存放记录的数组称做散列表。

### 快数组（Fast Elements）

> 快数组是一种线性的存储方式。新创建的空数组，默认的存储方式是快数组，快数组长度是可变的，可以根据元素的增加和删除来动态调整存储空间大小，内部是通过扩容和收缩机制实现。

**扩容** ![扩容](https://user-gold-cdn.xitu.io/2019/10/9/16daf8b7919824f9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1&ynotemdtimestamp=1612407166483)新容量计算： ![容量计算](https://user-gold-cdn.xitu.io/2019/10/9/16daf8b79d4dbbef?imageView2/0/w/1280/h/960/format/webp/ignore-error/1&ynotemdtimestamp=1612407166483)

```
new_capacity = old_capacity/2 + old_capacity + 16
```

也就是，扩容后的新容量 = 旧容量的1.5倍 + 16。

扩容后会将数组拷贝到新的内存空间中 ![数组拷贝](https://user-gold-cdn.xitu.io/2019/10/9/16daf8b81e4a63ae?imageView2/0/w/1280/h/960/format/webp/ignore-error/1&ynotemdtimestamp=1612407166483)

**收缩** ![缩容](https://user-gold-cdn.xitu.io/2019/10/9/16daf8b8b119c968?imageView2/0/w/1280/h/960/format/webp/ignore-error/1&ynotemdtimestamp=1612407166483)收缩数组的判断是： 如果容量 >= length的2倍 + 16，则进行收缩容量调整，否则用**holes对象**填充未被初始化的位置。

收缩大小：根据 length + 1 和 old_length 进行判断，是将空出的空间全部收缩掉还是只收缩二分之一。

**holes对象**

> holes （空洞）对象指的是数组中分配了空间，但是没有存放元素的位置。对于holes，快数组中有个专门的模式，在 Fast Elements 模式中有一个扩展，是**Fast Holey Elements**模式。

Fast Holey Elements 模式适合于数组中的 holes （空洞）情况，即只有某些索引存有数据，而其他的索引都没有赋值的情况。

当数组中有空洞，没有赋值的数组索引将会存储一个特殊的值，这样在访问这些位置时就可以得到 undefined。这种情况下就会是 Fast Holey Elements 模式。

Fast Holey Elements 模式与Fast Elements 模式一样，会动态分配连续的存储空间，分配空间的大小由最大的索引值决定。

新建数组时，如果没有设置容量，V8会默认使用 Fast Elements 模式实现。

如果要对数组设置容量，但并没有进行内部元素的初始化，例如`let a = new Array(10);`，这样的话数组内部就存在了空洞，就会以Fast Holey Elements 模式实现。

### 慢数组（Dictionary Elements）

慢数组是一种哈希表的内存形式。不用开辟大块连续的存储空间，节省了内存，但是由于需要维护这样一个 HashTable，其效率会比快数组低。

源码中 Dictionary 的结构 ![Dict](https://user-gold-cdn.xitu.io/2019/10/9/16daf8b935661f64?imageView2/0/w/1280/h/960/format/webp/ignore-error/1&ynotemdtimestamp=1612407166483)可以看到，内部是一个HashTable，然后定义了一些操作方法，和 Java 的 HashMap类似。

### 快数组慢数组之间的转换

**块 -> 慢**

- 新容量 >= 3*扩容后的容量*2，会转变为慢数组
- 当加入的index- 当前capacity >= kMaxGap（1024） 时（也就是至少有了 1024 个空洞），会转变为慢数组。

也就是说，当对数组赋值时使用远超当前数组的容量+ 1024时（这样出现了大于等于 1024 个空洞，这时候要对数组分配大量空间则将可能造成存储空间的浪费，为了空间的优化，会转化为慢数组。

**慢 -> 快**

处于哈希表实现的数组，在每次空间增长时， V8 的启发式算法会检查其空间占用量， 若其空洞元素减少到一定程度，则会将其转化为快数组模式。

当慢数组的元素可存放在快数组中且长度在 smi 之间且仅节省了50%的空间，则会转变为快数组。（smi在64位平台为 -231到231-1，在32位平台为-230到230-1）

### 总的来说

两者各有优劣，快数组就是以空间换时间的方式，申请了大块连续内存，提高效率。 慢数组以时间换空间，不必申请连续的空间，节省了内存，但需要付出效率变差的代价。

## 拓展：ArrayBuffer

JS在ES6也推出了可以按照需要分配连续内存的数组，这就是ArrayBuffer。

ArrayBuffer会从内存中申请设定的二进制大小的空间，但是并不能直接操作它，需要通过ArrayBuffer构建一个视图，通过视图来操作这个内存。

```
var bf = new ArrayBuffer(1024); 
```

这行代码就申请了 1kb 的内存区域。但是并不能对 arrayBuffer 直接操作，需要将它赋给一个视图来操作内存。

```
var b = new Int32Array(bf);
```

这行代码创建了有符号的32位的整数数组，每个数占 4 字节，长度也就是 1024 / 4 = 256 个。